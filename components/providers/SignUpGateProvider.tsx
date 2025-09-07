// components/providers/SignupGateProvider.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { shouldGateOnNext, markPromptShown } from "@/lib/watch-gate";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

declare global {
  interface Window {
    AWGate?: { register: (mediaId: string) => boolean };
  }
}

export default function SignupGateProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [authed, setAuthed] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setAuthed(!!data.user);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setAuthed(!!session?.user);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    // Global hook your video player can call to decide whether to prompt signup
    window.AWGate = {
      register: (mediaId: string) => {
        const gate = !authed && shouldGateOnNext(mediaId);
        setShow(gate);
        if (gate) markPromptShown();
        return gate;
      },
    };
  }, [authed]);

  return (
    <>
      {children}
      {show && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/70 backdrop-blur-sm">
          <div className="w-[520px] max-w-[92vw] rounded-xl border border-white/15 bg-black/70 p-6">
            <h3 className="text-xl font-semibold mb-2">Join Anything World</h3>
            <p className="opacity-80 mb-4">Create a free account to keep watching and unlock more features.</p>
            <div className="flex gap-3">
              <a href="/signin" className="flex-1 rounded bg-white text-black py-2 text-center">Sign up / Sign in</a>
              <button className="flex-1 rounded border py-2" onClick={() => setShow(false)}>
                Not now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

