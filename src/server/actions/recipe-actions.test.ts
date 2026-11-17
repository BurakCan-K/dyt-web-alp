import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/server/repositories/recipe-repository", () => ({
  upsertRecipe: vi.fn(),
  softDeleteRecipe: vi.fn(),
  updateRecipeStatus: vi.fn(),
  ensureRecipeCategory: vi.fn(),
}));

vi.mock("@/server/audit", () => ({
  writeAuditLog: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { auth } from "@/auth";
import { setRecipeStatusResult } from "./recipe-actions";

describe("setRecipeStatusResult auth", () => {
  beforeEach(() => {
    vi.mocked(auth).mockReset();
  });

  it("oturumsuz çağrıda hata döner", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);
    const fd = new FormData();
    fd.set("id", "1");
    fd.set("status", "PUBLISHED");
    const result = await setRecipeStatusResult(fd);
    expect(result.ok).toBe(false);
  });
});
