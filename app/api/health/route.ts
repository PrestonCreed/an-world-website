import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // always fresh

export async function GET() {
  const now = new Date();
  const uptime = process.uptime();
  const region =
    process.env.VERCEL_REGION ||
    process.env.FLY_REGION ||
    process.env.AWS_REGION ||
    null;

  return NextResponse.json(
    {
      status: "ok",
      timestamp: now.toISOString(),
      uptimeSeconds: Math.round(uptime),
      node: process.version,
      environment: process.env.NODE_ENV,
      region,
      commit: process.env.VERCEL_GIT_COMMIT_SHA || null
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
