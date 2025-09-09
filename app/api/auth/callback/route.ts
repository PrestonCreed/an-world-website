// app/api/auth/callback/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const type = url.searchParams.get("type");      // e.g. "recovery", "signup", "magiclink"
  const redirectParam = url.searchParams.get("redirect");

  // Default redirect
  const fallbackRedirect = type === "recovery" ? "/reset-password" : "/";

  // Prepare a response we can write cookies to
  let res = NextResponse.redirect(new URL(redirectParam || fallbackRedirect, url.origin));

  // Create a Supabase client bound to this request/response pair
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return req.cookies.get(name)?.value; },
        set(name: string, value: string, options: any) { res.cookies.set({ name, value, ...options }); },
        remove(name: string, options: any) { res.cookies.set({ name, value: "", ...options, maxAge: 0 }); },
      },
    }
  );

  if (!code) return res;

  // Exchange the PKCE one-time code for a cookie session
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(new URL("/signin?error=auth", url.origin));
  }

  // If this was a password recovery link, we’ll land at /reset-password
  return res;
}



