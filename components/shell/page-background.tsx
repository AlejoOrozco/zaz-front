"use client";

import type { JSX } from "react";
import { StarsBackground } from "@/components/ui/stars-background";
import { useSite } from "@/components/shell/site-provider";

export function PageBackground(): JSX.Element {
  const { theme } = useSite();

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-paper"
      aria-hidden="true"
    >
      {theme === "dark" ? <StarsBackground /> : null}
    </div>
  );
}
