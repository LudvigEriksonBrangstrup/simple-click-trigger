
import * as React from "react";
import { GooeyText } from "@/components/ui/gooey-text-morphing";

function GooeyTextDemo() {
  return (
    <div className="h-[200px] flex items-center justify-center">
      <GooeyText
        texts={["PROMPT", "SPATIAL", "AGENTS", "EASILY", "WITH QUALA"]}
        morphTime={1}
        cooldownTime={0.25}
        className="text-7xl md:text-[13rem] font-bold tracking-tighter whitespace-nowrap leading-none font-sans"
      />
    </div>
  );
}

export { GooeyTextDemo };
