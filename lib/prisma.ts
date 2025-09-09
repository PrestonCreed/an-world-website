// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

/**
 * Lazy Prisma client so importing this module during build
 * doesn't attempt to read DATABASE_URL or load the engine.
 * Use: const prisma = getPrisma();
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      // log: ["warn", "error"], // enable if you want minimal logging
    });
  }
  return globalForPrisma.prisma;
}



