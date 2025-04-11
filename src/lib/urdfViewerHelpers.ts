import { LoadingManager, Object3D } from "three";
import { toast } from "sonner";
import { loadMeshFile } from "./meshLoaders";
import { URDFViewerElement } from "./urdfAnimationHelpers";

// Extended URDF Viewer Element with mesh loading capability
export interface ExtendedURDFViewerElement extends URDFViewerElement {
  loadMeshFunc: (
    path: string,
    manager: LoadingManager,
    done: (result: Object3D | null, err?: Error) => void
  ) => void;
}

/**
 * Creates and configures a URDF viewer element
 */
export function createUrdfViewer(
  container: HTMLDivElement,
  isDarkMode: boolean
): ExtendedURDFViewerElement {
  // Clear any existing content
  container.innerHTML = "";

  // Create the urdf-viewer element
  const viewer = document.createElement(
    "urdf-viewer"
  ) as ExtendedURDFViewerElement;
  viewer.classList.add("w-full", "h-full");

  // Add the element to the container
  container.appendChild(viewer);

  // Set initial viewer properties
  viewer.setAttribute("up", "Z");
  viewer.setAttribute("highlight-color", isDarkMode ? "#5b9aff" : "#3373ff");
  viewer.setAttribute("ambient-color", isDarkMode ? "#202a30" : "#cfd8dc");
  viewer.setAttribute("auto-redraw", "true");
  viewer.setAttribute("display-shadow", ""); // Enable shadows

  return viewer;
}

/**
 * Setup mesh loading function for URDF viewer
 */
export function setupMeshLoader(
  viewer: ExtendedURDFViewerElement,
  urlModifierFunc: ((url: string) => string) | null
): void {
  if ("loadMeshFunc" in viewer) {
    viewer.loadMeshFunc = (
      path: string,
      manager: LoadingManager,
      done: (result: Object3D | null, err?: Error) => void
    ) => {
      // Apply URL modifier if available (for custom uploads)
      const modifiedPath = urlModifierFunc ? urlModifierFunc(path) : path;

      // If loading fails, log the error but continue
      try {
        loadMeshFile(modifiedPath, manager, (result, err) => {
          if (err) {
            console.warn(`Error loading mesh ${modifiedPath}:`, err);
            // Try to continue with other meshes
            done(null);
          } else {
            done(result);
          }
        });
      } catch (err) {
        console.error(`Exception loading mesh ${modifiedPath}:`, err);
        done(null, err as Error);
      }
    };
  }
}

/**
 * Setup event handlers for joint highlighting
 */
export function setupJointHighlighting(
  viewer: URDFViewerElement,
  setHighlightedJoint: (joint: string | null) => void
): () => void {
  const onJointMouseover = (e: Event) => {
    const customEvent = e as CustomEvent;
    setHighlightedJoint(customEvent.detail);
  };

  const onJointMouseout = () => {
    setHighlightedJoint(null);
  };

  // Add event listeners
  viewer.addEventListener("joint-mouseover", onJointMouseover);
  viewer.addEventListener("joint-mouseout", onJointMouseout);

  // Return cleanup function
  return () => {
    viewer.removeEventListener("joint-mouseover", onJointMouseover);
    viewer.removeEventListener("joint-mouseout", onJointMouseout);
  };
}

/**
 * Setup model loading and error handling
 */
export function setupModelLoading(
  viewer: URDFViewerElement,
  urdfPath: string,
  packagePath: string,
  setCustomUrdfPath: (path: string) => void,
  alternativeUrdfModels: string[] = [] // Add parameter for alternative models
): () => void {
  // Add XML content type hint for blob URLs
  const loadPath =
    urdfPath.startsWith("blob:") && !urdfPath.includes("#.")
      ? urdfPath + "#.urdf" // Add extension hint if it's a blob URL
      : urdfPath;

  // Set the URDF path
  viewer.setAttribute("urdf", loadPath);
  viewer.setAttribute("package", packagePath);

  // Handle error loading
  const onLoadError = () => {
    toast.error("Failed to load model", {
      description: "There was an error loading the URDF model.",
      duration: 3000,
    });

    // Use the provided alternativeUrdfModels instead of the global window object
    if (alternativeUrdfModels.length > 0) {
      const nextModel = alternativeUrdfModels[0];
      if (nextModel) {
        setCustomUrdfPath(nextModel);
        toast.info("Trying alternative model...", {
          description: `First model failed to load. Trying ${
            nextModel.split("/").pop() || "alternative model"
          }`,
          duration: 2000,
        });
      }
    }
  };

  viewer.addEventListener("error", onLoadError);

  // Return cleanup function
  return () => {
    viewer.removeEventListener("error", onLoadError);
  };
}

// For backward compatibility - to be removed in the future
declare global {
  interface Window {
    alternativeUrdfModels?: string[];
  }
}
