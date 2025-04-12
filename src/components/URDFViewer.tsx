
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/hooks/useTheme";
import { useUrdf } from "@/hooks/useUrdf";
import { useUrdfAnimation } from "@/hooks/useUrdfAnimation";
import URDFManipulator from "urdf-loader/src/urdf-manipulator-element.js";
import {
  createUrdfViewer,
  setupMeshLoader,
  setupJointHighlighting,
  setupModelLoading,
} from "@/lib/urdfViewerHelpers";
import ViewerControls from "./urdf/ViewerControls";
import JointHighlightIndicator from "./urdf/JointHighlightIndicator";

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

const URDFViewer: React.FC<URDFViewerProps> = ({ hasAnimation = false }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const containerRef = useRef<HTMLDivElement>(null);
  const [highlightedJoint, setHighlightedJoint] = useState<string | null>(null);
  const { registerUrdfProcessor, alternativeUrdfModels, isDefaultModel } = useUrdf();
  const viewerRef = useRef<URDFViewerElement | null>(null);

  // Add state for custom URDF path
  const [customUrdfPath, setCustomUrdfPath] = useState<string | null>(null);
  const [urlModifierFunc, setUrlModifierFunc] = useState<
    ((url: string) => string) | null
  >(null);

  const packageRef = useRef<string>("");

  // Use our new animation hook
  const {
    isAnimating,
    showAnimationControl,
    toggleAnimation,
    setupAnimation,
    onModelProcessed,
    cleanup: cleanupAnimation
  } = useUrdfAnimation({
    isDefaultModel,
    hasAnimation,
  });

  // Implement UrdfProcessor interface for drag and drop
  const urdfProcessor = React.useMemo(
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

    // Handle the model processed event
    const handleModelProcessed = () => {
      onModelProcessed(viewer as import("@/lib/urdfAnimationHelpers").URDFViewerElement);
    };

    viewer.addEventListener("urdf-processed", handleModelProcessed);

    // Return cleanup function
    return () => {
      cleanupAnimation();
      cleanupJointHighlighting();
      cleanupModelLoading();
      viewer.removeEventListener("urdf-processed", handleModelProcessed);
    };
  }, [isDefaultModel, customUrdfPath, urlModifierFunc, hasAnimation, onModelProcessed, cleanupAnimation, alternativeUrdfModels]);

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
    setupAnimation(viewerRef.current as import("@/lib/urdfAnimationHelpers").URDFViewerElement);
  }, [isAnimating, setupAnimation]);

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

      {/* Control buttons container */}
      <ViewerControls
        isDarkMode={isDarkMode}
        isAnimating={isAnimating}
        showAnimationControl={showAnimationControl}
        onToggleAnimation={toggleAnimation}
      />

      {/* Joint highlight indicator */}
      <JointHighlightIndicator jointName={highlightedJoint} />
    </div>
  );
};

export default URDFViewer;
