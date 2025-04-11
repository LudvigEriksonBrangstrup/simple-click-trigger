import React from "react";
import { Weight, Activity, Layers, Cog } from "lucide-react";
import ParameterItem from "./ui/parameter-item";
import { useUrdf } from "@/hooks/useUrdf";

const RobotParameters: React.FC = () => {
  // Get robot data from the UrdfContext
  const { currentRobotData, isDefaultModel, customModelName } = useUrdf();

  // If no data is available, show an error message
  if (!currentRobotData) {
    return (
      <div className="sidebar-section">
        <h3 className="text-base font-semibold mb-3 font-mono">Parameters</h3>
        <div className="p-4 text-red-500 border border-red-300 rounded-lg">
          No robot parameters available
        </div>
      </div>
    );
  }

  // Use data from the context
  const data = currentRobotData;

  // Get robot name from context
  const robotName = isDefaultModel
    ? currentRobotData.name || "T12"
    : customModelName;

  // Format the mass with units
  const formatMass = (mass?: number) => {
    return mass ? `${mass.toFixed(1)}kg` : "Unknown";
  };

  // Create sub-items for links with masses
  const massSubItems =
    data?.links
      ?.filter((link) => link.name && link.mass !== undefined && link.mass > 0)
      .map((link) => ({
        label: link.name || "Unnamed Link",
        value: `${link.mass?.toFixed(1)}kg`,
      })) || [];

  // Create sub-items for joint types
  const jointSubItems = [];
  if (data?.joints?.revolute) {
    jointSubItems.push({ label: "Revolute", value: data.joints.revolute });
  }
  if (data?.joints?.prismatic) {
    jointSubItems.push({ label: "Prismatic", value: data.joints.prismatic });
  }
  if (data?.joints?.other) {
    jointSubItems.push({ label: "Other", value: data.joints.other });
  }
  if (data?.joints?.continuous) {
    jointSubItems.push({ label: "Continuous", value: data.joints.continuous });
  }
  if (data?.joints?.fixed) {
    jointSubItems.push({ label: "Fixed", value: data.joints.fixed });
  }

  // Create sub-items for materials
  const materialSubItems =
    data.materials
      ?.filter((material) => material.name && material.percentage)
      .map((material) => ({
        label: material.name || "Unknown Material",
        value: `${material.percentage}%`,
      })) || [];

  return (
    <div className="sidebar-section">
      <h3 className="text-base font-semibold mb-3 font-mono">
        Parameters for {robotName}
      </h3>

      <div className="space-y-2">
        <ParameterItem
          label="Mass"
          value={formatMass(data.mass)}
          icon={<Weight size={18} />}
          color="bg-sidebar/50 dark:bg-sidebar-accent/30"
          subItems={massSubItems.length > 0 ? massSubItems : undefined}
        />

        <ParameterItem
          label="DoFs"
          value={data.dofs !== undefined ? data.dofs : "Unknown"}
          icon={<Activity size={18} />}
          color="bg-sidebar/50 dark:bg-sidebar-accent/30"
        />

        <ParameterItem
          label="Materials"
          value={
            materialSubItems.length > 0
              ? `${materialSubItems.length} materials`
              : "Unknown"
          }
          icon={<Layers size={18} />}
          color="bg-sidebar/50 dark:bg-sidebar-accent/30"
          subItems={materialSubItems.length > 0 ? materialSubItems : undefined}
        />

        <ParameterItem
          label="Joints"
          value={
            jointSubItems.length > 0
              ? jointSubItems.length + " types"
              : "Unknown"
          }
          icon={<Cog size={18} />}
          color="bg-sidebar/50 dark:bg-sidebar-accent/30"
          subItems={jointSubItems.length > 0 ? jointSubItems : undefined}
        />
      </div>
    </div>
  );
};

export default RobotParameters;
