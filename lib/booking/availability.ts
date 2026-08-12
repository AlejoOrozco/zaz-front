import {
  BOOKING_TIMEZONE,
  MEETING_DURATION_MINUTES,
} from "@/lib/booking/config";
import {
  addMinutes,
  bogotaWallTimeToUtc,
  formatBogotaOffsetIso,
  getWorkingWindowsForDate,
  isDateWithinBookingHorizon,
  parseBogotaDateString,
} from "@/lib/booking/time";

export interface AvailabilitySlot {
  startAt: string;
  endAt: string;
  available: boolean;
}

export interface AvailabilityResponse {
  date: string;
  timezone: typeof BOOKING_TIMEZONE;
  slots: AvailabilitySlot[];
}

export interface OccupiedInterval {
  startAt: Date;
  endAt: Date;
}

function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

/**
 * Generate all schedule slots for a Bogota calendar day and mark
 * occupancy. Past slots and dates outside the horizon are empty.
 */
export function buildAvailability(params: {
  date: string;
  occupied: readonly OccupiedInterval[];
  now?: Date;
}): AvailabilityResponse {
  const now = params.now ?? new Date();
  const { date, occupied } = params;

  if (!isDateWithinBookingHorizon(date, now)) {
    return { date, timezone: BOOKING_TIMEZONE, slots: [] };
  }

  const { year, month, day } = parseBogotaDateString(date);
  const windows = getWorkingWindowsForDate(date);
  const slots: AvailabilitySlot[] = [];

  for (const window of windows) {
    const windowStartMinutes = window.startHour * 60 + window.startMinute;
    const windowEndMinutes = window.endHour * 60 + window.endMinute;

    for (
      let cursor = windowStartMinutes;
      cursor + MEETING_DURATION_MINUTES <= windowEndMinutes;
      cursor += MEETING_DURATION_MINUTES
    ) {
      const startHour = Math.floor(cursor / 60);
      const startMinute = cursor % 60;
      const startAt = bogotaWallTimeToUtc(
        year,
        month,
        day,
        startHour,
        startMinute,
      );
      const endAt = addMinutes(startAt, MEETING_DURATION_MINUTES);

      if (startAt.getTime() <= now.getTime()) {
        slots.push({
          startAt: formatBogotaOffsetIso(startAt),
          endAt: formatBogotaOffsetIso(endAt),
          available: false,
        });
        continue;
      }

      const conflict = occupied.some((interval) =>
        rangesOverlap(startAt, endAt, interval.startAt, interval.endAt),
      );

      slots.push({
        startAt: formatBogotaOffsetIso(startAt),
        endAt: formatBogotaOffsetIso(endAt),
        available: !conflict,
      });
    }
  }

  return { date, timezone: BOOKING_TIMEZONE, slots };
}
