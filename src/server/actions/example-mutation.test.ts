import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

import { auth } from "@/auth";
import { exampleProtectedMutation } from "./example-mutation";

describe("exampleProtectedMutation", () => {
  beforeEach(() => {
    vi.mocked(auth).mockReset();
  });

  it("oturumsuz çağrıda 401 döner", async () => {
    vi.mocked(auth).mockResolvedValue(null as never);
    const result = await exampleProtectedMutation();
    expect(result).toEqual({ ok: false, status: 401 });
  });

  it("admin oturumunda ok=true", async () => {
    vi.mocked(auth).mockResolvedValue({
      user: { id: "1", email: "a@b.com", role: "OWNER" },
      expires: new Date(Date.now() + 10_000).toISOString(),
    } as never);
    await expect(exampleProtectedMutation()).resolves.toEqual({ ok: true });
  });
});
