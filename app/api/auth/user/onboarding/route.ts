// app/api/auth/user/onboarding/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // never pre-render this
export const revalidate = 0;

import { NextResponse } from "next/server";
import { z } from "zod";

// If your POST needs these, keep them; otherwise you can remove
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Acceptable payload shape
const BodySchema = z.object({
  choices: z.array(z.enum(["watching", "live", "creating", "learning"])).min(1),
});

/**
 * SAFETY GET:
 * Some server component / prefetch might call GET during build.
 * Always return a small OK payload so build never fails here.
 */
export async function GET() {
  try {
    return NextResponse.json({ ok: true });
  } catch {
    // Never throw from API routes during build
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    // Guard: content-type may be missing during weird prefetches
    const contentType = req.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return NextResponse.json({ ok: false, error: "bad_content_type" }, { status: 400 });
    }

    // Auth check (will be missing during build/prefetch; just return 401, don't throw)
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    // Validate body
    const body = await req.json().catch(() => ({}));
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
    }

    const { user } = data;

    // Persist (adjust model/table names if different)
    await prisma.user.upsert({
      where: { id: user.id },
      update: { email: user.email ?? undefined },
      create: { id: user.id, email: user.email ?? undefined },
    });

    await prisma.onboarding.upsert({
      where: { userId: user.id },
      update: { usageChoices: parsed.data.choices },
      create: { userId: user.id, usageChoices: parsed.data.choices },
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Belt & suspenders: never let this throw
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 200 });
  }
}
