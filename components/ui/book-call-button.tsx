"use client";

import type { JSX, ReactNode } from "react";
import { StarButton } from "@/components/ui/star-button";
import { useSite } from "@/components/shell/site-provider";
import { cn } from "@/lib/utils";

interface BookCallButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
}

/**
 * Theme-aware schedule/book CTA.
 * Light page → dark starry face + white border light (matches design).
 * Dark page → light face + dark border light.
 */
export function BookCallButton({
  children,
  href = "#book",
  className,
}: BookCallButtonProps): JSX.Element {
  const { theme } = useSite();
  const darkFace = theme !== "dark";

  return (
    <StarButton
      href={href}
      darkFace={darkFace}
      lightColor={darkFace ? "#FAFAFA" : "#0A0A0A"}
      className={cn("h-11 px-6", className)}
    >
      {children}
    </StarButton>
  );
}
