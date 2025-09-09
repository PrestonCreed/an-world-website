// app/api/auth/user/onboarding/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // never let static prerender touch this
export const revalidate = 0;

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const Schema = z.object({
  choices: z.array(z.enum(["watching", "live", "creating", "learning"])).min(1),
});

export async function POST(req: Request) {
  try {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      // No session during prerender or anonymous call
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parsed = Schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "bad_request" }, { status: 400 });
    }

    const { user } = data;

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
  } catch (e) {
    // Never throw — always return JSON so builds don’t die
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }
}

// (Optional) implement GET safely too, if you use it,
// following the same pattern: never throw, return JSON.
