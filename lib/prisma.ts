import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ✅ CONNECTION POOL OPTIMIZATION (PHASE 1 FIX)
    // Increased from default 10 to 30 to handle 1,200+ DAU
    // Previously bottlenecked at 150+ concurrent users
    max: 30,
    min: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

declare global {
  var prisma: PrismaClientSingleton | undefined;
}

// In development, bust the globalThis cache if the Banner model is missing
// (happens when the dev server runs with a pre-Banner Prisma client singleton)
if (
  process.env.NODE_ENV !== "production" &&
  globalThis.prisma &&
  !(globalThis.prisma as any)["banner"]
) {
  console.warn("[prisma] Stale singleton detected (missing models). Reinitialising...");
  globalThis.prisma = undefined;
}

const prisma = globalThis.prisma ?? prismaClientSingleton();

export default prisma;

// Cache in development to avoid spawning a new pool on every hot-reload
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
