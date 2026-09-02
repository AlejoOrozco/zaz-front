import { RATE_LIMITS } from "@/lib/booking/config";
import { validateMeetingRequest } from "@/lib/booking/booking-rules";
import { reserveMeeting } from "@/lib/booking/booking-conflicts";
import { formatBogotaOffsetIso, formatBogotaRangeLabel } from "@/lib/booking/time";
import {
  getClientIp,
  jsonError,
  rateLimitedError,
  validationError,
} from "@/lib/api/http";
import { sendMeetingNotification } from "@/lib/email/resend";
import { recaptchaGuard } from "@/lib/api/recaptcha";
import { RECAPTCHA_ACTIONS } from "@/lib/recaptcha/config";
import { checkRateLimit } from "@/lib/rate-limit";
import { createMeetingRequestSchema } from "@/lib/validation/meetings";

export async function POST(request: Request): Promise<Response> {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`meetings:${ip}`, RATE_LIMITS.meetings);
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

  const parsed = createMeetingRequestSchema.safeParse(body);
  if (!parsed.success) {
    const details: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "_");
      details[key] = [...(details[key] ?? []), issue.message];
    }
    return validationError(details);
  }

  const recaptchaToken = parsed.data.recaptchaToken;
  const meeting = {
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone,
    startAt: parsed.data.startAt,
  };
  const recaptchaError = await recaptchaGuard({
    token: recaptchaToken,
    expectedAction: RECAPTCHA_ACTIONS.meeting,
    remoteIp: ip,
  });
  if (recaptchaError) return recaptchaError;

  const rules = validateMeetingRequest(meeting.startAt);
  if (!rules.ok) {
    return jsonError(400, {
      error: rules.code,
      message: rules.message,
    });
  }

  const reserved = await reserveMeeting({
    name: meeting.name,
    email: meeting.email,
    phone: meeting.phone,
    startAt: rules.startAt,
    endAt: rules.endAt,
    expiresAt: rules.expiresAt,
  });

  if (!reserved.ok) {
    if (reserved.code === "SLOT_UNAVAILABLE") {
      return jsonError(409, {
        error: "SLOT_UNAVAILABLE",
        message:
          "That time was just taken. Please select another available time.",
      });
    }
    return jsonError(500, {
      error: "INTERNAL_ERROR",
      message: "Unable to book that meeting. Please try again shortly.",
    });
  }

  try {
    await sendMeetingNotification({
      name: meeting.name,
      email: meeting.email,
      phone: meeting.phone,
      whenLabel: formatBogotaRangeLabel(rules.startAt, rules.endAt),
      startAtIso: formatBogotaOffsetIso(rules.startAt),
      endAtIso: formatBogotaOffsetIso(rules.endAt),
      meetingId: reserved.meeting.id,
    });
  } catch (error) {
    console.error("Meeting email notification failed", {
      meetingId: reserved.meeting.id,
      reason: error instanceof Error ? error.message : "unknown",
    });
  }

  return Response.json(
    {
      id: reserved.meeting.id,
      status: "PENDING",
      startAt: formatBogotaOffsetIso(rules.startAt),
      endAt: formatBogotaOffsetIso(rules.endAt),
      message:
        "Your meeting request was received. We'll contact you shortly to confirm the time.",
    },
    { status: 201 },
  );
}
