import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const isDev = process.env.NODE_ENV !== "production";

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Production: large pool to handle high concurrency (1,200+ DAU)
    // Development: small pool — fresh client per module load, avoid connection exhaustion
    max: isDev ? 3 : 30,
    min: isDev ? 1 : 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: isDev ? ["error", "warn"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

declare global {
  var prisma: PrismaClientSingleton | undefined;
}

// Production: reuse the singleton across serverless invocations (warm pool).
// Development: always create a fresh client — Next.js hot-reload can leave a
// stale Prisma instance in globalThis that was generated before schema changes
// (e.g. before the Banner model was added), causing model queries to silently
// fail. A fresh client per module load is safe for a single-user dev server.
const prisma = isDev
  ? prismaClientSingleton()
  : (globalThis.prisma ?? prismaClientSingleton());

export default prisma;

if (!isDev) {
  globalThis.prisma = prisma;
}
