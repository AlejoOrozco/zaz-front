import type { AvailabilityResponse } from "@/lib/booking/availability";
import type { ApiErrorBody } from "@/types/meetings";

async function parseError(response: Response): Promise<ApiErrorBody> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    return body;
  } catch {
    return {
      error: "UNKNOWN",
      message: "Something went wrong. Please try again.",
    };
  }
}

export class ApiRequestError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiRequestError";
    this.status = status;
    this.body = body;
  }
}

export async function fetchAvailability(
  date: string,
): Promise<AvailabilityResponse> {
  const response = await fetch(
    `/api/availability?date=${encodeURIComponent(date)}`,
  );
  if (!response.ok) {
    throw new ApiRequestError(response.status, await parseError(response));
  }
  return (await response.json()) as AvailabilityResponse;
}

export async function createMeeting(input: {
  name: string;
  email: string;
  phone: string;
  startAt: string;
}): Promise<{
  id: string;
  status: string;
  startAt: string;
  endAt: string;
  message: string;
}> {
  const response = await fetch("/api/meetings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new ApiRequestError(response.status, await parseError(response));
  }
  return (await response.json()) as {
    id: string;
    status: string;
    startAt: string;
    endAt: string;
    message: string;
  };
}

export async function createContact(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
}): Promise<{ id: string; message: string }> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    throw new ApiRequestError(response.status, await parseError(response));
  }
  return (await response.json()) as { id: string; message: string };
}
