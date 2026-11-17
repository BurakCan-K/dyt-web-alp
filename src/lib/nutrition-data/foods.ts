import type { FoodNutrientsPer100g } from "@/lib/calculations/recipe-nutrition";

export type StaticFood = FoodNutrientsPer100g & {
  id: string;
  nameTr: string;
  sourceNote: string;
};

/** Küçük örnek set — USDA FDC tarzı yaklaşık değerler; tam katalog değildir. */
export const STATIC_FOODS: StaticFood[] = [
  {
    id: "rice_white_raw",
    nameTr: "Pirinç (çiğ, beyaz)",
    kcal: 365,
    proteinG: 7.1,
    carbG: 80,
    fatG: 0.7,
    fiberG: 1.3,
    sodiumMg: 5,
    sourceNote: "Örnek kompozisyon (statik)",
  },
  {
    id: "chicken_breast_raw",
    nameTr: "Tavuk göğsü (çiğ)",
    kcal: 120,
    proteinG: 22.5,
    carbG: 0,
    fatG: 2.6,
    fiberG: 0,
    sodiumMg: 45,
    sourceNote: "Örnek kompozisyon (statik)",
  },
  {
    id: "olive_oil",
    nameTr: "Zeytinyağı",
    kcal: 884,
    proteinG: 0,
    carbG: 0,
    fatG: 100,
    fiberG: 0,
    sodiumMg: 2,
    sourceNote: "Örnek kompozisyon (statik)",
  },
  {
    id: "tomato_raw",
    nameTr: "Domates (çiğ)",
    kcal: 18,
    proteinG: 0.9,
    carbG: 3.9,
    fatG: 0.2,
    fiberG: 1.2,
    sodiumMg: 5,
    sourceNote: "Örnek kompozisyon (statik)",
  },
  {
    id: "cucumber_raw",
    nameTr: "Salatalık (çiğ)",
    kcal: 15,
    proteinG: 0.7,
    carbG: 3.6,
    fatG: 0.1,
    fiberG: 0.5,
    sodiumMg: 2,
    sourceNote: "Örnek kompozisyon (statik)",
  },
  {
    id: "pasta_dry",
    nameTr: "Makarna (kuru)",
    kcal: 371,
    proteinG: 13,
    carbG: 75,
    fatG: 1.5,
    fiberG: 3.2,
    sodiumMg: 6,
    sourceNote: "Örnek kompozisyon (statik)",
  },
  {
    id: "tuna_canned_water",
    nameTr: "Ton balığı (suda, süzülmüş)",
    kcal: 86,
    proteinG: 19,
    carbG: 0,
    fatG: 1,
    fiberG: 0,
    sodiumMg: 320,
    sourceNote: "Örnek kompozisyon (statik)",
  },
  {
    id: "yogurt_plain",
    nameTr: "Yoğurt (sade)",
    kcal: 61,
    proteinG: 3.5,
    carbG: 4.7,
    fatG: 3.3,
    fiberG: 0,
    sodiumMg: 46,
    sourceNote: "Örnek kompozisyon (statik)",
  },
  {
    id: "oats",
    nameTr: "Yulaf ezmesi",
    kcal: 389,
    proteinG: 17,
    carbG: 66,
    fatG: 7,
    fiberG: 11,
    sodiumMg: 2,
    sourceNote: "Örnek kompozisyon (statik)",
  },
  {
    id: "apple_raw",
    nameTr: "Elma (çiğ)",
    kcal: 52,
    proteinG: 0.3,
    carbG: 14,
    fatG: 0.2,
    fiberG: 2.4,
    sodiumMg: 1,
    sourceNote: "Örnek kompozisyon (statik)",
  },
];

export function foodsRecord(): Record<string, FoodNutrientsPer100g> {
  return Object.fromEntries(
    STATIC_FOODS.map((f) => [
      f.id,
      {
        kcal: f.kcal,
        proteinG: f.proteinG,
        carbG: f.carbG,
        fatG: f.fatG,
        fiberG: f.fiberG,
        sodiumMg: f.sodiumMg,
      },
    ]),
  );
}

export function searchFoods(query: string): StaticFood[] {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return STATIC_FOODS;
  return STATIC_FOODS.filter((f) => f.nameTr.toLocaleLowerCase("tr").includes(q));
}
