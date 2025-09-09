// lib/supabase/client.ts
"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Build-safe browser client factory.
 * If NEXT_PUBLIC_* envs are missing (e.g., misconfigured), we return a stub so
 * client components don’t crash during hydration. Real calls will simply behave
 * as if there is no session.
 */
type SupabaseBrowser = ReturnType<typeof createBrowserClient>;

const browserStub: SupabaseBrowser = {
  
  auth: {
    async getUser() {
      return { data: { user: null }, error: null };
    },
    async getSession() {
      return { data: { session: null }, error: null };
    },
  },
} as unknown as SupabaseBrowser;

export function createSupabaseBrowserClient(): SupabaseBrowser {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  if (!url || !anon) return browserStub;
  return createBrowserClient(url, anon);
}

