import { Resend } from "resend";

let cached: Resend | null = null;

function getResendClient(): Resend {
  if (cached) return cached;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY.");
  }
  cached = new Resend(apiKey);
  return cached;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}.`);
  }
  return value;
}

interface MeetingEmailPayload {
  name: string;
  email: string;
  phone: string;
  whenLabel: string;
  startAtIso: string;
  endAtIso: string;
  meetingId: string;
}

interface ContactEmailPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  messageId: string;
}

/**
 * Sends owner notification. Throws on transport failure so callers can log.
 * Never include secrets or owner address in client responses.
 */
export async function sendMeetingNotification(
  payload: MeetingEmailPayload,
): Promise<void> {
  const resend = getResendClient();
  const from = requireEnv("RESEND_FROM_EMAIL");
  const to = requireEnv("ZAZ_CONTACT_EMAIL");

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `New meeting request   ${payload.name}`,
    replyTo: payload.email,
    text: [
      "A visitor requested a meeting.",
      "",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `When: ${payload.whenLabel}`,
      `Start (ISO): ${payload.startAtIso}`,
      `End (ISO): ${payload.endAtIso}`,
      `Meeting ID: ${payload.meetingId}`,
      "",
      "Status: PENDING   confirm or cancel manually in Supabase.",
    ].join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function sendContactNotification(
  payload: ContactEmailPayload,
): Promise<void> {
  const resend = getResendClient();
  const from = requireEnv("RESEND_FROM_EMAIL");
  const to = requireEnv("ZAZ_CONTACT_EMAIL");

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `New contact message   ${payload.name}`,
    replyTo: payload.email,
    text: [
      "A visitor sent a contact message.",
      "",
      `Name: ${payload.name}`,
      `Email: ${payload.email}`,
      `Phone: ${payload.phone}`,
      `Message ID: ${payload.messageId}`,
      "",
      payload.message,
    ].join("\n"),
  });

  if (error) {
    throw new Error(error.message);
  }
}
