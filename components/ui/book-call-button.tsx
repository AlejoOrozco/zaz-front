"use client";

import type { JSX, ReactNode } from "react";
import { StarButton } from "@/components/ui/star-button";
import { useSite } from "@/components/shell/site-provider";
import { cn } from "@/lib/utils";

interface BookCallButtonProps {
  children: ReactNode;
  href?: string;
  className?: string;
  external?: boolean;
  surface?: "default" | "invert";
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
  external = false,
  surface = "default",
}: BookCallButtonProps): JSX.Element {
  const { theme } = useSite();
  const pageIsDark = theme === "dark";
  const darkFace = surface === "invert" ? pageIsDark : !pageIsDark;

  return (
    <StarButton
      href={href}
      darkFace={darkFace}
      lightColor={darkFace ? "#FAFAFA" : "#0A0A0A"}
      className={cn("h-11 px-6", className)}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
    >
      {children}
    </StarButton>
  );
}
