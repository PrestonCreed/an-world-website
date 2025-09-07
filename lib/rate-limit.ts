// /lib/rate-limit.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Reads UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN from env
const redis = Redis.fromEnv();

/**
 * Global limiter instances, reuse across calls to avoid cold starts.
 * Choose the algorithm best suited for your route:
 *  - slidingWindow: smoother user experience
 *  - fixedWindow: bursty but simpler
 *  - tokenBucket: allows short bursts up to capacity
 */

// Example: 5 requests per 60s (good for contact forms, tests, etc.)
export const rlContact = new Ratelimit({
  redis,
  // sliding window of 1 minute with 5 tokens
  limiter: Ratelimit.slidingWindow(5, "60 s"),
  analytics: true,
  prefix: "rl:contact", // namespace keys
});

// Example: general API guard — 60 req / minute per identity
export const rlGeneral = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "60 s"),
  analytics: true,
  prefix: "rl:api",
});

/**
 * Identify the caller:
 *  - If user is authenticated, prefer userId
 *  - Otherwise fall back to IP
 */
export function getIdentityForRequest(req: Request, userId?: string | null) {
  if (userId) return `user:${userId}`;
  // Try Next.js/Vercel IP first
  // @ts-ignore - NextRequest has .ip; native Request doesn't, so we fall back to headers.
  const ip = (req as any).ip ??
    req.headers.get("x-real-ip") ??
    (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown");
  return `ip:${ip}`;
}

/**
 * Helper to set standard rate limit headers on a Response.
 */
export function withRateHeaders(
  res: Response,
  limit: number,
  remaining: number,
  resetSeconds: number
) {
  const headers = new Headers(res.headers);
  headers.set("X-RateLimit-Limit", String(limit));
  headers.set("X-RateLimit-Remaining", String(Math.max(remaining, 0)));
  headers.set("X-RateLimit-Reset", String(resetSeconds));
  return new Response(res.body, { status: res.status, headers });
}

