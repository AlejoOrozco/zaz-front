import { RATE_LIMITS } from "@/lib/booking/config";
import { buildAvailability } from "@/lib/booking/availability";
import { getOccupiedIntervalsForDate } from "@/lib/booking/booking-conflicts";
import {
  getClientIp,
  jsonError,
  rateLimitedError,
  validationError,
} from "@/lib/api/http";
import { checkRateLimit } from "@/lib/rate-limit";
import { availabilityQuerySchema } from "@/lib/validation/meetings";

export async function GET(request: Request): Promise<Response> {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`availability:${ip}`, RATE_LIMITS.availability);
  if (!limit.allowed) {
    return rateLimitedError(limit.retryAfterSeconds);
  }

  const { searchParams } = new URL(request.url);
  const parsed = availabilityQuerySchema.safeParse({
    date: searchParams.get("date") ?? "",
  });

  if (!parsed.success) {
    const details: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "date");
      details[key] = [...(details[key] ?? []), issue.message];
    }
    return validationError(details);
  }

  try {
    const occupied = await getOccupiedIntervalsForDate(parsed.data.date);
    const availability = buildAvailability({
      date: parsed.data.date,
      occupied,
    });
    return Response.json(availability, { status: 200 });
  } catch {
    return jsonError(500, {
      error: "INTERNAL_ERROR",
      message: "Unable to load availability. Please try again shortly.",
    });
  }
}
