
import React from "react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
}

const PrimaryButton = ({ 
  className, 
  children, 
  variant = "default", 
  ...props 
}: PrimaryButtonProps) => {
  return (
    <button
      className={cn(
        "relative px-6 py-3 rounded-full font-medium text-lg transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
        variant === "default" 
          ? "bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-indigo-700 focus:ring-indigo-500"
          : "bg-transparent border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 focus:ring-indigo-400",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default PrimaryButton;
