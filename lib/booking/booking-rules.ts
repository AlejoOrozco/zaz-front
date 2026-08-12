import {
  MEETING_DURATION_MINUTES,
  PENDING_EXPIRATION_MINUTES,
} from "@/lib/booking/config";
import {
  addMinutes,
  formatBogotaDate,
  isDateWithinBookingHorizon,
  isStartAlignedToDuration,
  isWithinWorkingHours,
  meetingEndFromStart,
  normalizeBogotaSlotStart,
} from "@/lib/booking/time";

type BookingRuleErrorCode =
  | "PAST_TIME"
  | "OUTSIDE_HORIZON"
  | "INVALID_DURATION_ALIGNMENT"
  | "OUTSIDE_WORKING_HOURS"
  | "INVALID_TIMESTAMP";

interface BookingRuleFailure {
  ok: false;
  code: BookingRuleErrorCode;
  message: string;
}

interface BookingRuleSuccess {
  ok: true;
  startAt: Date;
  endAt: Date;
  expiresAt: Date;
}

type BookingRuleResult = BookingRuleSuccess | BookingRuleFailure;

/**
 * Server-side booking rules. Duration is always MEETING_DURATION_MINUTES  
 * clients cannot choose a different length.
 */
export function validateMeetingRequest(
  startAtInput: string,
  now: Date = new Date(),
): BookingRuleResult {
  const parsed = new Date(startAtInput);
  if (Number.isNaN(parsed.getTime())) {
    return {
      ok: false,
      code: "INVALID_TIMESTAMP",
      message: "Meeting time must be a valid timestamp.",
    };
  }

  // Canonicalize to America/Bogota wall time → UTC (ignore client drift).
  const startAt = normalizeBogotaSlotStart(parsed);

  if (startAt.getTime() <= now.getTime()) {
    return {
      ok: false,
      code: "PAST_TIME",
      message: "Please choose a time in the future.",
    };
  }

  const date = formatBogotaDate(startAt);
  if (!isDateWithinBookingHorizon(date, now)) {
    return {
      ok: false,
      code: "OUTSIDE_HORIZON",
      message: "That date is outside the booking window.",
    };
  }

  if (!isStartAlignedToDuration(startAt)) {
    return {
      ok: false,
      code: "INVALID_DURATION_ALIGNMENT",
      message: `Meetings start on ${MEETING_DURATION_MINUTES}-minute boundaries.`,
    };
  }

  const endAt = meetingEndFromStart(startAt);
  if (!isWithinWorkingHours(startAt, endAt)) {
    return {
      ok: false,
      code: "OUTSIDE_WORKING_HOURS",
      message: "That time is outside working hours.",
    };
  }

  return {
    ok: true,
    startAt,
    endAt,
    expiresAt: addMinutes(now, PENDING_EXPIRATION_MINUTES),
  };
}
