
"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
}

export const GooeyText = ({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
}: GooeyTextProps) => {
  const textRef1 = useRef<HTMLSpanElement>(null);
  const textRef2 = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef1.current || !textRef2.current) return;

    let textIndex = texts.length - 1;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    textRef1.current.textContent = texts[textIndex % texts.length];
    textRef2.current.textContent = texts[(textIndex + 1) % texts.length];

    function doMorph() {
      morph -= cooldown;
      cooldown = 0;

      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    }

    function setMorph(fraction: number) {
      if (!textRef1.current || !textRef2.current) return;

      // fraction = Math.cos(fraction * Math.PI) / 2 + 0.5;
      fraction = fraction * fraction * (3 - 2 * fraction);

      textRef2.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      textRef2.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      textRef1.current.style.filter = `blur(${Math.min(8 / (1 - fraction) - 8, 100)}px)`;
      textRef1.current.style.opacity = `${Math.pow(1 - fraction, 0.4) * 100}%`;

      textRef1.current.textContent = texts[textIndex % texts.length];
      textRef2.current.textContent = texts[(textIndex + 1) % texts.length];
    }

    function doCooldown() {
      morph = 0;

      textRef2.current!.style.filter = "";
      textRef2.current!.style.opacity = "100%";

      textRef1.current!.style.filter = "";
      textRef1.current!.style.opacity = "0%";
    }

    function animate() {
      requestAnimationFrame(animate);

      let newTime = new Date();
      let shouldIncrementIndex = cooldown > 0;
      let dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex++;
        }

        doMorph();
      } else {
        doCooldown();
      }
    }

    animate();
  }, [texts, morphTime, cooldownTime]);

  return (
    <div className={cn("relative inline-block min-h-[2em]", className)}>
      <span
        ref={textRef1}
        className="absolute left-0 top-0 whitespace-nowrap text-gradient-white"
      />
      <span
        ref={textRef2}
        className="absolute left-0 top-0 whitespace-nowrap text-gradient-white"
      />
    </div>
  );
};
