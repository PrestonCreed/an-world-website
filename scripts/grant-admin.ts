// scripts/grant-admin.ts
/**
 * Usage:
 *   npx tsx scripts/grant-admin.ts you@example.com            # grant admin to you
 *   npx tsx scripts/grant-admin.ts you@example.com --exclusive # grant to you, remove from others
 */
import { prisma } from "../lib/prisma";

async function ensureRole(name: string) {
  return prisma.role.upsert({
    where: { name },
    update: {},
    create: { name, description: `${name} role` },
  });
}

async function main() {
  const [email, flag] = process.argv.slice(2);
  if (!email) {
    console.error("Usage: tsx scripts/grant-admin.ts <email> [--exclusive]");
    process.exit(1);
  }
  const exclusive = flag === "--exclusive";

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    console.error(
      `User with email ${email} not found. Sign in once (Google or Email) to create the user, then rerun.`
    );
    process.exit(1);
  }

  const admin = await ensureRole("admin");

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: admin.id } },
    update: {},
    create: { userId: user.id, roleId: admin.id },
  });

  if (exclusive) {
    await prisma.userRole.deleteMany({
      where: { roleId: admin.id, NOT: { userId: user.id } },
    });
  }

  console.log(
    `Granted 'admin' to ${email}${exclusive ? " (removed from all others)" : ""}.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
