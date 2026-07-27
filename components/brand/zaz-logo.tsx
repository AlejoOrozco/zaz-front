import type { JSX } from "react";
import { ZazMark } from "@/components/brand/zaz-mark";
import { cn } from "@/lib/utils";

interface ZazLogoProps {
  className?: string;
  markClassName?: string;
  href?: string;
}

/**
 * Better Stack–style lockup: mark + wordmark.
 * Inherits text color for both mark and “zaz”.
 */
export function ZazLogo({
  className,
  markClassName,
  href = "#top",
}: ZazLogoProps): JSX.Element {
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center gap-2 text-ink transition-opacity hover:opacity-80",
        className,
      )}
      aria-label="zaz home"
    >
      <ZazMark className={cn("h-5 w-auto", markClassName)} />
      <span className="font-sans text-lg font-semibold tracking-tight">
        zaz
      </span>
    </a>
  );
}
