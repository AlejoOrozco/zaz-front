/**
 * Simple in-memory sliding-window rate limiter (per process).
 * Fine for early single-instance deploys; resets on cold start.
 */

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

interface BucketEntry {
  timestamps: number[];
}

const buckets = new Map<string, BucketEntry>();

function prune(timestamps: number[], windowStart: number): number[] {
  return timestamps.filter((ts) => ts > windowStart);
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig,
  now: number = Date.now(),
): RateLimitResult {
  const windowStart = now - config.windowMs;
  const existing = buckets.get(key);
  const timestamps = prune(existing?.timestamps ?? [], windowStart);

  if (timestamps.length >= config.maxRequests) {
    const oldest = timestamps[0] ?? now;
    const retryAfterMs = Math.max(oldest + config.windowMs - now, 0);
    buckets.set(key, { timestamps });
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMs / 1000)),
    };
  }

  timestamps.push(now);
  buckets.set(key, { timestamps });

  return {
    allowed: true,
    retryAfterSeconds: 0,
  };
}
