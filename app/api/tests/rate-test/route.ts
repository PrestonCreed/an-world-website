// /app/api/tests/rate-test/route.ts
import { NextResponse } from "next/server";
import { rlGeneral, getIdentityForRequest, withRateHeaders } from "@/lib/rate-limit";

// Optional: if you have auth helpers, import and try to fetch userId
// import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic"; // ensure this executes on each call

export async function GET(req: Request) {
  // const user = await getCurrentUser(); // if you have it
  const id = getIdentityForRequest(req /* , user?.id ?? null */);

  const { success, limit, remaining, reset } = await rlGeneral.limit(id);

  if (!success) {
    return withRateHeaders(
      NextResponse.json(
        {
          ok: false,
          reason: "rate_limited",
          identity: id,
        },
        { status: 429 }
      ),
      limit,
      remaining,
      reset
    );
  }

  return withRateHeaders(
    NextResponse.json({
      ok: true,
      identity: id,
      message:
        "Limiter working. Keep calling until you receive HTTP 429 to confirm.",
    }),
    limit,
    remaining,
    reset
  );
}
