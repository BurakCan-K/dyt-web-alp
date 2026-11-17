"use server";

import { AuthError } from "next-auth";
import { z } from "zod";
import { signIn, signOut } from "@/auth";
import { GENERIC_LOGIN_ERROR } from "@/lib/auth/errors";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { requireAdmin } from "@/lib/auth/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string };

export async function loginAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, error: GENERIC_LOGIN_ERROR };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.trim().toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/admin",
    });
    return { ok: true };
  } catch (err) {
    if (err instanceof AuthError) {
      return { ok: false, error: GENERIC_LOGIN_ERROR };
    }
    // Next.js redirect throw — başarılı giriş
    throw err;
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/giris" });
}

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(12).max(200),
  confirmPassword: z.string().min(12).max(200),
});

export async function changePasswordAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const session = await requireAdmin();

  const parsed = passwordChangeSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      ok: false,
      error: "Yeni şifre en az 12 karakter olmalı ve alanlar dolu olmalıdır.",
    };
  }

  if (parsed.data.newPassword !== parsed.data.confirmPassword) {
    return { ok: false, error: "Yeni şifreler eşleşmiyor." };
  }

  const { prisma } = await import("@/lib/db");
  const admin = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
  });

  if (!admin) {
    return { ok: false, error: "Hesap bulunamadı." };
  }

  const valid = await verifyPassword(
    parsed.data.currentPassword,
    admin.passwordHash,
  );
  if (!valid) {
    return { ok: false, error: "Mevcut şifre hatalı." };
  }

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  });

  return { ok: true };
}
