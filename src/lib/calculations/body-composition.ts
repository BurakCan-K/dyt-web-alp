export type BodyCompositionResult = {
  fatMassKg: number;
  fatFreeMassKg: number;
  ffmi: number;
};

/** Ölçülmüş yağ % ile FM/FFM/FFMI. Tahmini yağ % modeli değildir. */
export function calculateFromMeasuredBodyFat(
  weightKg: number,
  heightCm: number,
  bodyFatPercent: number,
): BodyCompositionResult | null {
  if (
    !Number.isFinite(weightKg) ||
    !Number.isFinite(heightCm) ||
    !Number.isFinite(bodyFatPercent) ||
    weightKg < 30 ||
    weightKg > 300 ||
    heightCm < 100 ||
    heightCm > 250 ||
    bodyFatPercent < 3 ||
    bodyFatPercent > 70
  ) {
    return null;
  }
  const fatMassKg = Math.round(weightKg * (bodyFatPercent / 100) * 10) / 10;
  const fatFreeMassKg = Math.round((weightKg - fatMassKg) * 10) / 10;
  const m = heightCm / 100;
  const ffmi = Math.round((fatFreeMassKg / (m * m)) * 10) / 10;
  return { fatMassKg, fatFreeMassKg, ffmi };
}
