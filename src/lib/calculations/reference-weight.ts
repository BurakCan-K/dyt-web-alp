export type ReferenceWeightResult = {
  heightM: number;
  minKg: number;
  maxKg: number;
};

/** BMI 18.5–24.9 aralığına karşılık gelen ağırlık (kg). Tek ideal kilo değildir. */
export function calculateReferenceWeightRange(
  heightCm: number,
): ReferenceWeightResult | null {
  if (!Number.isFinite(heightCm) || heightCm < 100 || heightCm > 250) return null;
  const m = heightCm / 100;
  const m2 = m * m;
  return {
    heightM: Math.round(m * 1000) / 1000,
    minKg: Math.round(18.5 * m2 * 10) / 10,
    maxKg: Math.round(24.9 * m2 * 10) / 10,
  };
}
