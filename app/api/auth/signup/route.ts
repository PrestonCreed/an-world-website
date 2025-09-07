// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { hashPassword } from "@/lib/password";

const SignUpSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(32).regex(/^[a-zA-Z0-9_.-]+$/),
  password: z.string().min(6).max(128),
  newsletter: z.boolean().optional(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = SignUpSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
  }
  const { email, username, password, newsletter } = parsed.data;

  const exists = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
    select: { id: true, email: true, username: true },
  });
  if (exists) {
    return NextResponse.json({ ok: false, reason: "user_exists" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: {
      email,
      username,
      passwordHash,
      newsletterOptIn: !!newsletter,
    },
    select: { id: true, email: true, username: true },
  });

  // Default role: viewer (implicit UI); creators/admins are granted via script/admin UI later.

  return NextResponse.json({ ok: true, user }, { status: 201 });
}
