// prisma/seed.ts
/* eslint-disable no-console */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Notes:
 * - ADMIN_EMAIL: set this in your .env if you want to auto-assign admin
 * - This seed is idempotent (safe to re-run).
 * - It assumes your schema has:
 *   Role(name unique), Permission(name unique), RolePermission(roleId+permissionId unique),
 *   User(email unique), UserRole(userId+roleId unique),
 *   Profile(userId unique), Onboarding(userId unique)
 */

async function ensureRoles() {
  const roles = ['viewer', 'creator', 'moderator', 'admin'] as const;
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` },
    });
  }
  console.log('✓ Seeded roles:', roles.join(', '));
}

async function ensureAdminPermissions() {
  // Create a wildcard permission and link it to the admin role
  const perm = await prisma.permission.upsert({
    where: { name: '*' },
    update: {},
    create: { name: '*', description: 'Wildcard: full access' },
  });

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  if (!adminRole) throw new Error('admin role missing');

  await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId: adminRole.id, permissionId: perm.id } },
    update: {},
    create: { roleId: adminRole.id, permissionId: perm.id },
  });

  console.log('✓ Linked "*" permission to admin role');
}

async function maybeCreateAdminUser() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmail) {
    console.log('ℹ No ADMIN_EMAIL in env; skipping admin user creation/assignment.');
    return;
  }

  // If your app normally creates users via Auth.js sign-in, you can either:
  // 1) Require the user to sign in once, then just promote them here, or
  // 2) Create a minimal user record here if none exists (uncomment the create block below).
  //
  // The safest default is to promote an existing user, because your User model
  // might have required fields enforced by your app logic.

  let user = await prisma.user.findUnique({ where: { email: adminEmail } });

  // Optionally create if not found (only if your schema allows minimal creation).
  if (!user) {
    // If your schema requires additional fields (e.g., username NOT NULL),
    // add them here. If username is required+unique, set a sensible default.
    // If user creation here is risky, comment this out and ask the admin to sign in first.
    user = await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin User',
        // username: 'admin', // uncomment if your schema requires it and it's unique
      },
    });
    console.log(`✓ Created admin user: ${adminEmail}`);
  } else {
    console.log(`✓ Found existing user: ${adminEmail}`);
  }

  const adminRole = await prisma.role.findUnique({ where: { name: 'admin' } });
  if (!adminRole) throw new Error('admin role missing');

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId: adminRole.id } },
    update: {},
    create: { userId: user.id, roleId: adminRole.id },
  });
  console.log(`✓ Assigned admin role to ${adminEmail}`);

  // OPTIONAL: Create Profile row if your schema enforces one-per-user in logic
  try {
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        // handle: 'admin', // uncomment if required & unique
        // add other defaults that fit your schema
      },
    });
    console.log('✓ Ensured Profile row for admin');
  } catch (e) {
    console.log('↷ Skipped Profile upsert (adjust fields if your schema requires them).');
  }

  // OPTIONAL: Create Onboarding row if your app expects it
  try {
    await prisma.onboarding.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        // add any default onboarding flags/steps here
      },
    });
    console.log('✓ Ensured Onboarding row for admin');
  } catch (e) {
    console.log('↷ Skipped Onboarding upsert (adjust fields if your schema requires them).');
  }
}

async function main() {
  await ensureRoles();
  await ensureAdminPermissions();
  await maybeCreateAdminUser();
  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
