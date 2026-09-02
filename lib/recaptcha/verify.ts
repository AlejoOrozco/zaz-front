/**
 * Server-only Google reCAPTCHA v3 verification.
 * Never import this module from client components.
 */

import {
  RECAPTCHA_MIN_SCORE,
  RECAPTCHA_SITEVERIFY_URL,
  RECAPTCHA_VERIFY_TIMEOUT_MS,
  type RecaptchaAction,
} from "@/lib/recaptcha/config";

export interface RecaptchaVerifyParams {
  readonly token: string;
  readonly expectedAction: RecaptchaAction;
  readonly remoteIp: string;
}

export type RecaptchaVerifyResult =
  | { ok: true; score: number }
  | { ok: false; reason: "misconfigured" | "unavailable" | "rejected" };

interface SiteVerifyResponse {
  readonly success: boolean;
  readonly score?: number;
  readonly action?: string;
  readonly hostname?: string;
  readonly errorCodes?: readonly string[];
}

function parseSiteVerifyResponse(value: unknown): SiteVerifyResponse | null {
  if (typeof value !== "object" || value === null) return null;
  if (!("success" in value) || typeof value.success !== "boolean") return null;

  const score =
    "score" in value && typeof value.score === "number" ? value.score : undefined;
  const action =
    "action" in value && typeof value.action === "string"
      ? value.action
      : undefined;
  const hostname =
    "hostname" in value && typeof value.hostname === "string"
      ? value.hostname
      : undefined;

  let errorCodes: readonly string[] | undefined;
  if ("error-codes" in value && Array.isArray(value["error-codes"])) {
    errorCodes = value["error-codes"].filter(
      (item): item is string => typeof item === "string",
    );
  }

  return { success: value.success, score, action, hostname, errorCodes };
}

async function requestSiteVerify(params: {
  secret: string;
  token: string;
  remoteIp: string;
}): Promise<SiteVerifyResponse | null> {
  const body = new URLSearchParams({
    secret: params.secret,
    response: params.token,
  });
  if (params.remoteIp !== "unknown") {
    body.set("remoteip", params.remoteIp);
  }

  try {
    const response = await fetch(RECAPTCHA_SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(RECAPTCHA_VERIFY_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    const payload: unknown = await response.json();
    return parseSiteVerifyResponse(payload);
  } catch (error) {
    console.error("reCAPTCHA siteverify request failed", {
      reason: error instanceof Error ? error.message : "unknown",
    });
    return null;
  }
}

function isAcceptable(
  result: SiteVerifyResponse,
  expectedAction: RecaptchaAction,
): boolean {
  if (!result.success) return false;
  if (result.action !== expectedAction) return false;
  if (typeof result.score !== "number") return false;
  return result.score >= RECAPTCHA_MIN_SCORE;
}

export async function verifyRecaptcha(
  params: RecaptchaVerifyParams,
): Promise<RecaptchaVerifyResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.error("reCAPTCHA verification failed: missing RECAPTCHA_SECRET_KEY");
    return { ok: false, reason: "misconfigured" };
  }

  const googleResult = await requestSiteVerify({
    secret,
    token: params.token,
    remoteIp: params.remoteIp,
  });

  if (!googleResult) {
    return { ok: false, reason: "unavailable" };
  }

  if (!isAcceptable(googleResult, params.expectedAction)) {
    console.error("reCAPTCHA rejected request", {
      action: params.expectedAction,
      returnedAction: googleResult.action,
      success: googleResult.success,
      score: googleResult.score,
      hostname: googleResult.hostname,
      errorCodes: googleResult.errorCodes,
    });
    return { ok: false, reason: "rejected" };
  }

  return { ok: true, score: googleResult.score ?? 0 };
}
