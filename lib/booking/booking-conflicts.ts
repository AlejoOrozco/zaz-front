import { getSupabaseAdmin } from "@/lib/supabase/server";
import type { OccupiedInterval } from "@/lib/booking/availability";
import {
  bogotaWallTimeToUtc,
  parseBogotaDateString,
} from "@/lib/booking/time";
import type { MeetingRecord } from "@/types/meetings";

interface ReserveMeetingParams {
  name: string;
  email: string;
  phone: string;
  startAt: Date;
  endAt: Date;
  expiresAt: Date;
}

type ReserveMeetingResult =
  | { ok: true; meeting: MeetingRecord }
  | { ok: false; code: "SLOT_UNAVAILABLE" | "DATABASE_ERROR" };

/**
 * Active occupancy for availability:
 * CONFIRMED always; PENDING only while expires_at > now.
 */
export async function getOccupiedIntervalsForDate(
  date: string,
): Promise<OccupiedInterval[]> {
  const { year, month, day } = parseBogotaDateString(date);
  const dayStart = bogotaWallTimeToUtc(year, month, day, 0, 0);
  const dayEnd = bogotaWallTimeToUtc(year, month, day, 24, 0);
  const now = new Date();

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("meetings")
    .select("start_at, end_at, status, expires_at")
    .in("status", ["CONFIRMED", "PENDING"])
    .lt("start_at", dayEnd.toISOString())
    .gt("end_at", dayStart.toISOString());

  if (error) {
    throw new Error(`Failed to load meetings: ${error.message}`);
  }

  return (data ?? [])
    .filter((row) => {
      if (row.status === "CONFIRMED") return true;
      if (row.status !== "PENDING" || !row.expires_at) return false;
      return new Date(row.expires_at as string).getTime() > now.getTime();
    })
    .map((row) => ({
      startAt: new Date(row.start_at as string),
      endAt: new Date(row.end_at as string),
    }));
}

export async function reserveMeeting(
  params: ReserveMeetingParams,
): Promise<ReserveMeetingResult> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase.rpc("reserve_meeting", {
    p_name: params.name,
    p_email: params.email,
    p_phone: params.phone,
    p_start_at: params.startAt.toISOString(),
    p_end_at: params.endAt.toISOString(),
    p_expires_at: params.expiresAt.toISOString(),
  });

  if (error) {
    const message = `${error.message ?? ""} ${error.details ?? ""} ${error.hint ?? ""}`;
    const code = error.code ?? "";
    if (
      message.includes("SLOT_UNAVAILABLE") ||
      code === "23P01" ||
      code === "23505" ||
      code === "23514" ||
      code === "P0001"
    ) {
      return { ok: false, code: "SLOT_UNAVAILABLE" };
    }
    console.error("reserve_meeting failed", {
      code,
      message: error.message,
      details: error.details,
    });
    return { ok: false, code: "DATABASE_ERROR" };
  }

  return { ok: true, meeting: data as MeetingRecord };
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<{ ok: true; id: string } | { ok: false }> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
    })
    .select("id")
    .single();

  if (error || !data) {
    return { ok: false };
  }

  return { ok: true, id: data.id as string };
}
