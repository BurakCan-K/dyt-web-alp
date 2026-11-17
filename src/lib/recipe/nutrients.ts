import type { z } from "zod";
import type { nutrientsPerServingSchema } from "@/lib/validators/content";

export type NutrientsPerServing = z.infer<typeof nutrientsPerServingSchema>;

/**
 * Besin değerleri yalnızca formdan el ile gelir.
 * Malzemelerden otomatik kcal/makro üretilmez.
 */
export function parseManualNutrients(input: {
  kcal?: string | null;
  proteinG?: string | null;
  carbG?: string | null;
  fatG?: string | null;
  source?: string | null;
}): { nutrients: NutrientsPerServing | null; source: string | null } {
  const raw = {
    kcal: input.kcal?.trim() ?? "",
    proteinG: input.proteinG?.trim() ?? "",
    carbG: input.carbG?.trim() ?? "",
    fatG: input.fatG?.trim() ?? "",
  };
  const anyFilled = Object.values(raw).some(Boolean);
  if (!anyFilled) {
    return { nutrients: null, source: null };
  }

  const nums = {
    kcal: Number(raw.kcal),
    proteinG: Number(raw.proteinG),
    carbG: Number(raw.carbG),
    fatG: Number(raw.fatG),
  };
  if (Object.values(nums).some((n) => !Number.isFinite(n) || n < 0)) {
    throw new Error("Besin değerleri geçerli sayı olmalıdır");
  }

  const source = input.source?.trim() || null;
  return { nutrients: nums, source };
}
