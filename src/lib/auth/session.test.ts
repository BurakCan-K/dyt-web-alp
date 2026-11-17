import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

import { auth } from "@/auth";
import { AuthAccessError } from "@/lib/auth/errors";
import { getAdminSession, requireAdmin } from "@/lib/auth/session";

describe("requireAdmin", () => {
  beforeEach(() => {
    vi.mocked(auth).mockReset();
  });

  it("oturum yoksa 401 fırlatır", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);
    await expect(requireAdmin()).rejects.toBeInstanceOf(AuthAccessError);
    await expect(getAdminSession()).resolves.toBeNull();
  });

  it("OWNER oturumunu döner", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", email: "a@b.com", role: "OWNER" },
      expires: new Date(Date.now() + 10_000).toISOString(),
    } as never);

    const session = await requireAdmin();
    expect(session.user.id).toBe("1");
  });
});
