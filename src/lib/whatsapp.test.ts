import { describe, expect, it } from "vitest";
import { buildWhatsAppLink } from "./whatsapp";

describe("buildWhatsAppLink", () => {
  it("geçersiz numarada ready=false döner", () => {
    const result = buildWhatsAppLink(null);
    expect(result.ready).toBe(false);
  });

  it("E.164 rakamlarından wa.me üretir", () => {
    const result = buildWhatsAppLink("+90 555 111 2233", "Merhaba");
    expect(result.ready).toBe(true);
    if (result.ready) {
      expect(result.href).toContain("https://wa.me/905551112233");
      expect(result.href).toContain("text=Merhaba");
    }
  });
});
