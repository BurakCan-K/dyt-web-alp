import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { GENERIC_LOGIN_ERROR } from "@/lib/auth/errors";
import { verifyPassword } from "@/lib/auth/password";
import { checkRateLimit } from "@/lib/auth/rate-limit";

const credentialsSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
});

async function findAdminByEmail(email: string) {
  const { prisma } = await import("@/lib/db");
  return prisma.adminUser.findUnique({ where: { email } });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 8,
  },
  pages: {
    signIn: "/admin/giris",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      authorize: async (raw) => {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) {
          throw new Error(GENERIC_LOGIN_ERROR);
        }

        const email = parsed.data.email.trim().toLowerCase();
        const rate = checkRateLimit(`login:${email}`, 5, 15 * 60 * 1000);
        if (!rate.allowed) {
          throw new Error(GENERIC_LOGIN_ERROR);
        }

        let admin;
        try {
          admin = await findAdminByEmail(email);
        } catch {
          // DB yok / bağlantı hatası — ayrıntı sızdırma
          throw new Error(GENERIC_LOGIN_ERROR);
        }

        if (!admin || admin.role !== "OWNER") {
          throw new Error(GENERIC_LOGIN_ERROR);
        }

        const ok = await verifyPassword(parsed.data.password, admin.passwordHash);
        if (!ok) {
          throw new Error(GENERIC_LOGIN_ERROR);
        }

        try {
          const { prisma } = await import("@/lib/db");
          await prisma.adminUser.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
          });
        } catch {
          /* lastLogin güncellenemese de oturum açılabilir */
        }

        return {
          id: admin.id,
          email: admin.email,
          role: "OWNER" as const,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? "OWNER";
      }
      return session;
    },
  },
});
