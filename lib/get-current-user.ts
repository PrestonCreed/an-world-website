// lib/get-current-user.ts
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { PrismaClient } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

/** Returns the Supabase user (or null). Safe to call in Server Components/Route Handlers. */
export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return null;
  return data.user ?? null;
}

/** Look up a role by the user's email in your Prisma RBAC tables. */
export async function userHasRole(email: string | null | undefined, roleName: string) {
  if (!email) return false;
  const prisma: PrismaClient = getPrisma();
  const hit = await prisma.userRole.findFirst({
    where: { user: { email }, role: { name: roleName } },
    select: { userId: true },
  });
  return !!hit;
}

