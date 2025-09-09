// app/reset-password/page.tsx
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { AuthChangeEvent, User } from "@supabase/supabase-js";

export default function ResetPasswordPage() {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const router = useRouter();

  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Either PASSWORD_RECOVERY or a live cookie session from callback makes us "ready"
    const { data: sub } = supabase.auth.onAuthStateChange((evt: AuthChangeEvent) => {
      if (!mounted) return;
      if (evt === "PASSWORD_RECOVERY") setReady(true);
    });

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      if (!mounted) return;
      if (data.user) setReady(true);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setErr(null);
    setOk(false);

    if (pwd.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    if (pwd !== confirm) {
      setErr("Passwords do not match.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) {
      setErr(error.message ?? "Unable to update password.");
      return;
    }

    setOk(true);
    setPwd("");
    setConfirm("");
    setTimeout(() => router.push("/?reset=success"), 1000);
  }

  return (
    <main className="min-h-[70vh] grid place-items-center p-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-lg border border-white/10 bg-black/30 p-6"
      >
        <h1 className="text-2xl font-semibold mb-1">Reset your password</h1>
        <p className="text-sm opacity-80 mb-4">
          {ready ? "Enter a new password for your account." : "Verifying your recovery link…"}
        </p>

        <label className="block text-sm mb-1">New password</label>
        <input
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2 mb-3"
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          minLength={6}
          required
          disabled={!ready}
        />

        <label className="block text-sm mb-1">Confirm password</label>
        <input
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2 mb-4"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          minLength={6}
          required
          disabled={!ready}
        />

        {err && <p className="text-red-400 text-sm mb-3">{err}</p>}
        {ok && <p className="text-green-400 text-sm mb-3">Password updated ✔</p>}

        <button
          disabled={!ready || !pwd || pwd.length < 6 || pwd !== confirm}
          className="w-full rounded bg-white text-black py-2 disabled:opacity-50"
        >
          Update password
        </button>
      </form>
    </main>
  );
}




