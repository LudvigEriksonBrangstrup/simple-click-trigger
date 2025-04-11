import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface ParameterItemProps {
  label: string;
  value: string | number | undefined;
  icon: React.ReactNode;
  color: string;
  subItems?: { label: string; value: string | number }[];
}

const ParameterItem: React.FC<ParameterItemProps> = ({
  label,
  value,
  icon,
  color,
  subItems,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubItems = subItems && subItems.length > 0;

  return (
    <div
      className={`parameter-card mb-3 rounded-lg border overflow-hidden shadow-sm transition-all duration-300 ${color}`}
    >
      <div
        className={`flex items-center px-4 py-3 ${
          hasSubItems ? "cursor-pointer" : ""
        }`}
        onClick={() => hasSubItems && setIsExpanded(!isExpanded)}
      >
        <div className="text-sidebar-primary mr-3">{icon}</div>
        <div className="flex-1">
          <div className="font-medium font-mono text-sm">{label}</div>
          {value && (
            <div className="text-base font-semibold font-mono">{value}</div>
          )}
        </div>
        {hasSubItems && (
          <div className="text-sidebar-primary/80">
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </div>
        )}
      </div>

      {isExpanded && hasSubItems && (
        <div className="backdrop-blur-sm border-t">
          {subItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 px-4 pl-10 border-b last:border-0"
            >
              <span className="text-xs text-muted-foreground font-mono">
                {item.label}
              </span>
              <span className="text-xs font-medium font-mono">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParameterItem;
