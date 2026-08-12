"use client";

import { useEffect, useState, type CSSProperties, type JSX } from "react";
import { Dithering } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";
import { prefersReducedMotion } from "@/components/motion/gsap-setup";
import { useSite } from "@/components/shell/site-provider";

interface ContactSphereProps {
  className?: string;
  label?: string;
}

/**
 * Sphere for the inverted contact section.
 * Dark page → light section, black sphere, white label.
 * Light page → dark section, white sphere, black label.
 */
export function ContactSphere({
  className,
  label = "contact",
}: ContactSphereProps): JSX.Element {
  const { theme } = useSite();
  const [speed, setSpeed] = useState(1.5);

  // Opposite of page theme (matches bg-invert-bg / sphere contrast).
  const colorBack = theme === "dark" ? "#f5f5f6" : "#0a0a0a";
  const colorFront = theme === "dark" ? "#0a0a0a" : "#fafafa";
  const labelColor = theme === "dark" ? "#ffffff" : "#0a0a0a";

  useEffect(() => {
    if (prefersReducedMotion()) {
      setSpeed(0);
    }
  }, []);

  return (
    <div
      className={cn(
        "relative flex aspect-square w-[min(100%,18rem,42svh)] items-center justify-center overflow-hidden lg:w-[min(100%,22rem,48svh)]",
        className,
      )}
      aria-hidden="true"
    >
      <Dithering
        key={`${colorBack}-${colorFront}`}
        shape="sphere"
        type="random"
        colorBack={colorBack}
        colorFront={colorFront}
        size={2}
        speed={speed}
        scale={1}
        style={
          {
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          } as CSSProperties
        }
      />
      <span
        className="pointer-events-none relative z-10 font-sans text-[clamp(1.75rem,5vw,2.75rem)] font-semibold tracking-tight"
        style={{ color: labelColor }}
      >
        {label}
      </span>
    </div>
  );
}
