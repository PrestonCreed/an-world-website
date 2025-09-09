// app/(auth)/onboarding/page.tsx
"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export const dynamic = "force-dynamic";

const OPTIONS = [
  { key: "watching", label: "Watching live streams / shows" },
  { key: "live", label: "Streaming live" },
  { key: "creating", label: "Creating entertainment" },
  { key: "learning", label: "I want to learn and explore" },
] as const;

// Inner component uses useSearchParams; it must live under a Suspense boundary
function OnboardingInner() {
  const [sel, setSel] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get("returnTo") || "/";

  function toggle(k: string) {
    setSel((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  }

  async function submit() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/auth/user/onboarding", {
        method: "POST",
        body: JSON.stringify({ choices: sel }),
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });

      if (!res.ok) {
        // 401 when not signed in; other 4xx/5xx bubble a friendly message
        if (res.status === 401) {
          setErr("Please sign in to continue.");
          router.push(`/signin?returnTo=${encodeURIComponent(window.location.pathname)}`);
          return;
        }
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.error || `Request failed (${res.status})`);
      }

      router.push(returnTo);
    } catch (e: any) {
      setErr(e?.message || "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold mb-4">Tell us what you’ll use AN World for</h1>

      <div className="space-y-2 mb-6">
        {OPTIONS.map((o) => (
          <label key={o.key} className="flex items-center gap-3 border rounded p-3 cursor-pointer">
            <input type="checkbox" checked={sel.includes(o.key)} onChange={() => toggle(o.key)} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>

      {err && <p className="mb-3 text-sm text-red-400">{err}</p>}

      <button
        className="w-full rounded bg-black text-white py-2 disabled:opacity-50"
        onClick={submit}
        disabled={busy || sel.length === 0}
      >
        {busy ? "Saving..." : "Continue"}
      </button>
    </main>
  );
}

// Thin wrapper to satisfy Next's requirement for a Suspense boundary
export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingInner />
    </Suspense>
  );
}



