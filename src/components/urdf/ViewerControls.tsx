
import React from "react";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "../ModeToggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ViewerControlsProps {
  isDarkMode: boolean;
  isAnimating: boolean;
  showAnimationControl: boolean;
  onToggleAnimation: () => void;
}

const ViewerControls: React.FC<ViewerControlsProps> = ({
  isDarkMode,
  isAnimating,
  showAnimationControl,
  onToggleAnimation,
}) => {
  return (
    <div className="absolute top-4 right-4 flex items-center space-x-2 z-10">
      {/* ModeToggle button */}
      <ModeToggle />

      {/* Animation control button */}
      {showAnimationControl && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onToggleAnimation}
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
  );
};

export default ViewerControls;
