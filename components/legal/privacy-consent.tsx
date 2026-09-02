"use client";

import Link from "next/link";
import type { JSX } from "react";
import { useSite } from "@/components/shell/site-provider";
import { cn } from "@/lib/utils";

const copy = {
  en: {
    before: "I agree to the processing of my personal data as described in the ",
    policy: "Personal data policy",
    after: ".",
  },
  es: {
    before: "Acepto el tratamiento de mis datos personales de acuerdo con la ",
    policy: "Política de tratamiento de datos personales",
    after: ".",
  },
} as const;

const tones = {
  default: {
    text: "text-ink-2",
    link: "text-ink underline decoration-ink/30 underline-offset-2 transition-colors duration-150 ease-out hover:decoration-ink",
    box: "border-line",
    boxChecked: "border-ink bg-ink",
    boxError: "border-red-500",
    check: "text-paper",
    error: "text-red-500",
  },
  invert: {
    text: "text-invert-fg/65",
    link: "text-invert-fg underline decoration-invert-fg/35 underline-offset-2 transition-colors duration-150 ease-out hover:decoration-invert-fg",
    box: "border-invert-fg/20",
    boxChecked: "border-invert-fg bg-invert-fg",
    boxError: "border-paper",
    check: "text-invert-bg",
    error: "text-paper",
  },
} as const;

export type PrivacyConsentTone = keyof typeof tones;

export function PrivacyConsent({
  checked,
  onCheckedChange,
  error,
  errorId,
  inputId,
  tone = "default",
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  error?: string;
  errorId: string;
  inputId: string;
  tone?: PrivacyConsentTone;
}): JSX.Element {
  const { locale } = useSite();
  const t = copy[locale];
  const colors = tones[tone];
  const invalid = Boolean(error);

  return (
    <div>
      <label
        htmlFor={inputId}
        className={cn(
          "flex cursor-pointer items-start gap-2.5 text-sm leading-snug",
          colors.text,
        )}
      >
        <span className="relative mt-0.5 h-4 w-4 shrink-0">
          <input
            id={inputId}
            name="privacyConsent"
            type="checkbox"
            checked={checked}
            aria-invalid={invalid}
            aria-required="true"
            aria-describedby={invalid ? errorId : undefined}
            onChange={(event) => onCheckedChange(event.target.checked)}
            className={cn(
              "h-4 w-4 appearance-none rounded-[4px] border bg-transparent transition-[border-color,background-color,transform] duration-150 ease-out active:scale-[0.97]",
              colors.box,
              checked && colors.boxChecked,
              invalid && !checked && colors.boxError,
            )}
          />
          {checked ? (
            <svg
              viewBox="0 0 16 16"
              className={cn(
                "pointer-events-none absolute inset-0 h-4 w-4 p-0.5",
                colors.check,
              )}
              aria-hidden="true"
            >
              <path
                d="M3.5 8.2 6.6 11.2 12.5 4.8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : null}
        </span>
        <span>
          {t.before}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className={colors.link}
            onClick={(event) => event.stopPropagation()}
          >
            {t.policy}
          </Link>
          {t.after}
        </span>
      </label>
      {error ? (
        <p id={errorId} className={cn("mt-1.5 text-sm", colors.error)} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
