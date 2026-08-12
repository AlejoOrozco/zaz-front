"use client";

import type { JSX } from "react";
import { GradualBlur } from "@/components/motion/gradual-blur";

/**
 * Fixed edge blur while scrolling the page.
 * Keeps z-index below the header controls but above page content.
 */
export function PageScrollBlur(): JSX.Element {
  return (
    <>
      <GradualBlur
        target="page"
        position="top"
        height="5rem"
        strength={2}
        divCount={5}
        curve="bezier"
        opacity={1}
        zIndex={30}
      />
      <GradualBlur
        target="page"
        position="bottom"
        height="6rem"
        strength={2.5}
        divCount={6}
        curve="bezier"
        exponential
        opacity={1}
        zIndex={30}
      />
    </>
  );
}
