// lib/supabase/server.ts
import { cookies } from "next/headers";
import type { CookieOptions } from "@supabase/ssr";
import { createServerClient } from "@supabase/ssr";

/**
 * Build-safe server client factory.
 * - Does NOT throw at import time (we read envs only when called).
 * - If envs are missing during build, returns a harmless stub
 *   whose auth.getUser() returns { user: null } so pages/routes won’t explode.
 */
type SupabaseServer = ReturnType<typeof createServerClient>;

function makeCookieAdapter() {
  const store = cookies();
  const adapter: {
    get: (name: string) => string | undefined;
    set: (name: string, value: string, options?: CookieOptions) => void;
    remove: (name: string, options?: CookieOptions) => void;
  } = {
    get(name) {
      return store.get(name)?.value;
    },
    set(name, value, options) {
      // next/headers cookies API is mutable on the server
      store.set(name, value, options);
    },
    remove(name, options) {
      store.set(name, "", { ...options, maxAge: 0 });
    },
  };
  return adapter;
}

// Minimal “no-op” stub so build can proceed even if envs missing.
const supabaseStub: SupabaseServer = {
  
  auth: {
    async getUser() {
      return { data: { user: null }, error: null };
    },
    async getSession() {
      return { data: { session: null }, error: null };
    },
  },
} as unknown as SupabaseServer;

export function createSupabaseServerClient(): SupabaseServer {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If envs are not present at call time (e.g., during build/prerender),
  // return a safe stub that never throws.
  if (!url || !anon) return supabaseStub;

  return createServerClient(url, anon, {
    cookies: makeCookieAdapter(),
  });
}

