import bcrypt from "bcryptjs";

const ROUNDS = 12;

export async function hashPassword(plain: string): Promise<string> {
  if (plain.length < 12) {
    throw new Error("Şifre en az 12 karakter olmalıdır");
  }
  return bcrypt.hash(plain, ROUNDS);
}

export async function verifyPassword(
  plain: string,
  passwordHash: string,
): Promise<boolean> {
  if (!plain || !passwordHash) return false;
  return bcrypt.compare(plain, passwordHash);
}
