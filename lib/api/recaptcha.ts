import type { NextResponse } from "next/server";
import { jsonError } from "@/lib/api/http";
import type { RecaptchaVerifyParams } from "@/lib/recaptcha/verify";
import { verifyRecaptcha } from "@/lib/recaptcha/verify";

export function recaptchaRejectedError(): NextResponse {
  return jsonError(403, {
    error: "RECAPTCHA_FAILED",
    message: "We couldn't verify this request. Please try again.",
  });
}

/**
 * Returns an error response when verification fails; otherwise null.
 */
export async function recaptchaGuard(
  params: RecaptchaVerifyParams,
): Promise<NextResponse | null> {
  const result = await verifyRecaptcha(params);
  if (result.ok) return null;
  if (result.reason === "rejected") return recaptchaRejectedError();
  return jsonError(500, {
    error: "INTERNAL_ERROR",
    message: "Unable to complete this request. Please try again shortly.",
  });
}
