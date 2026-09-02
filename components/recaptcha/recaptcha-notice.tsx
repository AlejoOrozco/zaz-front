"use client";

import type { JSX } from "react";
import { useSite } from "@/components/shell/site-provider";
import { cn } from "@/lib/utils";

const GOOGLE_PRIVACY_URL = "https://policies.google.com/privacy";
const GOOGLE_TERMS_URL = "https://policies.google.com/terms";

const copy = {
  en: {
    before: "This site is protected by reCAPTCHA and the Google ",
    privacy: "Privacy Policy",
    mid: " and ",
    terms: "Terms of Service",
    after: " apply.",
  },
  es: {
    before: "Este sitio está protegido por reCAPTCHA. Se aplican la ",
    privacy: "Política de Privacidad",
    mid: " y los ",
    terms: "Términos del Servicio",
    after: " de Google.",
  },
} as const;

export function RecaptchaNotice({
  className,
}: {
  className?: string;
}): JSX.Element {
  const { locale } = useSite();
  const t = copy[locale];

  return (
    <p className={cn("text-[0.7rem] leading-relaxed", className)}>
      {t.before}
      <a
        href={GOOGLE_PRIVACY_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        {t.privacy}
      </a>
      {t.mid}
      <a
        href={GOOGLE_TERMS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2"
      >
        {t.terms}
      </a>
      {t.after}
    </p>
  );
}
