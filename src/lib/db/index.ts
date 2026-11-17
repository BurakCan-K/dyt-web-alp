import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const host = process.env.DATABASE_HOST ?? "127.0.0.1";
  const port = Number(process.env.DATABASE_PORT ?? "3306");
  const user = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD;
  const database = process.env.DATABASE_NAME;

  if (!user || !database) {
    throw new Error(
      "DATABASE_USER ve DATABASE_NAME tanımlı değil. .env.example dosyasına bakın.",
    );
  }

  // MySQL yokken her sayfada 10s+ beklemesin diye kısa timeout
  const adapter = new PrismaMariaDb({
    host,
    port,
    user,
    password: password ?? "",
    database,
    connectionLimit: 5,
    connectTimeout: 1500,
    acquireTimeout: 1500,
  });

  return new PrismaClient({ adapter });
}

function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Server-only Prisma singleton (lazy).
 * Client bundle'a import etmeyin.
 */
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export type { PrismaClient };
export {
  withDbFallback,
  isDbInCooldown,
  markDbFailure,
  clearDbFailure,
} from "./availability";
