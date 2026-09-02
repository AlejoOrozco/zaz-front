"use client";

import { useCallback } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import type { RecaptchaAction } from "@/lib/recaptcha/config";

export function useRecaptchaToken(): {
  getRecaptchaToken: (action: RecaptchaAction) => Promise<string | null>;
} {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getRecaptchaToken = useCallback(
    async (action: RecaptchaAction): Promise<string | null> => {
      if (!executeRecaptcha) return null;
      try {
        const token = await executeRecaptcha(action);
        if (!token) return null;
        return token;
      } catch {
        return null;
      }
    },
    [executeRecaptcha],
  );

  return { getRecaptchaToken };
}
