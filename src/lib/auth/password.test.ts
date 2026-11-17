import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";

describe("password", () => {
  it("hash üretir ve doğrular", async () => {
    const hash = await hashPassword("GucluSifre-12345");
    expect(hash).not.toContain("GucluSifre");
    expect(await verifyPassword("GucluSifre-12345", hash)).toBe(true);
    expect(await verifyPassword("yanlis", hash)).toBe(false);
  });

  it("kısa şifreyi reddeder", async () => {
    await expect(hashPassword("kisa")).rejects.toThrow();
  });
});
