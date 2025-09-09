// components/providers/SignupGateProvider.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { shouldGateOnNext, markPromptShown } from "@/lib/watch-gate";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";

declare global {
  interface Window {
    AWGate?: { register: (mediaId: string) => boolean };
  }
}

export default function SignupGateProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);
  const [authed, setAuthed] = useState(false);
  const [shouldGate, setShouldGate] = useState(false);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) => {
      if (!mounted) return;
      setAuthed(!!data.user);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(
      (_evt: AuthChangeEvent, session: Session | null) => {
        setAuthed(!!session?.user);
      }
    );
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
        if (gate) markPromptShown();
        setShouldGate(gate);
        return gate;
      },
    };
    return () => {
      if (window.AWGate) delete window.AWGate;
    };
  }, [authed]);

  return <>{children}</>;
}


