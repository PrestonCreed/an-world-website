// app/api/auth/_db-ping/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import type { PrismaClient } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma: PrismaClient = getPrisma();
    const r = await prisma.$queryRawUnsafe<{ one: number }[]>(`select 1 as one`);
    return NextResponse.json({ ok: true, result: r });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 });
  }
}
