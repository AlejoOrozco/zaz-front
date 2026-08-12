import { NextResponse } from "next/server";
import type { ApiErrorBody } from "@/types/meetings";

export function jsonError(
  status: number,
  body: ApiErrorBody,
  headers?: HeadersInit,
): NextResponse {
  return NextResponse.json(body, { status, headers });
}

export function validationError(
  details: Record<string, string[]>,
): NextResponse {
  return jsonError(400, {
    error: "VALIDATION_ERROR",
    message: "Please check the highlighted fields and try again.",
    details,
  });
}

export function rateLimitedError(retryAfterSeconds: number): NextResponse {
  return jsonError(
    429,
    {
      error: "RATE_LIMITED",
      message:
        "Too many requests. Please wait a few minutes and try again.",
      retryAfterSeconds,
    },
    { "Retry-After": String(retryAfterSeconds) },
  );
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
