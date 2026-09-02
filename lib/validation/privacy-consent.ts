import { z } from "zod";

export const PRIVACY_CONSENT_REQUIRED =
  "You must accept the personal data policy.";

export const privacyConsentSchema = z.literal(true, {
  error: PRIVACY_CONSENT_REQUIRED,
});
