import { z } from "zod";
import {
  emailFieldSchema,
  messageFieldSchema,
  nameFieldSchema,
  phoneFieldSchema,
} from "@/lib/validation/fields";
import { privacyConsentSchema } from "@/lib/validation/privacy-consent";
import { recaptchaTokenSchema } from "@/lib/validation/recaptcha";

export const createContactSchema = z.object({
  name: nameFieldSchema,
  email: emailFieldSchema,
  phone: phoneFieldSchema,
  message: messageFieldSchema,
});

export const createContactRequestSchema = createContactSchema.extend({
  recaptchaToken: recaptchaTokenSchema,
  privacyConsent: privacyConsentSchema,
});
