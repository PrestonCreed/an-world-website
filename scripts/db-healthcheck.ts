// scripts/db-healthcheck.ts
/* eslint-disable no-console */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

type Probe = {
  name: string;
  run: (client: PrismaClient) => Promise<void>;
};

function line(title: string) {
  console.log('\n' + '─'.repeat(10) + ' ' + title + ' ' + '─'.repeat(10));
}

async function runWith(clientName: string, client: PrismaClient, probes: Probe[]) {
  console.log(`\n\n==================== ${clientName.toUpperCase()} ====================`);
  for (const p of probes) {
    line(`${clientName}: ${p.name}`);
    try {
      const t0 = Date.now();
      await p.run(client);
      const dt = Date.now() - t0;
      console.log(`✅ OK (${dt}ms)`);
    } catch (err: any) {
      console.error(`❌ ${clientName} -> ${p.name} failed`);
      console.error('   Message:', err?.message || err);
      if (err?.code) console.error('   Code:', err.code);
      if (err?.clientVersion) console.error('   PrismaClientVersion:', err.clientVersion);
      if (/no pg_hba|TLS|ssl/i.test(err?.message || '')) {
        console.error('   Hint: Check sslmode=require for cloud; disable for local stack.');
      }
      if (/Tenant|user not found|does not exist/i.test(err?.message || '')) {
        console.error('   Hint: Pooler needs username like postgres.<project-ref> and port 6543.');
      }
    }
  }
}

const probes: Probe[] = [
  {
    name: 'Connection + identity',
    run: async (prisma) => {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `select
           current_user,
           current_database(),
           inet_server_addr()::text as host,
           inet_server_port() as port,
           version() as pg_version`
      );
      console.table(rows);
    },
  },
  {
    name: 'Schemas present',
    run: async (prisma) => {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `select nspname as schema
           from pg_namespace
          where nspname in ('public','auth')
          order by 1`
      );
      console.table(rows);
    },
  },
  {
    name: 'List a few public tables',
    run: async (prisma) => {
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `select table_name
           from information_schema.tables
          where table_schema='public'
          order by table_name
          limit 15`
      );
      console.table(rows);
    },
  },
  {
    // FIX: explicit ::uuid casts so Postgres doesn't complain about uuid=text
    name: 'CRUD round-trip in throwaway table (_healthcheck)',
    run: async (prisma) => {
      await prisma.$executeRawUnsafe(`
        create table if not exists public._healthcheck (
          id uuid primary key default gen_random_uuid(),
          note text,
          created_at timestamptz not null default now()
        )
      `);

      const inserted = await prisma.$queryRawUnsafe<any[]>(
        `insert into public._healthcheck (note)
         values ('ok from healthcheck')
         returning id, note, created_at`
      );
      console.table(inserted);

      const id = inserted?.[0]?.id as string | undefined;

      // Select with explicit cast
      const fetched = await prisma.$queryRawUnsafe<any[]>(
        `select * from public._healthcheck where id = CAST($1 AS uuid)`,
        id
      );
      console.table(fetched);

      // Delete with explicit cast
      await prisma.$executeRawUnsafe(
        `delete from public._healthcheck where id = CAST($1 AS uuid)`,
        id
      );
    },
  },
  {
    name: 'Prisma models (dynamic findMany take:0)',
    run: async (prisma) => {
      const modelNames = Object.keys(prisma).filter(
        (k) => !k.startsWith('$') && typeof (prisma as any)[k]?.findMany === 'function'
      );
      console.log('Detected models:', modelNames);
      for (const m of modelNames) {
        try {
          // @ts-ignore - dynamic access
          await (prisma as any)[m].findMany({ take: 0 });
          console.log(`  • ${m}: OK (reachable)`);
        } catch (err: any) {
          console.error(`  • ${m}: FAILED -> ${err?.message || err}`);
          if (/column .* does not exist/i.test(err?.message || '')) {
            console.error(`    Hint: Prisma model fields may not match the actual table columns.`);
          }
        }
      }
    },
  },
  {
    // FIX: case- and variant-aware NextAuth table presence check
    name: 'NextAuth tables present (optional)',
    run: async (prisma) => {
      // Fetch all public tables once, then normalize to lowercase
      const rows = await prisma.$queryRawUnsafe<any[]>(
        `select table_name
           from information_schema.tables
          where table_schema='public'`
      );
      const have = new Set<string>(rows.map((r) => String(r.table_name).toLowerCase()));

      // The three canonical tables; allow common variants for verification token
      const requiredSets: (string | string[])[] = [
        'account',
        'session',
        // Accept either verification_token (snake) or verificationtoken (camel collapsed), and also "verificationtoken" variants some adapters use
        ['verification_token', 'verificationtoken']
      ];

      const missing: string[] = [];
      for (const req of requiredSets) {
        if (Array.isArray(req)) {
          if (!req.some((name) => have.has(name))) {
            missing.push(req.join(' | '));
          }
        } else {
          if (!have.has(req)) {
            // Also try a PascalCase fallback match just in case user prefers exact names like "Account"
            const pascal = req.charAt(0).toUpperCase() + req.slice(1);
            if (!have.has(pascal.toLowerCase()) && !have.has(pascal)) {
              missing.push(req);
            }
          }
        }
      }

      // Display what we actually found that looks like NextAuth tables
      const present = ['account', 'session', 'verification_token', 'verificationtoken'].filter(
        (n) => have.has(n)
      );

      console.table(present.map((t) => ({ table_name: t })));

      if (missing.length) {
        console.warn('  ⚠ Missing NextAuth tables (by normalized check):', missing.join(', '));
        console.warn(
          '    Note: If your Prisma schema uses quoted PascalCase tables (e.g. "Account"), this warning may be cosmetic.'
        );
      }
    },
  },
];

(async () => {
  // Prisma instance for RUNTIME (DATABASE_URL)
  const prismaRuntime = new PrismaClient({
    // log: ['query', 'warn', 'error'],
  });

  // Prisma instance for DIRECT (DIRECT_URL), if provided
  const hasDirect = !!process.env.DIRECT_URL;
  const prismaDirect = hasDirect
    ? new PrismaClient({
        datasourceUrl: process.env.DIRECT_URL,
        // log: ['query', 'warn', 'error'],
      })
    : null;

  try {
    console.log('Using DATABASE_URL:', process.env.DATABASE_URL);
    await runWith('runtime (DATABASE_URL)', prismaRuntime, probes);
  } finally {
    await prismaRuntime.$disconnect().catch(() => {});
  }

  if (prismaDirect) {
    try {
      console.log('\nUsing DIRECT_URL:', process.env.DIRECT_URL);
      await runWith('direct (DIRECT_URL)', prismaDirect, probes);
    } finally {
      await prismaDirect.$disconnect().catch(() => {});
    }
  } else {
    console.log('\n(Skipping DIRECT_URL probes — env not set)');
  }

  console.log('\n✅ Healthcheck completed');
  process.exit(0);
})().catch((e) => {
  console.error('\n❌ Healthcheck script crashed:', e);
  process.exit(1);
});
