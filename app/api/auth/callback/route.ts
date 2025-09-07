// app/api/auth/callback/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");        // <- Supabase sets this (e.g., "recovery", "signup", "magiclink")
  const redirectParam = url.searchParams.get("redirect");
  // If no redirect was provided and this is a password recovery, force /reset-password
  const fallbackRedirect =
    type === "recovery" ? "/reset-password" : "/";

  // Prepare a response we can mutate cookies on
  let res = NextResponse.redirect(new URL(redirectParam || fallbackRedirect, url.origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: "", ...options, maxAge: 0 });
        },
      },
    }
  );

  if (!code) {
    // If no code, just bounce to redirect or fallback
    return res;
  }

  // Exchange the one-time code from email link for a session cookie
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/signin?error=auth", url.origin));
  }

  // Success: redirect to desired page (recovery -> /reset-password)
  return res;
}
