// app/api/user/onboarding/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next"; // App Router-friendly entrypoint
import { authOptions } from "@/lib/auth";
import { z } from "zod";
import type { Session } from "next-auth";

const Schema = z.object({
  choices: z.array(z.enum(["watching", "live", "creating", "learning"])).min(1),
});

// Narrow Session | null to a Session that definitely has user.id
function hasUserId(s: Session | null): s is Session & { user: { id: string } } {
  return !!s?.user && typeof (s.user as any).id === "string" && (s.user as any).id.length > 0;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions) as Session | null;
  if (!hasUserId(session)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  await prisma.onboarding.upsert({
    where: { userId: session.user.id },
    update: { usageChoices: parsed.data.choices },
    create: { userId: session.user.id, usageChoices: parsed.data.choices },
  });

  return NextResponse.json({ ok: true });
}

