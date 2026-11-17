import { describe, expect, it } from "vitest";
import { recipeIngredientSchema, recipeUpsertSchema } from "./content";

describe("recipe validators", () => {
  it("decimal malzeme miktarını kabul eder", () => {
    const result = recipeIngredientSchema.safeParse({
      position: 0,
      name: "Zeytinyağı",
      quantityDecimal: 0.5,
      unit: "yemek kaşığı",
    });
    expect(result.success).toBe(true);
  });

  it("besin değeri varken kaynak zorunlu", () => {
    const result = recipeUpsertSchema.safeParse({
      slug: "ornek-tarif",
      title: "Örnek Tarif",
      excerpt: "Kısa özet metni burada.",
      instructionsJson: { steps: ["Karıştır"] },
      servingCount: 2,
      prepMinutes: 5,
      cookMinutes: 10,
      nutrientsPerServingJson: {
        kcal: 100,
        proteinG: 5,
        carbG: 10,
        fatG: 3,
      },
      nutrientSource: null,
      ingredients: [
        {
          position: 0,
          name: "Un",
          quantityDecimal: 125.5,
          unit: "g",
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("kaynaklı besin değerini kabul eder", () => {
    const result = recipeUpsertSchema.safeParse({
      slug: "ornek-tarif",
      title: "Örnek Tarif",
      excerpt: "Kısa özet metni burada.",
      instructionsJson: { steps: ["Karıştır"] },
      servingCount: 2,
      prepMinutes: 5,
      cookMinutes: 10,
      nutrientsPerServingJson: {
        kcal: 100,
        proteinG: 5,
        carbG: 10,
        fatG: 3,
      },
      nutrientSource: "Laboratuvar analizi",
      ingredients: [],
    });
    expect(result.success).toBe(true);
  });
});
