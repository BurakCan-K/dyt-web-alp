import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("@/server/repositories/blog-repository", () => ({
  upsertBlogPost: vi.fn(),
  softDeleteBlogPost: vi.fn(),
  updateBlogPostStatus: vi.fn(),
  ensurePostCategory: vi.fn(),
}));

vi.mock("@/server/audit", () => ({
  writeAuditLog: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { auth } from "@/auth";
import { setBlogPostStatusResult } from "./blog-actions";

describe("setBlogPostStatusResult auth", () => {
  beforeEach(() => {
    vi.mocked(auth).mockReset();
  });

  it("oturumsuz çağrıda hata döner", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);
    const fd = new FormData();
    fd.set("id", "1");
    fd.set("status", "PUBLISHED");
    const result = await setBlogPostStatusResult(fd);
    expect(result.ok).toBe(false);
  });
});
