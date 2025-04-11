import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className={`p-2.5 rounded-full shadow-md transition-all duration-300 ${
              theme === "dark"
                ? "bg-gray-700 hover:bg-gray-600 border-none"
                : "bg-white/80 hover:bg-white border-none"
            }`}
          >
            {theme === "light" ? (
              <Sun className="h-5 w-5 text-orange-500" />
            ) : (
              <Moon className="h-5 w-5 text-blue-400" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-mono text-xs">Toggle theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
