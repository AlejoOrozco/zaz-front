/**
 * Single source of truth for meeting booking rules.
 * Server-side only   do not import from client components that need
 * to stay presentation-only. Re-export safe display constants if needed.
 */

export const MEETING_DURATION_MINUTES = 30 as const;
export const PENDING_EXPIRATION_MINUTES = 15 as const;
export const BOOKING_TIMEZONE = "America/Bogota" as const;
export const BOOKING_HORIZON_DAYS = 30 as const;

/** Colombia observes UTC−5 year-round (no DST). */
export const BOOKING_UTC_OFFSET_HOURS = -5 as const;

export interface WorkingWindow {
  readonly startHour: number;
  readonly startMinute: number;
  readonly endHour: number;
  readonly endMinute: number;
}

/**
 * Working windows by weekday (0 = Sunday … 6 = Saturday), local to BOOKING_TIMEZONE.
 * Saturday/Sunday include 22:00–00:00 (midnight), so the last 30-min slot is 23:30–00:00.
 */
export const WORKING_HOURS: Readonly<Record<number, readonly WorkingWindow[]>> =
  {
    1: [{ startHour: 6, startMinute: 0, endHour: 22, endMinute: 0 }], // Mon
    2: [{ startHour: 6, startMinute: 0, endHour: 22, endMinute: 0 }], // Tue
    3: [{ startHour: 6, startMinute: 0, endHour: 22, endMinute: 0 }], // Wed
    4: [{ startHour: 6, startMinute: 0, endHour: 22, endMinute: 0 }], // Thu
    5: [{ startHour: 6, startMinute: 0, endHour: 22, endMinute: 0 }], // Fri
    6: [
      { startHour: 6, startMinute: 0, endHour: 10, endMinute: 0 },
      { startHour: 22, startMinute: 0, endHour: 24, endMinute: 0 },
    ], // Sat
    0: [
      { startHour: 6, startMinute: 0, endHour: 10, endMinute: 0 },
      { startHour: 22, startMinute: 0, endHour: 24, endMinute: 0 },
    ], // Sun
  } as const;

export const RATE_LIMITS = {
  availability: {
    maxRequests: 20,
    windowMs: 5 * 60 * 1000,
  },
  meetings: {
    maxRequests: 5,
    windowMs: 10 * 60 * 1000,
  },
  contact: {
    maxRequests: 3,
    windowMs: 10 * 60 * 1000,
  },
} as const;

export const FIELD_LIMITS = {
  name: 100,
  email: 254,
  phone: 30,
  message: 3000,
} as const;
