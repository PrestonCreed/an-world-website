// app/admin/page.tsx
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser, userHasRole } from "@/lib/get-current-user";
import { isIpAllowed } from "@/lib/ip-allowlist";

// Force this route to be dynamic (no static pre-render / "collect page data")
export const dynamic = "force-dynamic";
export const revalidate = 0; // ensure no ISR cache tries to reuse it

export default async function AdminPage() {
  const user = await getCurrentUser();

  // During real requests Vercel sets x-forwarded-for; on dev it may be null.
  const ipHeader = headers().get("x-forwarded-for") ?? null;
  const ipOk = isIpAllowed(ipHeader);

  const isAdmin = await userHasRole(user?.email, "admin");

  if (!user || !isAdmin || !ipOk) {
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


