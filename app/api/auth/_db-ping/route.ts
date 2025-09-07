export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const r = await prisma.$queryRawUnsafe<{ one: number }[]>(`select 1 as one`);
    return NextResponse.json({ ok: true, result: r });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}