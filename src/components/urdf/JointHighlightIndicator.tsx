
import React from "react";

interface JointHighlightIndicatorProps {
  jointName: string | null;
}

const JointHighlightIndicator: React.FC<JointHighlightIndicatorProps> = ({ 
  jointName 
}) => {
  if (!jointName) return null;
  
  return (
    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-2 rounded-md text-sm font-mono z-10">
      Joint: {jointName}
    </div>
  );
};

export default JointHighlightIndicator;
