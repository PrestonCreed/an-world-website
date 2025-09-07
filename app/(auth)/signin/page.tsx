// app/(auth)/signin/page.tsx
"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import Logo from "../../..public/images/an-logo.png";

export default function SignInPage() {
  const supabase = createSupabaseBrowserClient();

  return (
    <main className="min-h-[80vh] grid place-items-center p-6">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-black/20 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Logo />
          <h1 className="text-lg font-semibold">Sign in to Anything World</h1>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: { default: { colors: { brand: "#0ea5e9", brandAccent: "#38bdf8" } } },
          }}
          // Enable providers you switch on in the Supabase dashboard Auth → Providers
          providers={["google"]}
          // If you want magic links/password as well, just enable them in Supabase → Auth settings.
          redirectTo={typeof window !== "undefined" ? window.location.origin : undefined}
        />
      </div>
    </main>
  );
}

