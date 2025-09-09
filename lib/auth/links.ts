// lib/auth/links.ts
import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000";

/** Safely pull an action link out of generateLink()’s data across supabase-js versions */
function pickActionLink(data: unknown): string | undefined {
  const d = data as any;
  // Common shapes seen across versions:
  // - { properties: { action_link: string, ... }, ... }
  // - { action_link: string, ... }
  // - occasionally nested under different keys when using different types
  return (
    d?.properties?.action_link ??
    d?.action_link ??
    d?.emailActionLink ??
    d?.properties?.email_action_link
  );
}

export async function generateEmailConfirmationLink(
  email: string,
  password: string,
  redirect?: string
) {
  const supabase = createSupabaseAdminClient();
  const redirectTo = redirect ?? `${SITE_URL}/api/auth/callback`;

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "signup",
    email,
    password,
    options: { redirectTo },
  });
  if (error) throw error;

  const action = pickActionLink(data);
  return action ?? redirectTo;
}

export async function generatePasswordResetLink(
  email: string,
  redirect?: string
) {
  const supabase = createSupabaseAdminClient();
  const redirectTo =
    redirect ??
    `${SITE_URL}/api/auth/callback?type=recovery&redirect=/reset-password`;

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });
  if (error) throw error;

  const action = pickActionLink(data);
  return action ?? redirectTo;
}

