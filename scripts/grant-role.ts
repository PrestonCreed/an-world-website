// scripts/grant-role.ts
/**
 * Usage:
 *   npx tsx scripts/grant-role.ts user@example.com admin
 */
import { prisma } from "../lib/prisma";

async function main() {
  const [identifier, roleName] = process.argv.slice(2);
  if (!identifier || !roleName) {
    console.error("Usage: tsx scripts/grant-role.ts <email-or-id> <roleName>");
    process.exit(1);
  }

  const user =
    (await prisma.user.findUnique({ where: { id: identifier } })) ||
    (await prisma.user.findUnique({ where: { email: identifier } }));

  if (!user) {
    console.error("User not found");
    process.exit(1);
  }

  const role = await prisma.role.upsert({
    where: { name: roleName },
    update: {},
    create: { name: roleName },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    update: {},
    create: { userId: user.id, roleId: role.id },
  });

  console.log(`Granted role '${roleName}' to user ${user.email ?? user.id}`);
}

main().finally(async () => {
  await prisma.$disconnect();
});
