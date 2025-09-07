// app/api/user/onboarding/route.ts
// app/api/user/onboarding/route.ts
// app/api/user/onboarding/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { z } from "zod";

const Schema = z.object({
  choices: z.array(z.enum(["watching", "live", "creating", "learning"])).min(1),
});

export async function POST(req: Request) {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Make sure a User row exists keyed by supabase user.id (string)
  await prisma.user.upsert({
    where: { id: data.user.id },
    update: { email: data.user.email ?? undefined },
    create: { id: data.user.id, email: data.user.email ?? undefined },
  });

  await prisma.onboarding.upsert({
    where: { userId: data.user.id },
    update: { usageChoices: parsed.data.choices },
    create: { userId: data.user.id, usageChoices: parsed.data.choices },
  });

  return NextResponse.json({ ok: true });
}
