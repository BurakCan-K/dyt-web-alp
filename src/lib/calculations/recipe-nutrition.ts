export type FoodNutrientsPer100g = {
  kcal: number;
  proteinG: number;
  carbG: number;
  fatG: number;
  fiberG?: number;
  sodiumMg?: number;
};

export type RecipeLine = {
  foodId: string;
  grams: number;
};

export type RecipeNutritionResult = {
  total: Required<FoodNutrientsPer100g>;
  perServing: Required<FoodNutrientsPer100g>;
};

export function calculateRecipeNutrition(
  lines: RecipeLine[],
  foods: Record<string, FoodNutrientsPer100g>,
  servings: number,
): RecipeNutritionResult | null {
  if (!Array.isArray(lines) || lines.length === 0) return null;
  if (!Number.isFinite(servings) || servings < 1 || servings > 50) return null;

  const total = {
    kcal: 0,
    proteinG: 0,
    carbG: 0,
    fatG: 0,
    fiberG: 0,
    sodiumMg: 0,
  };

  for (const line of lines) {
    if (!Number.isFinite(line.grams) || line.grams <= 0 || line.grams > 5000) {
      return null;
    }
    const f = foods[line.foodId];
    if (!f) return null;
    const factor = line.grams / 100;
    total.kcal += f.kcal * factor;
    total.proteinG += f.proteinG * factor;
    total.carbG += f.carbG * factor;
    total.fatG += f.fatG * factor;
    total.fiberG += (f.fiberG ?? 0) * factor;
    total.sodiumMg += (f.sodiumMg ?? 0) * factor;
  }

  const round = (n: number) => Math.round(n * 10) / 10;
  const tot = {
    kcal: round(total.kcal),
    proteinG: round(total.proteinG),
    carbG: round(total.carbG),
    fatG: round(total.fatG),
    fiberG: round(total.fiberG),
    sodiumMg: round(total.sodiumMg),
  };
  const perServing = {
    kcal: round(tot.kcal / servings),
    proteinG: round(tot.proteinG / servings),
    carbG: round(tot.carbG / servings),
    fatG: round(tot.fatG / servings),
    fiberG: round(tot.fiberG / servings),
    sodiumMg: round(tot.sodiumMg / servings),
  };
  return { total: tot, perServing };
}
