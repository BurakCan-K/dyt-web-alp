import { describe, expect, it } from "vitest";
import { slugify, uniqueSlug } from "./slug";

describe("slugify", () => {
  it("Türkçe karakterleri dönüştürür", () => {
    expect(slugify("Şişli Beslenme Öğünleri")).toBe("sisli-beslenme-ogunleri");
  });

  it("boş girdide güvenli fallback döner", () => {
    expect(slugify("   ")).toBe("icerik");
  });
});

describe("uniqueSlug", () => {
  it("çakışmada numara ekler", () => {
    expect(uniqueSlug("tarif", ["tarif", "tarif-2"])).toBe("tarif-3");
  });
});
