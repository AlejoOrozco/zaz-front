import { RATE_LIMITS } from "@/lib/booking/config";
import { createContactMessage } from "@/lib/booking/booking-conflicts";
import {
  getClientIp,
  jsonError,
  rateLimitedError,
  validationError,
} from "@/lib/api/http";
import { sendContactNotification } from "@/lib/email/resend";
import { checkRateLimit } from "@/lib/rate-limit";
import { createContactSchema } from "@/lib/validation/contact";

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

  const parsed = createContactSchema.safeParse(body);
  if (!parsed.success) {
    const details: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "_");
      details[key] = [...(details[key] ?? []), issue.message];
    }
    return validationError(details);
  }

  const created = await createContactMessage(parsed.data);
  if (!created.ok) {
    return jsonError(500, {
      error: "INTERNAL_ERROR",
      message: "Unable to send your message. Please try again shortly.",
    });
  }

  try {
    await sendContactNotification({
      ...parsed.data,
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
