"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const disabled = !pwd || pwd.length < 6 || pwd !== confirm;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    if (error) return setErr(error.message);
    setOk(true);
    setTimeout(() => router.push("/?reset=success"), 1200);
  }

  return (
    <main className="min-h-[70vh] grid place-items-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-lg border border-white/10 bg-black/20 p-6">
        <h1 className="text-lg font-semibold mb-4">Set a new password</h1>
        <label className="block text-sm mb-1">New password</label>
        <input
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2 mb-3"
          type="password"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
          minLength={6}
          required
        />
        <label className="block text-sm mb-1">Confirm password</label>
        <input
          className="w-full rounded border border-white/20 bg-transparent px-3 py-2 mb-4"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          minLength={6}
          required
        />
        {err && <p className="text-red-400 text-sm mb-3">{err}</p>}
        {ok && <p className="text-green-400 text-sm mb-3">Password updated ✔</p>}
        <button disabled={disabled} className="w-full rounded bg-white text-black py-2 disabled:opacity-50">
          Update password
        </button>
      </form>
    </main>
  );
}
