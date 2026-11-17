import { auth } from "@/auth";
import { AuthAccessError } from "@/lib/auth/errors";

export async function getAdminSession() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "OWNER") {
    return null;
  }
  return session;
}

/**
 * Tüm yazma Server Action / API yollarında çağrılmalı.
 * Yalnızca UI gizleme güvenlik değildir.
 */
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) {
    throw new AuthAccessError("Oturum gerekli", 401);
  }
  return session;
}

export function assertIsAuthAccessError(
  err: unknown,
): err is AuthAccessError {
  return err instanceof AuthAccessError;
}
