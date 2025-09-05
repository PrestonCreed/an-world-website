// Redis-backed fixed-window rate limiter (Upstash).
// Env required:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN
//
// Usage in an API route:
//   import { limitByIP } from "@/lib/rate-limit";
//   const rl = await limitByIP(request, { limit: 60, windowMs: 60_000 });
//   if (!rl.success) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

import { Redis } from "@upstash/redis";

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number; // epoch seconds
};

// ---- Defensive env checks (fail early with a clear message)
const URL = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!URL || !TOKEN) {
  const missing = [
    !URL ? "UPSTASH_REDIS_REST_URL" : null,
    !TOKEN ? "UPSTASH_REDIS_REST_TOKEN" : null,
  ].filter(Boolean).join(", ");
  throw new Error(
    `Redis rate-limit is enabled but missing env var(s): ${missing}.
Set them in .env.local:

UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxx

Then restart: npm run dev`
  );
}

const redis = new Redis({ url: URL, token: TOKEN });

function ipFromRequest(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const ip = xff.split(",")[0]?.trim();
    if (ip) return ip;
  }
  const cf = (req.headers.get("cf-connecting-ip") || req.headers.get("true-client-ip"))?.trim();
  if (cf) return cf;
  return "0.0.0.0";
}

function keyFor(identifier: string, windowMs: number) {
  const now = Date.now();
  const windowStart = Math.floor(now / windowMs) * windowMs;
  return `rl:${identifier}:${windowStart}:${windowMs}`;
}

export async function limit(
  identifier: string,
  opts?: { limit?: number; windowMs?: number }
): Promise<RateLimitResult> {
  const max = opts?.limit ?? 60;
  const windowMs = opts?.windowMs ?? 60_000;

  const key = keyFor(identifier, windowMs);
  // INCR and set expiry atomically
  const p = redis.pipeline();
  p.incr(key);
  p.expire(key, Math.ceil(windowMs / 1000));
  const [countRaw] = (await p.exec()) as [number, unknown];

  const count = Number(countRaw || 0);
  const remaining = Math.max(0, max - count);
  const reset = Math.floor((Math.floor(Date.now() / windowMs) * windowMs + windowMs) / 1000);

  return {
    success: count <= max,
    limit: max,
    remaining,
    reset,
  };
}

export async function limitByIP(req: Request, opts?: { limit?: number; windowMs?: number }) {
  const id = ipFromRequest(req);
  return limit(id, opts);
}
