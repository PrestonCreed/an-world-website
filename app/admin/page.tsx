// app/admin/page.tsx
import { getCurrentUser, hasRole } from "@/lib/get-current-user";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { isIpAllowed } from "@/lib/ip-allowlist";

export default async function AdminPage() {
  const user = await getCurrentUser();
  const ipHeader = headers().get("x-forwarded-for") ?? null;

  // If ADMIN_IP_WHITELIST is set, request IP must match (for “my computer only”).
  const ipOk = isIpAllowed(ipHeader);

  if (!user || !hasRole(user, "admin") || !ipOk) {
    redirect("/signin");
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="mt-2">Signed in as {user.email}.</p>
      <p className="text-sm text-gray-500 mt-2">
        IP: {ipHeader ?? "unknown"} {ipOk ? "(allowed)" : "(blocked)"}
      </p>
    </main>
  );
}
