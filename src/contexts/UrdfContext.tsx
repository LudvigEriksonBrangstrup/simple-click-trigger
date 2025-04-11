import React, {
  createContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
  useEffect,
} from "react";
import { toast } from "sonner";
import { useUrdfParser } from "@/hooks/useUrdfParser";
import { UrdfProcessor, readUrdfFileContent } from "@/lib/urdfDragAndDrop";
import { UrdfData, UrdfFileModel } from "@/lib/types";
import { useDefaultRobotData } from "@/hooks/useDefaultRobotData";

// Define the result interface for URDF detection
interface UrdfDetectionResult {
  hasUrdf: boolean;
  modelName?: string;
  parsedData?: UrdfData | null;
}

// Define the context type
export type UrdfContextType = {
  urdfProcessor: UrdfProcessor | null;
  registerUrdfProcessor: (processor: UrdfProcessor) => void;
  onUrdfDetected: (
    callback: (result: UrdfDetectionResult) => void
  ) => () => void;
  processUrdfFiles: (
    files: Record<string, File>,
    availableModels: string[]
  ) => Promise<void>;
  urdfBlobUrls: Record<string, string>;
  alternativeUrdfModels: string[];
  isSelectionModalOpen: boolean;
  setIsSelectionModalOpen: (isOpen: boolean) => void;
  urdfModelOptions: UrdfFileModel[];
  selectUrdfModel: (model: UrdfFileModel) => void;

  // New properties for centralized robot data management
  currentRobotData: UrdfData | null;
  isDefaultModel: boolean;
  setIsDefaultModel: (isDefault: boolean) => void;
  parsedRobotData: UrdfData | null; // Data from parsed URDF
  customModelName: string;
  customModelDescription: string;
  resetToDefaultModel: () => void;
};

// Create the context
export const UrdfContext = createContext<UrdfContextType | undefined>(
  undefined
);

// Props for the provider component
interface UrdfProviderProps {
  children: ReactNode;
}

