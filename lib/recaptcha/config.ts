export const RECAPTCHA_ACTIONS = {
  contact: "contact",
  meeting: "book_meeting",
} as const;

export type RecaptchaAction =
  (typeof RECAPTCHA_ACTIONS)[keyof typeof RECAPTCHA_ACTIONS];

/** Google's recommended default. Raise toward 0.7 if spam still gets through. */
export const RECAPTCHA_MIN_SCORE = 0.5;

export const RECAPTCHA_VERIFY_TIMEOUT_MS = 8_000;

export const RECAPTCHA_SITEVERIFY_URL =
  "https://www.google.com/recaptcha/api/siteverify";
