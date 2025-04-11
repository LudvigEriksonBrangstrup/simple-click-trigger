
import React, { useState } from "react";
import { toast } from "sonner";
import PrimaryButton from "./PrimaryButton";

const ClickCounter = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
    
    if (count + 1 === 1) {
      toast.success("First click registered!");
    } else if ((count + 1) % 10 === 0) {
      toast.success(`${count + 1} clicks reached!`);
    } else {
      toast(`Click count: ${count + 1}`);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <PrimaryButton onClick={handleClick}>
        Click Me
      </PrimaryButton>
      
      {count > 0 && (
        <div className="animate-fade-in text-lg font-medium">
          Button clicked {count} time{count !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};

export default ClickCounter;
