"use client";

import {
  useLayoutEffect,
  useRef,
  type JSX,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/**
 * Crossfades primary ↔ secondary.
 * Whichever is active stays in normal document flow so section height
 * collapses to the visible content (no leftover empty space).
 * When height shrinks on success, scroll is adjusted so the page does
 * not jump into the next section.
 */
export function FadeSwap({
  showSecondary,
  primary,
  secondary,
  className,
}: {
  showSecondary: boolean;
  primary: ReactNode;
  secondary: ReactNode;
  className?: string;
}): JSX.Element {
  const rootRef = useRef<HTMLDivElement>(null);
  const heightBeforeCollapseRef = useRef(0);
  const showSecondaryRef = useRef(showSecondary);

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    const switchedToSecondary =
      showSecondary && !showSecondaryRef.current;
    const height = node.offsetHeight;

    if (switchedToSecondary) {
      const delta = heightBeforeCollapseRef.current - height;
      if (delta > 0) {
        window.scrollBy({ top: -delta, left: 0, behavior: "instant" });
      }
    } else if (!showSecondary) {
      heightBeforeCollapseRef.current = height;
    }

    showSecondaryRef.current = showSecondary;
  }, [showSecondary]);

  useLayoutEffect(() => {
    const node = rootRef.current;
    if (!node) return;

    heightBeforeCollapseRef.current = node.offsetHeight;

    const observer = new ResizeObserver(() => {
      if (showSecondaryRef.current) return;
      heightBeforeCollapseRef.current = node.offsetHeight;
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <div
        className={cn(
          "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
          showSecondary
            ? "pointer-events-none absolute inset-x-0 top-0 translate-y-1 opacity-0"
            : "relative translate-y-0 opacity-100",
        )}
        aria-hidden={showSecondary}
      >
        {primary}
      </div>

      <div
        className={cn(
          "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
          showSecondary
            ? "relative translate-y-0 opacity-100"
            : "pointer-events-none absolute inset-x-0 top-0 -translate-y-1 opacity-0",
        )}
        aria-hidden={!showSecondary}
      >
        {secondary}
      </div>
    </div>
  );
}
