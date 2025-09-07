// app/(auth)/onboarding/page.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const OPTIONS = [
  { key: "watching", label: "Watching live streams / shows" },
  { key: "live", label: "Streaming live" },
  { key: "creating", label: "Creating entertainment" },
  { key: "learning", label: "I want to learn and explore" },
] as const;

export default function OnboardingPage() {
  const [sel, setSel] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const returnTo = params.get("returnTo") || "/";

  function toggle(k: string) {
    setSel((cur) => (cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k]));
  }

  async function submit() {
    setBusy(true);
    await fetch("/api/user/onboarding", {
      method: "POST",
      body: JSON.stringify({ choices: sel }),
      headers: { "Content-Type": "application/json" },
    });
    router.push(returnTo);
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
      <button className="w-full rounded bg-black text-white py-2 disabled:opacity-50" onClick={submit} disabled={busy || sel.length === 0}>
        Continue
      </button>
    </main>
  );
}
