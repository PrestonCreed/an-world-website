// app/(auth)/signin/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

type Mode = "signup" | "signin";

export default function SignInPage() {
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get("returnTo") || "/";

  const [mode, setMode] = useState<Mode>("signup");

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to AN World</h1>

      <div className="mb-6 flex gap-4">
        <button
          className={`px-3 py-2 rounded ${mode === "signup" ? "bg-black text-white" : "bg-gray-100"}`}
          onClick={() => setMode("signup")}
        >
          Sign up
        </button>
        <button
          className={`px-3 py-2 rounded ${mode === "signin" ? "bg-black text-white" : "bg-gray-100"}`}
          onClick={() => setMode("signin")}
        >
          Sign in
        </button>
      </div>

      {mode === "signup" ? (
        <SignUpCard onSuccess={() => router.push(`/onboarding?returnTo=${encodeURIComponent(returnTo)}`)} />
      ) : (
        <SignInCard returnTo={returnTo} />
      )}

      <div className="mt-8">
        <button
          className="w-full rounded bg-red-600 text-white py-2 mb-2"
          onClick={() => signIn("google", { callbackUrl: returnTo })}
        >
          Continue with Google
        </button>
        <button
          className="w-full rounded bg-gray-900 text-white py-2"
          onClick={() => signIn("email", { callbackUrl: returnTo })}
        >
          Email me a magic link
        </button>
      </div>
    </main>
  );
}

function SignUpCard({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newsletter, setNewsletter] = useState(true);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setErr(null);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ email, username, password, newsletter }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      // auto sign-in after sign-up
      await signIn("credentials", { identifier: email || username, password, redirect: false });
      onSuccess();
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j?.reason || "Sign up failed");
    }
    setBusy(false);
  }

  return (
    <div className="border rounded p-4">
      <label className="block text-sm font-medium mb-1">Email</label>
      <input className="w-full border rounded px-3 py-2 mb-3" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@domain.com" />

      <label className="block text-sm font-medium mb-1">Create username</label>
      <input className="w-full border rounded px-3 py-2 mb-3" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />

      <label className="block text-sm font-medium mb-1">Create password</label>
      <input className="w-full border rounded px-3 py-2 mb-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

      <label className="inline-flex items-center gap-2 mb-3">
        <input type="checkbox" checked={newsletter} onChange={(e) => setNewsletter(e.target.checked)} />
        <span>Sign up for the newsletter</span>
      </label>

      {err && <p className="text-sm text-red-600 mb-3">{err}</p>}

      <button className="w-full rounded bg-black text-white py-2 disabled:opacity-50" onClick={submit} disabled={busy || !email || !username || !password}>
        {busy ? "Creating account..." : "Create account"}
      </button>
    </div>
  );
}

function SignInCard({ returnTo }: { returnTo: string }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setErr(null);
    const res = await signIn("credentials", { identifier, password, callbackUrl: returnTo, redirect: false });
    if (res?.error) setErr("Invalid credentials"); else window.location.assign(returnTo);
    setBusy(false);
  }

  return (
    <div className="border rounded p-4">
      <label className="block text-sm font-medium mb-1">Email or Username</label>
      <input className="w-full border rounded px-3 py-2 mb-3" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="you@domain.com or username" />

      <label className="block text-sm font-medium mb-1">Password</label>
      <input className="w-full border rounded px-3 py-2 mb-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />

      {err && <p className="text-sm text-red-600 mb-3">{err}</p>}

      <button className="w-full rounded bg-black text-white py-2 disabled:opacity-50" onClick={submit} disabled={busy || !identifier || !password}>
        {busy ? "Signing in..." : "Sign in"}
      </button>
    </div>
  );
}
