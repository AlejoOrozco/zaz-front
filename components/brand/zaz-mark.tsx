import type { JSX } from "react";
import { cn } from "@/lib/utils";

interface ZazMarkProps {
  className?: string;
  /** Accessible name. Omit when the mark sits inside a labeled lockup. */
  title?: string;
}

/** Geometric zaz mark. Color via `currentColor` / text-* utilities. */
export function ZazMark({ className, title }: ZazMarkProps): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 363 463"
      fill="none"
      className={cn("shrink-0", className)}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
    >
      {title ? <title>{title}</title> : null}
      <g fill="currentColor">
        <path d="M249 0 H363 V30.5 L0 212 V124.5 L249 0 Z" />
        <path d="M363 102.5 V191.5 L0 373 V284 L363 102.5 Z" />
        <path d="M363 264.5 V354 L145 463 H0 V446 L363 264.5 Z" />
      </g>
    </svg>
  );
}
