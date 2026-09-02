"use client";

import type { JSX, ReactNode } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export function RecaptchaProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey) {
    return <>{children}</>;
  }

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={siteKey}
      scriptProps={{ appendTo: "head" }}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
