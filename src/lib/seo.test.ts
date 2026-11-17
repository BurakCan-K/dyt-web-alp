import { describe, expect, it } from "vitest";
import { SITE_DEFAULTS } from "@/data/site-defaults";
import {
  absoluteUrl,
  buildMetadata,
  formatPageTitle,
  getSiteUrl,
} from "./seo";
import { articleJsonLd, recipeJsonLd } from "./seo/json-ld";

describe("seo helpers", () => {
  it("canonical ve noindex üretir", () => {
    const meta = buildMetadata({
      title: "Test",
      description: "Açıklama",
      path: "/blog/ornek",
    });
    expect(meta.alternates?.canonical).toBe(`${getSiteUrl()}/blog/ornek`);
    expect(meta.title).toBe(`Test | ${SITE_DEFAULTS.brandName}`);
    expect(meta.openGraph?.siteName).toBe(SITE_DEFAULTS.brandName);
    expect(meta.robots).toEqual({ index: true, follow: true });

    const hidden = buildMetadata({
      title: "Admin",
      noIndex: true,
      absoluteTitle: true,
    });
    expect(hidden.robots).toEqual({ index: false, follow: false });
  });

  it("formatPageTitle markayı bir kez ekler", () => {
    expect(formatPageTitle("Blog", "Klinik")).toBe("Blog | Klinik");
    expect(formatPageTitle("Blog | Klinik", "Klinik")).toBe("Blog | Klinik");
  });

  it("absoluteUrl birleştirir", () => {
    expect(absoluteUrl("/tarifler")).toBe(`${getSiteUrl()}/tarifler`);
  });

  it("Article JSON-LD gerçek alanlardan üretilir", () => {
    const ld = articleJsonLd({
      title: "Başlık",
      description: "Özet",
      path: "/blog/x",
      publishedAt: "2026-01-01",
    });
    expect(ld["@type"]).toBe("Article");
    expect(ld.headline).toBe("Başlık");
    expect(ld.mainEntityOfPage).toContain("/blog/x");
  });

  it("Recipe JSON-LD malzemeleri yansıtır", () => {
    const ld = recipeJsonLd({
      title: "Tarif",
      description: "Özet",
      path: "/tarifler/y",
      prepMinutes: 5,
      cookMinutes: 10,
      servingCount: 2,
      ingredients: [{ name: "Un", quantity: 100, unit: "g" }],
      steps: ["Karıştır"],
    });
    expect(ld["@type"]).toBe("Recipe");
    expect(ld.recipeIngredient?.[0]).toContain("Un");
    expect(ld.recipeInstructions).toHaveLength(1);
  });
});
