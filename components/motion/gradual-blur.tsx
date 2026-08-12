"use client";

import { memo, type CSSProperties, type JSX } from "react";
import { cn } from "@/lib/utils";

type GradualBlurPosition = "top" | "bottom";
type GradualBlurCurve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";

interface GradualBlurProps {
  position?: GradualBlurPosition;
  strength?: number;
  height?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  opacity?: number;
  curve?: GradualBlurCurve;
  target?: "parent" | "page";
  className?: string;
}

const CURVE_FUNCTIONS: Record<GradualBlurCurve, (progress: number) => number> =
  {
    linear: (p) => p,
    bezier: (p) => p * p * (3 - 2 * p),
    "ease-in": (p) => p * p,
    "ease-out": (p) => 1 - (1 - p) ** 2,
    "ease-in-out": (p) =>
      p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2,
  };

function GradualBlurComponent({
  position = "bottom",
  strength = 2,
  height = "6rem",
  divCount = 5,
  exponential = false,
  zIndex = 40,
  opacity = 1,
  curve = "linear",
  target = "parent",
  className,
}: GradualBlurProps): JSX.Element {
  const isPageTarget = target === "page";
  const curveFunc = CURVE_FUNCTIONS[curve];
  const increment = 100 / divCount;
  const direction = position === "top" ? "to top" : "to bottom";

  const layers: JSX.Element[] = [];
  for (let i = 1; i <= divCount; i += 1) {
    const progress = curveFunc(i / divCount);
    const blurValue = exponential
      ? 2 ** (progress * 4) * 0.0625 * strength
      : 0.0625 * (progress * divCount + 1) * strength;

    const p1 = Math.round((increment * i - increment) * 10) / 10;
    const p2 = Math.round(increment * i * 10) / 10;
    const p3 = Math.round((increment * i + increment) * 10) / 10;
    const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

    let gradient = `transparent ${p1}%, black ${p2}%`;
    if (p3 <= 100) gradient += `, black ${p3}%`;
    if (p4 <= 100) gradient += `, transparent ${p4}%`;

    const layerStyle: CSSProperties = {
      position: "absolute",
      inset: 0,
      maskImage: `linear-gradient(${direction}, ${gradient})`,
      WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
      backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
      WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
      opacity,
    };

    layers.push(<div key={i} style={layerStyle} />);
  }

  const containerStyle: CSSProperties = {
    position: isPageTarget ? "fixed" : "absolute",
    pointerEvents: "none",
    zIndex: isPageTarget ? zIndex + 10 : zIndex,
    isolation: "isolate",
    height,
    width: "100%",
    left: 0,
    right: 0,
    [position]: 0,
  };

  return (
    <div
      className={cn("pointer-events-none", className)}
      style={containerStyle}
      aria-hidden="true"
    >
      <div className="relative h-full w-full">{layers}</div>
    </div>
  );
}

export const GradualBlur = memo(GradualBlurComponent);
GradualBlur.displayName = "GradualBlur";
