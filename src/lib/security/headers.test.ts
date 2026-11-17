import { describe, expect, it } from "vitest";
import { SECURITY_HEADERS } from "./headers";

describe("SECURITY_HEADERS", () => {
  it("temel hardening başlıklarını içerir", () => {
    const map = Object.fromEntries(
      SECURITY_HEADERS.map((h) => [h.key, h.value]),
    );
    expect(map["X-Frame-Options"]).toBe("DENY");
    expect(map["X-Content-Type-Options"]).toBe("nosniff");
    expect(map["Referrer-Policy"]).toContain("strict-origin");
    expect(map["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(map["Content-Security-Policy"]).toContain("res.cloudinary.com");
  });
});
