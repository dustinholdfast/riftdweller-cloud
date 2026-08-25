import { PrismaPg } from "@prisma/adapter-pg";
import type { Pool, PoolConfig } from "pg";

import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export function createPrismaClient(poolOrConfig: Pool | PoolConfig | string) {
  return new PrismaClient({ adapter: new PrismaPg(poolOrConfig) });
}

function databaseConfig(): PoolConfig {
  // pg.Pool connects lazily, so this placeholder only matters if a route
  // actually queries the database without DATABASE_URL set (e.g. Next.js
  // build-time page data collection, which imports this module but never
  // queries it). Real environments must set DATABASE_URL to the Supabase
  // transaction-pooler URL.
  const connectionString =
    process.env.DATABASE_URL ?? "postgresql://prisma:prisma@localhost:5432/riftdweller";

  return {
    connectionString,
    // Keep each serverless instance's local pool deliberately small. Supavisor
    // performs the cross-instance pooling for the deployed application.
    // Start with one connection per Vercel function instance. Increase this
    // only after measuring contention against the Supavisor pool limits.
    max: 1,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 10_000,
  };
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient(databaseConfig());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
