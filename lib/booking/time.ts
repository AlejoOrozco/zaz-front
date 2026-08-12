/**
 * Time helpers for America/Bogota (UTC−5, no DST).
 * Never use Date local getters as Colombia wall time.
 */

import {
  BOOKING_HORIZON_DAYS,
  BOOKING_TIMEZONE,
  BOOKING_UTC_OFFSET_HOURS,
  MEETING_DURATION_MINUTES,
  WORKING_HOURS,
  type WorkingWindow,
} from "@/lib/booking/config";

interface BogotaDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** 0 = Sunday … 6 = Saturday */
  weekday: number;
}

export function formatBogotaDate(date: Date): string {
  const parts = getBogotaParts(date);
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function getBogotaParts(date: Date): BogotaDateParts {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    weekday: "short",
  });

  const bags = Object.fromEntries(
    formatter.formatToParts(date).map((part) => [part.type, part.value]),
  );

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  // Some engines emit "24" for midnight; normalize to 0.
  const rawHour = Number(bags.hour);
  const hour = rawHour === 24 ? 0 : rawHour;

  return {
    year: Number(bags.year),
    month: Number(bags.month),
    day: Number(bags.day),
    hour,
    minute: Number(bags.minute),
    second: Number(bags.second),
    weekday: weekdayMap[bags.weekday ?? ""] ?? 0,
  };
}

/**
 * Absolute UTC instant from Bogota wall clock.
 * `hour` may be 24 to represent end-of-day midnight.
 */
export function bogotaWallTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
): Date {
  return new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      hour - BOOKING_UTC_OFFSET_HOURS,
      minute,
      0,
      0,
    ),
  );
}

export function parseBogotaDateString(date: string): {
  year: number;
  month: number;
  day: number;
} {
  const [year, month, day] = date.split("-").map(Number);
  return { year, month, day };
}

export function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60_000);
}

function addBogotaCalendarDays(date: string, days: number): string {
  const { year, month, day } = parseBogotaDateString(date);
  const utc = bogotaWallTimeToUtc(year, month, day, 12, 0);
  return formatBogotaDate(addMinutes(utc, days * 24 * 60));
}

export function meetingEndFromStart(startAt: Date): Date {
  return addMinutes(startAt, MEETING_DURATION_MINUTES);
}

export function getWorkingWindowsForDate(date: string): readonly WorkingWindow[] {
  const { year, month, day } = parseBogotaDateString(date);
  const noonUtc = bogotaWallTimeToUtc(year, month, day, 12, 0);
  const weekday = getBogotaParts(noonUtc).weekday;
  return WORKING_HOURS[weekday] ?? [];
}

/** Inclusive: today (Bogota) through today + BOOKING_HORIZON_DAYS. */
export function isDateWithinBookingHorizon(
  date: string,
  now: Date = new Date(),
): boolean {
  const today = formatBogotaDate(now);
  const last = addBogotaCalendarDays(today, BOOKING_HORIZON_DAYS);
  return date >= today && date <= last;
}

export function isStartAlignedToDuration(startAt: Date): boolean {
  const parts = getBogotaParts(startAt);
  return parts.second === 0 && parts.minute % MEETING_DURATION_MINUTES === 0;
}

function toMinutes(hour: number, minute: number): number {
  return hour * 60 + minute;
}

/**
 * True when [startAt, endAt) fits inside a working window for the
 * Bogota calendar day of startAt. Supports 23:30–00:00 weekend slots.
 */
export function isWithinWorkingHours(startAt: Date, endAt: Date): boolean {
  if (endAt.getTime() - startAt.getTime() !== MEETING_DURATION_MINUTES * 60_000) {
    return false;
  }

  const start = getBogotaParts(startAt);
  const date = formatBogotaDate(startAt);
  const windows = getWorkingWindowsForDate(date);
  const startMinutes = toMinutes(start.hour, start.minute);

  for (const window of windows) {
    const windowStart = toMinutes(window.startHour, window.startMinute);
    const windowEnd = toMinutes(window.endHour, window.endMinute);

    if (window.endHour === 24) {
      // Overnight window ending at midnight: allow last slot 23:30–00:00.
      if (startMinutes >= windowStart && startMinutes + MEETING_DURATION_MINUTES <= 24 * 60) {
        const expectedEnd = addMinutes(startAt, MEETING_DURATION_MINUTES);
        if (expectedEnd.getTime() === endAt.getTime()) return true;
      }
      continue;
    }

    if (
      startMinutes >= windowStart &&
      startMinutes + MEETING_DURATION_MINUTES <= windowEnd &&
      formatBogotaDate(addMinutes(endAt, -1)) === date
    ) {
      return true;
    }
  }

  return false;
}

/** Format instant with Bogota offset for API responses. */
export function formatBogotaOffsetIso(date: Date): string {
  const parts = getBogotaParts(date);
  const offset = BOOKING_UTC_OFFSET_HOURS;
  const sign = offset <= 0 ? "-" : "+";
  const abs = Math.abs(offset);
  return `${String(parts.year).padStart(4, "0")}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}T${String(parts.hour).padStart(2, "0")}:${String(parts.minute).padStart(2, "0")}:${String(parts.second).padStart(2, "0")}${sign}${String(abs).padStart(2, "0")}:00`;
}

/**
 * Rebuild the canonical UTC instant from Bogota wall-clock parts.
 * Prevents client/string parsing drift from storing the wrong absolute time.
 */
export function normalizeBogotaSlotStart(date: Date): Date {
  const parts = getBogotaParts(date);
  return bogotaWallTimeToUtc(
    parts.year,
    parts.month,
    parts.day,
    parts.hour,
    parts.minute,
  );
}

/** Human-readable range for emails / owner notifications. */
export function formatBogotaRangeLabel(startAt: Date, endAt: Date): string {
  const dateLabel = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIMEZONE,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(startAt);

  const timeFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: BOOKING_TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${dateLabel}, ${timeFormat.format(startAt)} – ${timeFormat.format(endAt)} (${BOOKING_TIMEZONE})`;
}
