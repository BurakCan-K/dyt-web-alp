import { describe, expect, it } from "vitest";
import { filterPosts, paginate, scaleQuantity } from "./content-query";

describe("filterPosts", () => {
  it("draft yazıları dışlar", () => {
    const posts = filterPosts({});
    expect(posts.every((p) => p.status === "PUBLISHED")).toBe(true);
    expect(posts.find((p) => p.slug === "taslak-yazi")).toBeUndefined();
  });

  it("kategori filtreler", () => {
    const posts = filterPosts({ kategori: "yasam" });
    expect(posts.length).toBeGreaterThan(0);
    expect(posts.every((p) => p.categorySlug === "yasam")).toBe(true);
  });
});

describe("paginate", () => {
  it("sayfa boyutuna göre böler", () => {
    const result = paginate([1, 2, 3, 4, 5], 2, 2);
    expect(result.items).toEqual([3, 4]);
    expect(result.totalPages).toBe(3);
  });
});

describe("scaleQuantity", () => {
  it("2 porsiyon 150g → 3 porsiyon 225g", () => {
    expect(scaleQuantity(150, 2, 3)).toBe(225);
  });
});
