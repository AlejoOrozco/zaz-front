import { z } from "zod";
import { FIELD_LIMITS } from "@/lib/booking/config";

/** Letters (any language), optional spaces / hyphen / apostrophe between parts. */
const NAME_PATTERN = /^[\p{L}]+(?:[\s'-][\p{L}]+)*$/u;

/** Digits only (country code without +; user types numbers). */
const PHONE_PATTERN = /^\d+$/;

/**
 * Practical email: local@domain.tld (requires a dot in the domain).
 * Stricter than a bare "@" check; used alongside Zod email().
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const nameFieldSchema = z
  .string()
  .trim()
  .min(1, "Name is required.")
  .max(FIELD_LIMITS.name, `Name must be at most ${FIELD_LIMITS.name} characters.`)
  .regex(NAME_PATTERN, "Name can only contain letters.");

export const emailFieldSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .max(
    FIELD_LIMITS.email,
    `Email must be at most ${FIELD_LIMITS.email} characters.`,
  )
  .regex(EMAIL_PATTERN, "Enter a valid email like name@example.com.")
  .email("Enter a valid email like name@example.com.");

export const phoneFieldSchema = z
  .string()
  .trim()
  .min(1, "Phone is required.")
  .max(
    FIELD_LIMITS.phone,
    `Phone must be at most ${FIELD_LIMITS.phone} characters.`,
  )
  .regex(PHONE_PATTERN, "Phone can only contain numbers.")
  .refine((value) => value.length >= 7, {
    message: "Phone must be at least 7 digits.",
  });

export const messageFieldSchema = z
  .string()
  .trim()
  .min(1, "Message is required.")
  .max(
    FIELD_LIMITS.message,
    `Message must be at most ${FIELD_LIMITS.message} characters.`,
  );

export type PersonFieldKey = "name" | "email" | "phone";
export type ContactFieldKey = PersonFieldKey | "message";

export interface FieldMessages {
  nameRequired: string;
  nameLetters: string;
  nameMax: string;
  emailRequired: string;
  emailInvalid: string;
  emailMax: string;
  phoneRequired: string;
  phoneDigits: string;
  phoneMin: string;
  phoneMax: string;
  messageRequired: string;
  messageMax: string;
}

function firstIssueMessage(
  result: z.ZodSafeParseResult<string>,
  fallback: string,
): string | undefined {
  if (result.success) return undefined;
  return result.error.issues[0]?.message ?? fallback;
}

/**
 * Client-side field validation with localized copy.
 * Returns only keys that failed.
 */
export function validatePersonFields(
  values: { name: string; email: string; phone: string },
  messages: FieldMessages,
): Partial<Record<PersonFieldKey, string>> {
  const errors: Partial<Record<PersonFieldKey, string>> = {};

  const name = nameFieldSchema.safeParse(values.name);
  if (!name.success) {
    const raw = name.error.issues[0]?.message ?? "";
    if (raw.includes("required")) errors.name = messages.nameRequired;
    else if (raw.includes("at most")) errors.name = messages.nameMax;
    else errors.name = messages.nameLetters;
  }

  const email = emailFieldSchema.safeParse(values.email);
  if (!email.success) {
    const raw = email.error.issues[0]?.message ?? "";
    if (raw.includes("required")) errors.email = messages.emailRequired;
    else if (raw.includes("at most")) errors.email = messages.emailMax;
    else errors.email = messages.emailInvalid;
  }

  const phone = phoneFieldSchema.safeParse(values.phone);
  if (!phone.success) {
    const raw = phone.error.issues[0]?.message ?? "";
    if (raw.includes("required")) errors.phone = messages.phoneRequired;
    else if (raw.includes("at most")) errors.phone = messages.phoneMax;
    else if (raw.includes("at least")) errors.phone = messages.phoneMin;
    else errors.phone = messages.phoneDigits;
  }

  return errors;
}

export function validateContactFields(
  values: { name: string; email: string; phone: string; message: string },
  messages: FieldMessages,
): Partial<Record<ContactFieldKey, string>> {
  const errors: Partial<Record<ContactFieldKey, string>> = {
    ...validatePersonFields(values, messages),
  };

  const message = messageFieldSchema.safeParse(values.message);
  if (!message.success) {
    const raw = firstIssueMessage(message, messages.messageRequired) ?? "";
    if (raw.includes("at most")) errors.message = messages.messageMax;
    else errors.message = messages.messageRequired;
  }

  return errors;
}

/** Digits-only filter for phone inputs. */
export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "").slice(0, FIELD_LIMITS.phone);
}
