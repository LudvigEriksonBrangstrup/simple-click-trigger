
import { useState, useEffect, useRef } from "react";
import {
  animateHexapodRobot,
  animateRobot,
  cassieWalkingConfig,
} from "@/lib/urdfAnimationHelpers";
import { URDFViewerElement } from "@/lib/urdfAnimationHelpers";

interface UseUrdfAnimationProps {
  isDefaultModel: boolean;
  hasAnimation: boolean;
}

export function useUrdfAnimation({
  isDefaultModel,
  hasAnimation,
}: UseUrdfAnimationProps) {
  // Animation state
  const [isAnimating, setIsAnimating] = useState<boolean>(isDefaultModel);
  const [showAnimationControl, setShowAnimationControl] = useState<boolean>(
    isDefaultModel || hasAnimation
  );
  const cleanupAnimationRef = useRef<(() => void) | null>(null);
  const hasInitializedRef = useRef<boolean>(false);

  // Effect to update animation control visibility
  useEffect(() => {
    setShowAnimationControl(isDefaultModel || hasAnimation);
  }, [isDefaultModel, hasAnimation]);

  // Toggle animation function
  const toggleAnimation = () => {
    setIsAnimating((prev) => !prev);
  };

  // Function to start animation
  const startAnimation = (viewer: URDFViewerElement) => {
    if (!viewer || !("setJointValue" in viewer)) return null;

    // Clear any existing animation
    if (cleanupAnimationRef.current) {
      cleanupAnimationRef.current();
      cleanupAnimationRef.current = null;
    }

    // Use the appropriate animation based on model type
    if (isDefaultModel) {
      return animateHexapodRobot(viewer);
    } else if (hasAnimation) {
      return animateRobot(viewer, cassieWalkingConfig);
    }
    
    return null;
  };

  // Function to stop animation
  const stopAnimation = () => {
    if (cleanupAnimationRef.current) {
      cleanupAnimationRef.current();
      cleanupAnimationRef.current = null;
    }
  };

  // Function to manage animation lifecycle
  const setupAnimation = (viewer: URDFViewerElement | null) => {
    if (!viewer || !hasInitializedRef.current) return;
    
    if (isAnimating) {
      if (!cleanupAnimationRef.current) {
        cleanupAnimationRef.current = startAnimation(viewer);
      }
    } else {
      stopAnimation();
    }
  };

  // Function to call when model is initially processed
  const onModelProcessed = (viewer: URDFViewerElement) => {
    hasInitializedRef.current = true;
    if (isAnimating) {
      cleanupAnimationRef.current = startAnimation(viewer);
    }
  };

  // Cleanup function
  const cleanup = () => {
    stopAnimation();
    hasInitializedRef.current = false;
  };

  return {
    isAnimating,
    showAnimationControl,
    toggleAnimation,
    setupAnimation,
    onModelProcessed,
    cleanup,
  };
}
