const KJ_PER_KCAL = 4.184;

export function kcalToKj(kcal: number): number | null {
  if (!Number.isFinite(kcal) || kcal < 0) return null;
  return Math.round(kcal * KJ_PER_KCAL * 10) / 10;
}

export function kjToKcal(kj: number): number | null {
  if (!Number.isFinite(kj) || kj < 0) return null;
  return Math.round((kj / KJ_PER_KCAL) * 10) / 10;
}

/** 100 g değerini verilen grama ölçekle */
export function scalePer100g(per100: number, grams: number): number | null {
  if (!Number.isFinite(per100) || !Number.isFinite(grams) || grams < 0) return null;
  return Math.round(per100 * (grams / 100) * 100) / 100;
}
