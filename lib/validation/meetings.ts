import { z } from "zod";
import {
  emailFieldSchema,
  nameFieldSchema,
  phoneFieldSchema,
} from "@/lib/validation/fields";
import { privacyConsentSchema } from "@/lib/validation/privacy-consent";
import { recaptchaTokenSchema } from "@/lib/validation/recaptcha";

/** ISO-8601 datetime with offset, e.g. 2026-08-15T15:00:00-05:00 */
const startAtSchema = z
  .string()
  .trim()
  .min(1, "Meeting time is required.")
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Meeting time must be a valid ISO-8601 timestamp.",
  });

export const createMeetingSchema = z.object({
  name: nameFieldSchema,
  email: emailFieldSchema,
  phone: phoneFieldSchema,
  startAt: startAtSchema,
});

export const createMeetingRequestSchema = createMeetingSchema.extend({
  recaptchaToken: recaptchaTokenSchema,
  privacyConsent: privacyConsentSchema,
});

/** Calendar date in America/Bogota, YYYY-MM-DD */
export const availabilityQuerySchema = z.object({
  date: z
    .string()
    .trim()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format.")
    .refine((value) => {
      const [year, month, day] = value.split("-").map(Number);
      const utc = new Date(Date.UTC(year, month - 1, day));
      return (
        utc.getUTCFullYear() === year &&
        utc.getUTCMonth() === month - 1 &&
        utc.getUTCDate() === day
      );
    }, "Date is not a valid calendar day."),
});
