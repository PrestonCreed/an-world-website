// app/(auth)/signin/page.tsx
"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Logo from "@/components/logo";
import Link from "next/link";

export default function SignInPage() {
  const supabase = createSupabaseBrowserClient();
  const origin = typeof window !== "undefined" ? window.location.origin : undefined;

  return (
    <main className="min-h-[80vh] grid place-items-center p-6">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-black/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Logo />
          <h1 className="text-xl font-semibold">Sign in / Sign up</h1>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: { brand: "#0ea5e9", brandAccent: "#38bdf8" },
              },
            },
          }}
          providers={["google"]}
          // Route all flows (sign in, sign up, magic links, recovery) through our callback
          redirectTo={origin ? `${origin}/api/auth/callback` : undefined}
          // Hides only the "Forgot password?" link; keeps sign-up toggle visible
          view="sign_in"
          localization={{
            variables: {
              sign_in: {
                password_label: "Password",
                email_label: "Email",
            
              },
            },
          }}
        />

        {/* Our own custom forgot-password link */}
        <div className="mt-4 text-center">
          <Link href="/forgot-password" className="underline opacity-80 text-sm">
            Forgot your password?
          </Link>
        </div>
      </div>
    </main>
  );
}
