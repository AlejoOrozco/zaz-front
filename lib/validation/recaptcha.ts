import { z } from "zod";

export const recaptchaTokenSchema = z
  .string({
    error: (issue) =>
      issue.input === undefined
        ? "reCAPTCHA token is required."
        : "reCAPTCHA token is invalid.",
  })
  .trim()
  .min(1, "reCAPTCHA token is required.")
  .max(4000, "reCAPTCHA token is invalid.");
