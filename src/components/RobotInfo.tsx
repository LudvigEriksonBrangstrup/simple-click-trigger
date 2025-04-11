import React, { useState } from "react";
import RobotParameters from "./RobotParameters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useUrdf } from "@/hooks/useUrdf";

interface RobotInfoProps {
  onAnimationApplied?: (hasAnimation: boolean) => void;
}

const RobotInfo: React.FC<RobotInfoProps> = ({ onAnimationApplied }) => {
  // Get all needed data from the UrdfContext
  const { currentRobotData, isDefaultModel, customModelName } = useUrdf();

  const [animationDialogOpen, setAnimationDialogOpen] = useState(false);
  const [animationPrompt, setAnimationPrompt] = useState("");
  const [isGeneratingAnimation, setIsGeneratingAnimation] = useState(false);

  const handleAnimationRequest = () => {
    if (!animationPrompt.trim()) {
      toast.error("Please enter an animation description");
      return;
    }

    setIsGeneratingAnimation(true);

    // Simulate API call with a timeout
    setTimeout(() => {
      setIsGeneratingAnimation(false);
      setAnimationDialogOpen(false);

      // Reset the prompt for next time
      setAnimationPrompt("");

      // Notify parent component that animation has been applied
      if (onAnimationApplied) {
        onAnimationApplied(true);
      }

      // Show success message
      toast.success("Animation applied successfully", {
        description: `Applied: "${animationPrompt}"`,
        duration: 3000,
      });
    }, 2000);
  };

  // Get the robot name directly from context
  const robotName = isDefaultModel
    ? currentRobotData?.name || "T12"
    : customModelName;

  return (
    <div className="p-2">
      <div className="sidebar-divider mt-4" />

      {/* No need to pass robotName to RobotParameters as it gets data from context */}
      <RobotParameters />

      <div className="sidebar-divider" />

      <div className="sidebar-section">
        <div
          className="bg-sidebar-accent rounded-lg p-3 flex items-center justify-center hover:bg-sidebar-accent/80 cursor-pointer transition-colors"
          onClick={() => setAnimationDialogOpen(true)}
        >
          <span className="text-sidebar-accent-foreground font-medium font-mono text-sm">
            Run an animation
          </span>
        </div>
        <div className="text-xs text-muted-foreground mt-2 text-center font-mono">
          Type animation instructions here
        </div>
      </div>

      {/* Animation Dialog */}
      <Dialog open={animationDialogOpen} onOpenChange={setAnimationDialogOpen}>
        <DialogContent className="sm:max-w-[425px] font-mono">
          <DialogHeader>
            <DialogTitle className="text-center">
              Animation Request for {robotName}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="Describe the animation you want to see (e.g., 'Make the robot wave its arm' or 'Make one of the wheels spin in circles')"
              className="min-h-[100px] font-mono"
              value={animationPrompt}
              onChange={(e) => setAnimationPrompt(e.target.value)}
              disabled={isGeneratingAnimation}
            />
          </div>

          <DialogFooter>
            <Button
              onClick={() => setAnimationDialogOpen(false)}
              variant="outline"
              disabled={isGeneratingAnimation}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAnimationRequest}
              disabled={isGeneratingAnimation}
              className="ml-2"
            >
              {isGeneratingAnimation ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Apply Animation"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RobotInfo;
