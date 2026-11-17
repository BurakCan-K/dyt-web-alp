import { describe, expect, it } from "vitest";
import { serviceUpsertSchema, slugSchema } from "./content";

describe("slugSchema", () => {
  it("geçerli slug kabul eder", () => {
    expect(slugSchema.parse("surdurulebilir-kilo")).toBe("surdurulebilir-kilo");
  });

  it("büyük harfi reddeder", () => {
    expect(() => slugSchema.parse("Kilo")).toThrow();
  });
});

describe("serviceUpsertSchema", () => {
  it("minimal geçerli hizmeti parse eder", () => {
    const parsed = serviceUpsertSchema.parse({
      slug: "ornek-hizmet",
      title: "Örnek",
      summary: "Özet metin",
      descriptionJson: { paragraphs: [] },
    });
    expect(parsed.status).toBe("DRAFT");
  });
});
