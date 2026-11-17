export type ProteinActivity = "sedentary" | "active" | "athlete";

export type ProteinNeedResult = {
  gPerKgMin: number;
  gPerKgMax: number;
  gramsMin: number;
  gramsMax: number;
};

const BANDS: Record<ProteinActivity, [number, number]> = {
  sedentary: [0.8, 1.0],
  active: [1.2, 1.6],
  athlete: [1.4, 2.0],
};

/** Bilgilendirme g/kg bantları — klinik reçete değildir. */
export function calculateProteinNeed(
  weightKg: number,
  activity: ProteinActivity,
): ProteinNeedResult | null {
  if (!Number.isFinite(weightKg) || weightKg < 30 || weightKg > 300) return null;
  const [gPerKgMin, gPerKgMax] = BANDS[activity];
  return {
    gPerKgMin,
    gPerKgMax,
    gramsMin: Math.round(weightKg * gPerKgMin),
    gramsMax: Math.round(weightKg * gPerKgMax),
  };
}
