import { RATE_LIMITS } from "@/lib/booking/config";
import { createContactMessage } from "@/lib/booking/booking-conflicts";
import {
  getClientIp,
  jsonError,
  rateLimitedError,
  validationError,
} from "@/lib/api/http";
import { sendContactNotification } from "@/lib/email/resend";
import { recaptchaGuard } from "@/lib/api/recaptcha";
import { RECAPTCHA_ACTIONS } from "@/lib/recaptcha/config";
import { checkRateLimit } from "@/lib/rate-limit";
import { createContactRequestSchema } from "@/lib/validation/contact";

export async function POST(request: Request): Promise<Response> {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`contact:${ip}`, RATE_LIMITS.contact);
  if (!limit.allowed) {
    return rateLimitedError(limit.retryAfterSeconds);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, {
      error: "INVALID_JSON",
      message: "Request body must be valid JSON.",
    });
  }

  const parsed = createContactRequestSchema.safeParse(body);
  if (!parsed.success) {
    const details: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "_");
      details[key] = [...(details[key] ?? []), issue.message];
    }
    return validationError(details);
  }

  const recaptchaToken = parsed.data.recaptchaToken;
  const contact = {
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    message: parsed.data.message,
  };
  const recaptchaError = await recaptchaGuard({
    token: recaptchaToken,
    expectedAction: RECAPTCHA_ACTIONS.contact,
    remoteIp: ip,
  });
  if (recaptchaError) return recaptchaError;

  const created = await createContactMessage(contact);
  if (!created.ok) {
    return jsonError(500, {
      error: "INTERNAL_ERROR",
      message: "Unable to send your message. Please try again shortly.",
    });
  }

  try {
    await sendContactNotification({
      ...contact,
      messageId: created.id,
    });
  } catch (error) {
    console.error("Contact email notification failed", {
      messageId: created.id,
      reason: error instanceof Error ? error.message : "unknown",
    });
  }

  return Response.json(
    {
      id: created.id,
      message: "Thanks   your message was received. We'll get back to you soon.",
    },
    { status: 201 },
  );
}