export const UrdfProvider: React.FC<UrdfProviderProps> = ({ children }) => {
  // State for URDF processor
  const [urdfProcessor, setUrdfProcessor] = useState<UrdfProcessor | null>(
    null
  );

  // State for blob URLs (replacing window.urdfBlobUrls)
  const [urdfBlobUrls, setUrdfBlobUrls] = useState<Record<string, string>>({});

  // State for alternative models (replacing window.alternativeUrdfModels)
  const [alternativeUrdfModels, setAlternativeUrdfModels] = useState<string[]>(
    []
  );

  // State for the URDF selection modal
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [urdfModelOptions, setUrdfModelOptions] = useState<UrdfFileModel[]>([]);

  // New state for centralized robot data management
  const [isDefaultModel, setIsDefaultModel] = useState(true);
  const [parsedRobotData, setParsedRobotData] = useState<UrdfData | null>(null);
  const [customModelName, setCustomModelName] = useState<string>("");
  const [customModelDescription, setCustomModelDescription] =
    useState<string>("");

  // Get default robot data from our hook
  const { data: defaultRobotData } = useDefaultRobotData("T12");

  // Compute the current robot data based on model state
  const currentRobotData = isDefaultModel ? defaultRobotData : parsedRobotData;

  // Log data state changes for debugging
  useEffect(() => {
    console.log("🤖 Robot data context updated:", {
      isDefaultModel,
      hasDefaultData: !!defaultRobotData,
      hasParsedData: !!parsedRobotData,
      currentData: currentRobotData ? "available" : "null",
    });
  }, [isDefaultModel, defaultRobotData, parsedRobotData, currentRobotData]);

  // Reference for callbacks
  const urdfCallbacksRef = useRef<((result: UrdfDetectionResult) => void)[]>(
    []
  );

  // Get the parseUrdf function from the useUrdfParser hook
  const { parseUrdf } = useUrdfParser();

  // Reset to default model
  const resetToDefaultModel = useCallback(() => {
    setIsDefaultModel(true);
    setCustomModelName("");
    setCustomModelDescription("");
    setParsedRobotData(null);

    toast.info("Switched to default model", {
      description: "The default T12 robot model is now displayed.",
    });
  }, []);

  // Register a callback for URDF detection
  const onUrdfDetected = useCallback(
    (callback: (result: UrdfDetectionResult) => void) => {
      urdfCallbacksRef.current.push(callback);

      return () => {
        urdfCallbacksRef.current = urdfCallbacksRef.current.filter(
          (cb) => cb !== callback
        );
      };
    },
    []
  );

  // Register a URDF processor
  const registerUrdfProcessor = useCallback((processor: UrdfProcessor) => {
    setUrdfProcessor(processor);
  }, []);

  // Internal function to notify callbacks and update central state
  const notifyUrdfCallbacks = useCallback(
    (result: UrdfDetectionResult) => {
      console.log("📣 Notifying URDF callbacks with result:", result);

      // Update our internal state based on the result
      if (result.hasUrdf) {
        setIsDefaultModel(false);

        if (result.parsedData) {
          setParsedRobotData(result.parsedData);

          if (result.parsedData.name) {
            setCustomModelName(result.parsedData.name);
          } else if (result.modelName) {
            setCustomModelName(result.modelName);
          }

          if (result.parsedData.description) {
            setCustomModelDescription(result.parsedData.description);
          }
        } else if (result.modelName) {
          setCustomModelName(result.modelName);
        }
      } else {
        // If no URDF, reset to default
        resetToDefaultModel();
      }

      // Call all registered callbacks
      urdfCallbacksRef.current.forEach((callback) => callback(result));
    },
    [resetToDefaultModel]
  );

  // Helper function to process the selected URDF model
  const processSelectedUrdf = useCallback(
    async (model: UrdfFileModel) => {
      if (!urdfProcessor) return;

      // Find the file in our files record
      const files = Object.values(urdfBlobUrls)
        .filter((url) => url === model.blobUrl)
        .map((url) => {
          const path = Object.keys(urdfBlobUrls).find(
            (key) => urdfBlobUrls[key] === url
          );
          return path ? { path, url } : null;
        })
        .filter((item) => item !== null);

      if (files.length === 0) {
        console.error("❌ Could not find file for selected URDF model");
        return;
      }

      // Show a toast notification that we're parsing the URDF
      const parsingToast = toast.loading("Analyzing URDF model...", {
        description: "Extracting robot information",
        duration: 10000, // Long duration since we'll dismiss it manually
      });

      try {
        // Get the file from our record
        const filePath = files[0]?.path;
        if (!filePath || !urdfBlobUrls[filePath]) {
          throw new Error("File not found in records");
        }

        // Get the actual File object
        const response = await fetch(model.blobUrl);
        const blob = await response.blob();
        const file = new File(
          [blob],
          filePath.split("/").pop() || "model.urdf",
          {
            type: "application/xml",
          }
        );

        // Read the URDF content
        const urdfContent = await readUrdfFileContent(file);

        console.log(
          `📏 URDF content read, length: ${urdfContent.length} characters`
        );

        // Parse the URDF
        const parseResult = await parseUrdf(urdfContent);

        // Dismiss the toast
        toast.dismiss(parsingToast);

        if (parseResult) {
          // Success case - we have parsed data
          const modelDisplayName =
            model.name || model.path.split("/").pop() || "Unknown";

          // Update the state with parsed data to update UI components
          setParsedRobotData(parseResult);

          // Update model name and description if available in parsed data
          if (parseResult.name) {
            setCustomModelName(parseResult.name);
          }

          if (parseResult.description) {
            setCustomModelDescription(parseResult.description);
          }

          toast.success("URDF model loaded successfully", {
            description: `Model: ${modelDisplayName}`,
            duration: 3000,
          });

          // Notify callbacks with the parsed data
          notifyUrdfCallbacks({
            hasUrdf: true,
            modelName: parseResult.name || modelDisplayName,
            parsedData: parseResult,
          });
        } else {
          // Partial success case - we loaded the model but couldn't fully parse it
          toast.warning("URDF model loaded with limited information", {
            description: "Could not fully analyze the robot structure",
            duration: 3000,
          });

          // Make sure we're still using the custom model even with limited data
          setIsDefaultModel(false);
        }
      } catch (error) {
        // Error case
        console.error("❌ Error processing selected URDF:", error);
        toast.dismiss(parsingToast);
        toast.error("Error analyzing URDF", {
          description: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
          duration: 3000,
        });

        // Keep showing the custom model even if parsing failed
        // No need to reset to default unless user explicitly chooses to
      }
    },
    [urdfBlobUrls, urdfProcessor, parseUrdf, notifyUrdfCallbacks]
  );

  // Function to handle selecting a URDF model from the modal
  const selectUrdfModel = useCallback(
    (model: UrdfFileModel) => {
      if (!urdfProcessor) {
        console.error("❌ No URDF processor available");
        return;
      }

      console.log(`🤖 Selected model: ${model.name || model.path}`);

      // Close the modal
      setIsSelectionModalOpen(false);

      // Extract model name
      const modelName =
        model.name ||
        model.path
          .split("/")
          .pop()
          ?.replace(/\.urdf$/i, "") ||
        "Unknown";

      // Load the selected URDF model
      urdfProcessor.loadUrdf(model.blobUrl);

      // Update our state immediately even before parsing
      setIsDefaultModel(false);
      setCustomModelName(modelName);

      // Show a toast notification that we're loading the model
      toast.info(`Loading model: ${modelName}`, {
        description: "Preparing 3D visualization",
        duration: 2000,
      });

      // Notify callbacks about the selection before parsing
      notifyUrdfCallbacks({
        hasUrdf: true,
        modelName,
        parsedData: undefined, // Will use parseUrdf later to get the data
      });

      // Try to parse the model - this will update the UI when complete
      processSelectedUrdf(model);
    },
    [urdfProcessor, notifyUrdfCallbacks, processSelectedUrdf]
  );

  // Process URDF files - moved from DragAndDropContext
  const processUrdfFiles = useCallback(
    async (files: Record<string, File>, availableModels: string[]) => {
      // Clear previous blob URLs to prevent memory leaks
      Object.values(urdfBlobUrls).forEach(URL.revokeObjectURL);
      setUrdfBlobUrls({});
      setAlternativeUrdfModels([]);
      setUrdfModelOptions([]);

      try {
        // Check if we have any URDF files
        if (availableModels.length > 0 && urdfProcessor) {
          console.log(
            `🤖 Found ${availableModels.length} URDF models:`,
            availableModels
          );

          // Create blob URLs for all models
          const newUrdfBlobUrls: Record<string, string> = {};
          availableModels.forEach((path) => {
            if (files[path]) {
              newUrdfBlobUrls[path] = URL.createObjectURL(files[path]);
            }
          });
          setUrdfBlobUrls(newUrdfBlobUrls);

          // Save alternative models for reference
          setAlternativeUrdfModels(availableModels);

          // Create model options for the selection modal
          const modelOptions: UrdfFileModel[] = availableModels.map((path) => {
            const fileName = path.split("/").pop() || "";
            const modelName = fileName.replace(/\.urdf$/i, "");
            return {
              path,
              blobUrl: newUrdfBlobUrls[path],
              name: modelName,
            };
          });

          setUrdfModelOptions(modelOptions);

          // If there's only one model, use it directly
          if (availableModels.length === 1) {
            // Extract model name from the URDF file
            const fileName = availableModels[0].split("/").pop() || "";
            const modelName = fileName.replace(/\.urdf$/i, "");
            console.log(`📄 Using model: ${modelName} (${fileName})`);

            // Use the blob URL instead of the file path
            const blobUrl = newUrdfBlobUrls[availableModels[0]];
            if (blobUrl) {
              console.log(`🔗 Using blob URL for URDF: ${blobUrl}`);
              urdfProcessor.loadUrdf(blobUrl);

              // Immediately update model state
              setIsDefaultModel(false);
              setCustomModelName(modelName);

              // Process the URDF file for parsing
              if (files[availableModels[0]]) {
                console.log(
                  "📄 Reading URDF content for edge function parsing..."
                );

                // Show a toast notification that we're parsing the URDF
                const parsingToast = toast.loading("Analyzing URDF model...", {
                  description: "Extracting robot information",
                  duration: 10000, // Long duration since we'll dismiss it manually
                });

                try {
                  const urdfContent = await readUrdfFileContent(
                    files[availableModels[0]]
                  );

                  console.log(
                    `📏 URDF content read, length: ${urdfContent.length} characters`
                  );

                  // Call the parseUrdf function from the hook
                  const parseResult = await parseUrdf(urdfContent);

                  // Dismiss the parsing toast
                  toast.dismiss(parsingToast);

                  if (parseResult) {
                    toast.success("URDF model analyzed successfully", {
                      description: `Model: ${modelName}`,
                      duration: 3000,
                    });

                    // Update state with the parsed data
                    setParsedRobotData(parseResult);

                    // Update name and description if available in the parsed data
                    if (parseResult.name) {
                      setCustomModelName(parseResult.name);
                    }
                    if (parseResult.description) {
                      setCustomModelDescription(parseResult.description);
                    }

                    // Notify callbacks with all the information
                    notifyUrdfCallbacks({
                      hasUrdf: true,
                      modelName: parseResult.name || modelName,
                      parsedData: parseResult,
                    });
                  } else {
                    toast.warning(
                      "URDF model loaded with limited information",
                      {
                        description:
                          "Could not fully analyze the robot structure",
                        duration: 3000,
                      }
                    );

                    // Still notify callbacks without parsed data
                    notifyUrdfCallbacks({
                      hasUrdf: true,
                      modelName,
                    });
                  }
                } catch (parseError) {
                  console.error("❌ Error parsing URDF:", parseError);
                  toast.dismiss(parsingToast);
                  toast.error("Error analyzing URDF", {
                    description: `Error: ${
                      parseError instanceof Error
                        ? parseError.message
                        : String(parseError)
                    }`,
                    duration: 3000,
                  });

                  // Still notify callbacks without parsed data
                  notifyUrdfCallbacks({
                    hasUrdf: true,
                    modelName,
                  });
                }
              } else {
                console.error(
                  "❌ Could not find file for URDF model:",
                  availableModels[0]
                );
                console.log("📦 Available files:", Object.keys(files));

                // Still notify callbacks without parsed data
                notifyUrdfCallbacks({
                  hasUrdf: true,
                  modelName,
                });
              }
            } else {
              console.warn(
                `⚠️ No blob URL found for ${availableModels[0]}, using path directly`
              );
              urdfProcessor.loadUrdf(availableModels[0]);

              // Update the state even without a blob URL
              setIsDefaultModel(false);
              setCustomModelName(modelName);

              // Notify callbacks
              notifyUrdfCallbacks({
                hasUrdf: true,
                modelName,
              });
            }
          } else {
            // Multiple URDF files found, show selection modal
            console.log(
              "📋 Multiple URDF files found, showing selection modal"
            );
            setIsSelectionModalOpen(true);

            // Notify that URDF files are available but selection is needed
            notifyUrdfCallbacks({
              hasUrdf: true,
              modelName: "Multiple models available",
            });
          }
        } else {
          console.warn(
            "❌ No URDF models found in dropped files or no processor available"
          );
          notifyUrdfCallbacks({ hasUrdf: false, parsedData: null });

          // Reset to default model when no URDF files are found
          resetToDefaultModel();

          toast.error("No URDF file found", {
            description: "Please upload a folder containing a .urdf file.",
            duration: 3000,
          });
        }
      } catch (error) {
        console.error("❌ Error processing URDF files:", error);
        toast.error("Error processing files", {
          description: `Error: ${
            error instanceof Error ? error.message : String(error)
          }`,
          duration: 3000,
        });

        // Reset to default model on error
        resetToDefaultModel();
      }
    },
    [
      notifyUrdfCallbacks,
      parseUrdf,
      urdfBlobUrls,
      urdfProcessor,
      resetToDefaultModel,
    ]
  );

  // Clean up blob URLs when component unmounts
  React.useEffect(() => {
    return () => {
      Object.values(urdfBlobUrls).forEach(URL.revokeObjectURL);
    };
  }, [urdfBlobUrls]);

  // Create the context value
  const contextValue: UrdfContextType = {
    urdfProcessor,
    registerUrdfProcessor,
    onUrdfDetected,
    processUrdfFiles,
    urdfBlobUrls,
    alternativeUrdfModels,
    isSelectionModalOpen,
    setIsSelectionModalOpen,
    urdfModelOptions,
    selectUrdfModel,

    // New properties for centralized robot data management
    currentRobotData,
    isDefaultModel,
    setIsDefaultModel,
    parsedRobotData,
    customModelName,
    customModelDescription,
    resetToDefaultModel,
  };

  return (
    <UrdfContext.Provider value={contextValue}>{children}</UrdfContext.Provider>
  );
};
