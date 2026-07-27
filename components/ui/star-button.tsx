"use client";

import {
  useId,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

/** Sparse starfield dots on the button face. */
function StarField({ color }: { color: string }): JSX.Element {
  const clipId = useId().replace(/:/g, "");

  return (
    <svg
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      viewBox="0 0 100 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[3]"
    >
      <g clipPath={`url(#${clipId})`} fill={color} opacity={0.85}>
        <circle cx="7.5" cy="12.5" r="0.66" />
        <circle cx="7.5" cy="24.34" r="0.66" />
        <circle cx="7.5" cy="32.86" r="0.66" />
        <circle cx="16" cy="5.52" r="0.66" />
        <circle cx="18.66" cy="18.48" r="0.66" />
        <circle cx="21.66" cy="34.18" r="0.66" />
        <circle cx="31.68" cy="26.68" r="0.66" />
        <circle cx="32.34" cy="9.34" r="0.66" />
        <circle cx="34.5" cy="35.5" r="0.66" />
        <circle cx="40.26" cy="17.82" r="0.66" />
        <circle cx="45.54" cy="7.26" r="0.66" />
        <circle cx="47.84" cy="28.66" r="0.66" />
        <circle cx="53.5" cy="36.84" r="0.66" />
        <circle cx="55.624" cy="16.5" r="0.66" />
        <circle cx="56.1" cy="4.62" r="0.66" />
        <circle cx="60.34" cy="28" r="0.66" />
        <circle cx="69" cy="21.16" r="0.66" />
        <circle cx="74.58" cy="5.94" r="0.66" />
        <circle cx="77.5" cy="34.84" r="0.66" />
        <circle cx="79.86" cy="15.18" r="0.66" />
        <circle cx="85.66" cy="25" r="0.66" />
        <circle cx="90.66" cy="10" r="0.66" />
        <circle cx="91.98" cy="34.84" r="0.66" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <rect width="100" height="40" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

type StarButtonBaseProps = {
  children: ReactNode;
  duration?: number;
  lightColor?: string;
  /** Thickness of the inner light ring (px). */
  borderWidth?: number;
  className?: string;
  darkFace?: boolean;
};

type StarButtonAsButton = StarButtonBaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type StarButtonAsLink = StarButtonBaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

export type StarButtonProps = StarButtonAsButton | StarButtonAsLink;

export function StarButton({
  children,
  duration = 3,
  lightColor = "#FAFAFA",
  borderWidth = 2,
  className,
  darkFace = true,
  ...props
}: StarButtonProps): JSX.Element {
  const faceBg = darkFace ? "#0a0a0a" : "#fafafa";
  const starColor = darkFace ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.55)";
  const rimColor = darkFace
    ? "rgba(255,255,255,0.14)"
    : "rgba(0,0,0,0.1)";

  const style = {
    "--duration": duration,
    "--light-color": lightColor,
    "--border-width": `${borderWidth}px`,
    backgroundColor: faceBg,
  } as CSSProperties;

  const classes = cn(
    "group/star-button relative inline-flex h-10 items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-opacity hover:opacity-95 disabled:pointer-events-none disabled:opacity-50",
    className,
  );

  const content = (
    <>
      {/* Soft rotating highlight   full layer, then covered in the center */}
      <span
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        aria-hidden="true"
      >
        <span
          className="star-btn-glow absolute left-1/2 top-1/2 h-[220%] w-[220%] min-w-[12rem]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0 75%, color-mix(in srgb, var(--light-color) 55%, transparent) 88%, var(--light-color) 94%, color-mix(in srgb, var(--light-color) 55%, transparent) 98%, transparent 100%)`,
          }}
        />
      </span>

      {/* Covers the pie-slice; leaves only an inner ring of the glow */}
      <span
        className="pointer-events-none absolute z-[1] rounded-[inherit]"
        style={{
          inset: "var(--border-width)",
          backgroundColor: faceBg,
        }}
        aria-hidden="true"
      />

      <span
        className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit]"
        style={{ boxShadow: `inset 0 0 0 1px ${rimColor}` }}
        aria-hidden="true"
      />

      <StarField color={starColor} />

      <span
        className={cn(
          "relative z-10 inline-block bg-gradient-to-t bg-clip-text text-transparent",
          darkFace
            ? "from-neutral-400 to-white"
            : "from-neutral-500 to-black",
        )}
      >
        {children}
      </span>
    </>
  );

  if ("href" in props && props.href) {
    const { href, ...anchorProps } = props;
    return (
      <a href={href} style={style} className={classes} {...anchorProps}>
        {content}
      </a>
    );
  }

  const buttonProps = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type="button" style={style} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}
