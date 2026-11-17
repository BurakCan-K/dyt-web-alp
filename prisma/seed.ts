/**
 * Prisma CLI seed — `npm run db:seed`
 * AdminUser oluşturulmaz.
 */
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { runLaunchSeed } from "../src/server/bootstrap/launch-seed";

async function main() {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST ?? "127.0.0.1",
    port: Number(process.env.DATABASE_PORT ?? "3306"),
    user: process.env.DATABASE_USER ?? "root",
    password: process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME ?? "dyt_web_dev",
    connectionLimit: 5,
  });
  const prisma = new PrismaClient({ adapter });
  try {
    const result = await runLaunchSeed(prisma);
    console.log("Seed tamam:", result);
    console.log("AdminUser oluşturulmadı — admin:create kullanın.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
