"use client";

import { useEffect, type JSX, type ReactNode } from "react";
import {
  ensureGsap,
  prefersReducedMotion,
  ScrollTrigger,
} from "@/components/motion/gsap-setup";

/** Registers GSAP/ScrollTrigger and keeps triggers fresh. Native scroll (no Lenis). */
export function MotionProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  useEffect(() => {
    ensureGsap();

    if (prefersReducedMotion()) {
      ScrollTrigger.config({ ignoreMobileResize: true });
    }

    const onResize = (): void => {
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <>{children}</>;
}
