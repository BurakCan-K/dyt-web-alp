/**
 * Güvenli admin provisioning — demo parola yok.
 *
 * Kullanım:
 *   ADMIN_EMAIL=admin@ornek.com ADMIN_PASSWORD='...' npm run admin:create
 *
 * Şifre en az 12 karakter. Mevcut e-posta varsa passwordHash güncellenir.
 */
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashPassword } from "../src/lib/auth/password";

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("ADMIN_EMAIL ve ADMIN_PASSWORD zorunlu.");
    process.exit(1);
  }

  if (password.length < 12) {
    console.error("ADMIN_PASSWORD en az 12 karakter olmalı.");
    process.exit(1);
  }

  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST ?? "127.0.0.1",
    port: Number(process.env.DATABASE_PORT ?? "3306"),
    user: process.env.DATABASE_USER ?? "",
    password: process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME ?? "",
    connectionLimit: 5,
  });

  const prisma = new PrismaClient({ adapter });
  const passwordHash = await hashPassword(password);

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    await prisma.adminUser.update({
      where: { email },
      data: { passwordHash, role: "OWNER" },
    });
    console.log(`Admin güncellendi: ${email}`);
  } else {
    await prisma.adminUser.create({
      data: { email, passwordHash, role: "OWNER" },
    });
    console.log(`Admin oluşturuldu: ${email}`);
  }

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
