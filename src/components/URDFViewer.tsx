import React, { useEffect, useRef, useState, useMemo } from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

import { useTheme } from "@/hooks/useTheme";
import URDFManipulator from "urdf-loader/src/urdf-manipulator-element.js";
import { useUrdf } from "@/hooks/useUrdf";
import {
  animateHexapodRobot,
  animateRobot,
  cassieWalkingConfig,
} from "@/lib/urdfAnimationHelpers";
import {
  createUrdfViewer,
  setupMeshLoader,
  setupJointHighlighting,
  setupModelLoading,
} from "@/lib/urdfViewerHelpers";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "./ModeToggle";

// Register the URDFManipulator as a custom element if it hasn't been already
if (typeof window !== "undefined" && !customElements.get("urdf-viewer")) {
  customElements.define("urdf-viewer", URDFManipulator);
}

// Extend the interface for the URDF viewer element to include background property
interface URDFViewerElement extends HTMLElement {
  background?: string;
  setJointValue?: (jointName: string, value: number) => void;
}

interface URDFViewerProps {
  hasAnimation?: boolean;
}

// Import the Cassie walking configuration
// This is now imported from urdfAnimationHelpers.ts so we don't need to define it here

const URDFViewer: React.FC<URDFViewerProps> = ({ hasAnimation = false }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightedJoint, setHighlightedJoint] = useState<string | null>(null);
  const { registerUrdfProcessor, alternativeUrdfModels, isDefaultModel } =
    useUrdf();

  // Add state for animation control
  const [isAnimating, setIsAnimating] = useState<boolean>(isDefaultModel);
  const [showAnimationControl, setShowAnimationControl] = useState<boolean>(
    isDefaultModel || hasAnimation
  );
  const cleanupAnimationRef = useRef<(() => void) | null>(null);
  const viewerRef = useRef<URDFViewerElement | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Add state for custom URDF path
  const [customUrdfPath, setCustomUrdfPath] = useState<string | null>(null);
  const [urlModifierFunc, setUrlModifierFunc] = useState<
    ((url: string) => string) | null
  >(null);

  const packageRef = useRef<string>("");

  // Implement UrdfProcessor interface for drag and drop
  const urdfProcessor = useMemo(
    () => ({
      loadUrdf: (urdfPath: string) => {
        setCustomUrdfPath(urdfPath);
      },
      setUrlModifierFunc: (func: (url: string) => string) => {
        setUrlModifierFunc(() => func);
      },
      getPackage: () => {
        return packageRef.current;
      },
    }),
    []
  );

  // Register the URDF processor with the global drag and drop context
  useEffect(() => {
    registerUrdfProcessor(urdfProcessor);
  }, [registerUrdfProcessor, urdfProcessor]);

  // Effect to update animation control visibility based on props
  useEffect(() => {
    // Show animation controls for default model or when hasAnimation is true
    setShowAnimationControl(isDefaultModel || hasAnimation);
  }, [isDefaultModel, hasAnimation]);

  // Toggle animation function
  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  // Main effect to create and setup the viewer only once
  useEffect(() => {
    if (!containerRef.current) return;

    // Create and configure the URDF viewer element
    const viewer = createUrdfViewer(containerRef.current, isDarkMode);
    viewerRef.current = viewer; // Store reference to the viewer

    // Setup mesh loading function
    setupMeshLoader(viewer, urlModifierFunc);

    // Determine which URDF to load
    const urdfPath = isDefaultModel
      ? "/urdf/T12/urdf/T12.URDF"
      : customUrdfPath || "";

    // Setup model loading if a path is available
    let cleanupModelLoading = () => {};
    if (urdfPath) {
      cleanupModelLoading = setupModelLoading(
        viewer,
        urdfPath,
        packageRef.current,
        setCustomUrdfPath,
        alternativeUrdfModels
      );
    }

    // Setup joint highlighting
    const cleanupJointHighlighting = setupJointHighlighting(
      viewer,
      setHighlightedJoint
    );

    // Setup animation event handler for the default model or when hasAnimation is true
    const onModelProcessed = () => {
      hasInitializedRef.current = true;
      if (isAnimating && "setJointValue" in viewer) {
        // Clear any existing animation
        if (cleanupAnimationRef.current) {
          cleanupAnimationRef.current();
          cleanupAnimationRef.current = null;
        }

        // Use the appropriate animation based on whether it's the default model or hasAnimation
        if (isDefaultModel) {
          // Start the hexapod animation when it's the default model
          cleanupAnimationRef.current = animateHexapodRobot(
            viewer as import("@/lib/urdfAnimationHelpers").URDFViewerElement
          );
        } else if (hasAnimation) {
          // Start the Cassie walking animation for custom models with hasAnimation=true
          cleanupAnimationRef.current = animateRobot(
            viewer as import("@/lib/urdfAnimationHelpers").URDFViewerElement,
            cassieWalkingConfig
          );
        }
      }
    };

    viewer.addEventListener("urdf-processed", onModelProcessed);

    // Return cleanup function
    return () => {
      if (cleanupAnimationRef.current) {
        cleanupAnimationRef.current();
        cleanupAnimationRef.current = null;
      }
      hasInitializedRef.current = false;
      cleanupJointHighlighting();
      cleanupModelLoading();
      viewer.removeEventListener("urdf-processed", onModelProcessed);
    };
  }, [isDefaultModel, customUrdfPath, urlModifierFunc, hasAnimation]);

  // Separate effect to handle theme changes without recreating the viewer
  useEffect(() => {
    if (!viewerRef.current) return;

    // Update only the visual aspects based on theme
    if (viewerRef.current.background !== undefined) {
      if (isDarkMode) {
        viewerRef.current.background = "#1f2937"; // Dark background
      } else {
        viewerRef.current.background = "#e0e7ff"; // Light background
      }
    }
  }, [isDarkMode]);

  // Effect to handle animation toggling after initial load
  useEffect(() => {
    if (!viewerRef.current || !hasInitializedRef.current) return;

    // Only manage animation if viewer has setJointValue (required for animation)
    if (!("setJointValue" in viewerRef.current)) return;

    if (isAnimating) {
      if (!cleanupAnimationRef.current) {
        // Only start animation if it's not already running
        if (isDefaultModel) {
          cleanupAnimationRef.current = animateHexapodRobot(
            viewerRef.current as import("@/lib/urdfAnimationHelpers").URDFViewerElement
          );
        } else if (hasAnimation) {
          // Start Cassie walking animation using the imported config
          cleanupAnimationRef.current = animateRobot(
            viewerRef.current as import("@/lib/urdfAnimationHelpers").URDFViewerElement,
            cassieWalkingConfig
          );
        }
      }
    } else {
      if (cleanupAnimationRef.current) {
        // Just cancel the animation frame without resetting anything
        cleanupAnimationRef.current();
        cleanupAnimationRef.current = null;
      }
    }
  }, [isAnimating, isDefaultModel, hasAnimation]);

  return (
    <div
      className={cn(
        "w-full h-full transition-all duration-300 ease-in-out relative",
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800"
          : "bg-gradient-to-br from-blue-50 to-indigo-50"
      )}
    >
      <div ref={containerRef} className="w-full h-full" />

      {/* Control buttons container in top right */}
      <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
        {/* ModeToggle button */}
        <ModeToggle />

        {/* Animation control button with icon - show for both default model and when animation is available */}
        {showAnimationControl && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleAnimation}
                  className={cn(
                    "p-2.5 rounded-full shadow-md transition-all duration-300",
                    isDarkMode
                      ? "bg-gray-700 hover:bg-gray-600 text-white"
                      : "bg-white/80 hover:bg-white text-gray-800"
                  )}
                  aria-label={
                    isAnimating ? "Stop Animation" : "Start Animation"
                  }
                >
                  {isAnimating ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-mono text-xs">
                  {isAnimating ? "Stop Animation" : "Start Animation"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Joint highlight indicator */}
      {highlightedJoint && (
        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-md text-sm font-mono z-10">
          Joint: {highlightedJoint}
        </div>
      )}
    </div>
  );
};

export default URDFViewer;
