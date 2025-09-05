import { NextResponse } from "next/server";
import { limitByIP } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const rl = await limitByIP(req, { limit: 5, windowMs: 60_000 }); // 5 requests/min
  if (!rl.success) {
    return NextResponse.json({ error: "Too many requests", ...rl }, { status: 429 });
  }
  return NextResponse.json({ ok: true, ...rl });
}
