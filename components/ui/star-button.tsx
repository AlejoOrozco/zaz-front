"use client";

import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type CSSProperties,
  type JSX,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

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

type StarButtonProps = StarButtonAsButton | StarButtonAsLink;

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
