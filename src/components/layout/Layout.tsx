import React, { useState, useEffect } from "react";
import URDFViewer from "../URDFViewer";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import RobotInfo from "../RobotInfo";
import { LayoutDashboard, PanelLeft } from "lucide-react";
import { useUrdf } from "@/hooks/useUrdf";
import { Button } from "../ui/button";
import { useTheme } from "@/hooks/useTheme";

const Layout: React.FC = () => {
  const [open, setOpen] = useState(true);
  const [hasAnimation, setHasAnimation] = useState<boolean>(false);
  const { theme } = useTheme();

  // Use the centralized UrdfContext for all robot data
  const {
    currentRobotData,
    isDefaultModel,
    customModelName,
    customModelDescription,
    resetToDefaultModel,
    isSelectionModalOpen,
  } = useUrdf();

  // Log when robot data changes to verify the component is re-rendering
  useEffect(() => {
    console.log("Layout: Robot data updated", {
      isDefaultModel,
      hasData: !!currentRobotData,
      name: isDefaultModel ? currentRobotData?.name || "T12" : customModelName,
    });
  }, [isDefaultModel, currentRobotData, customModelName]);

  // Only set the initial state of the sidebar once
  useEffect(() => {
    setOpen(true);
  }, []);

  // Handler for when animation is applied
  const handleAnimationApplied = (animationApplied: boolean) => {
    setHasAnimation(animationApplied);
  };

  // If there's a selection modal open, render a simplified layout
  if (isSelectionModalOpen) {
    return (
      <div className="fixed inset-0 overflow-hidden">
        {/* Main content that fills the entire viewport */}
        <div className="absolute inset-0 w-full h-full">
          <URDFViewer hasAnimation={hasAnimation} />
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Main content that fills the entire viewport */}
      <div className="absolute inset-0 w-full h-full">
        <URDFViewer hasAnimation={hasAnimation} />
      </div>

      {/* Sidebar positioned above with z-index */}
      <div className="absolute inset-y-0 left-0 z-10">
        {open ? (
          <Sidebar open={open} setOpen={setOpen} animate={true}>
            <SidebarBody className="justify-between gap-10">
              <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                <div className="flex items-center justify-between mb-4 mt-2 px-2">
                  <h2 className="text-xl font-bold tracking-tight font-mono">
                    {isDefaultModel && currentRobotData
                      ? currentRobotData.name
                      : isDefaultModel
                      ? "T12 Robot"
                      : customModelName || "Custom Robot Model"}
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setOpen(false)}
                    className={`rounded-full ${
                      theme === "dark"
                        ? "bg-gray-700 hover:bg-gray-600"
                        : "bg-white/80 hover:bg-white"
                    }`}
                  >
                    <PanelLeft className="h-4 w-4" />
                    <span className="sr-only">Close sidebar</span>
                  </Button>
                </div>
                <div className="px-2">
                  <p className="text-muted-foreground font-mono text-xs">
                    {isDefaultModel && currentRobotData
                      ? currentRobotData.description
                      : isDefaultModel
                      ? "Loading description..."
                      : customModelDescription ||
                        "A detailed 3D model of a robotic system with articulated joints and components."}
                  </p>

                  <RobotInfo onAnimationApplied={handleAnimationApplied} />

                  {!isDefaultModel && (
                    <button
                      onClick={resetToDefaultModel}
                      className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80 transition-colors"
                    >
                      Reset to Default Model
                    </button>
                  )}
                </div>
              </div>
            </SidebarBody>
          </Sidebar>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center mt-4">
              <LayoutDashboard className="h-7 w-7" />
            </div>
            <div
              className={`flex items-center justify-center hover:bg-muted/80 cursor-pointer rounded-md p-2 m-2 ${
                theme === "dark" ? "bg-gray-700" : "bg-white/80"
              } shadow-sm`}
              onClick={() => setOpen(true)}
            >
              <div className="flex items-center space-x-1">
                <PanelLeft className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;
