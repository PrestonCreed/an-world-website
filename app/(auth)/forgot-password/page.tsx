// app/(auth)/forgot-password/page.tsx
"use client";

import { useMemo, useState, FormEvent } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);

    const origin = window.location.origin;
    const redirectTo = `${origin}/api/auth/callback?type=recovery&redirect=/reset-password`;

    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    if (error) {
      setErr(error.message ?? "Unable to send recovery email.");
      return;
    }
    setSent(true);
  }

  return (
    <main className="min-h-[80vh] grid place-items-center p-6">
      <div className="w-full max-w-md rounded-lg border border-white/10 bg-black/30 p-6">
        <h1 className="text-2xl font-semibold mb-2">Forgot your password?</h1>
        <p className="text-sm opacity-80 mb-4">Enter your email and we’ll send a recovery link.</p>

        {sent ? (
          <>
            <div className="rounded border border-white/10 bg-black/40 p-3 text-sm">
              Recovery email sent to <span className="font-semibold">{email}</span>.
            </div>
            <Link href="/signin" className="inline-block mt-4 underline opacity-90">
              Back to sign in
            </Link>
          </>
        ) : (
          <form onSubmit={onSubmit}>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-white/20 bg-transparent px-3 py-2 mb-3"
              placeholder="you@example.com"
            />
            {err && <p className="text-red-400 text-sm mb-3">{err}</p>}
            <button className="w-full rounded bg-white text-black py-2">Send recovery email</button>
            <div className="mt-3 text-center">
              <Link href="/signin" className="underline opacity-80 text-sm">
                Back to sign in
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}

