// app/api/tests/db/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import type { PrismaClient } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

export async function GET() {
  try {
    const prisma: PrismaClient = getPrisma();
    const meta = (await prisma.$queryRawUnsafe(
      `SELECT current_database() AS db, NOW() AS now, version() AS version`
    )) as Array<{ db: string; now: Date; version: string }>;

    const row = meta?.[0] ?? null;

    const users = await prisma.user.count().catch(() => 0);
    const roles = await prisma.role.count().catch(() => 0);

    return NextResponse.json(
      {
        ok: true,
        database: row?.db ?? null,
        now: row?.now ?? null,
        version: row?.version ?? null,
        tables: { users, roles },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}

