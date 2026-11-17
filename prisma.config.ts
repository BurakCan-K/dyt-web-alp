import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/**
 * Prisma 7 CLI yapılandırması (migrate / generate).
 * Runtime bağlantısı `src/lib/db` içinde adapter ile yapılır.
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node ./node_modules/tsx/dist/cli.mjs prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
