export type WeightChangeResult = {
  deltaKg: number;
  percent: number;
  direction: "gain" | "loss" | "stable";
};

export function calculateWeightChangePercent(
  startKg: number,
  currentKg: number,
): WeightChangeResult | null {
  if (
    !Number.isFinite(startKg) ||
    !Number.isFinite(currentKg) ||
    startKg <= 0 ||
    startKg > 400 ||
    currentKg <= 0 ||
    currentKg > 400
  ) {
    return null;
  }
  const deltaKg = Math.round((currentKg - startKg) * 10) / 10;
  const percent = Math.round(((currentKg - startKg) / startKg) * 1000) / 10;
  let direction: WeightChangeResult["direction"] = "stable";
  if (percent > 0.2) direction = "gain";
  else if (percent < -0.2) direction = "loss";
  return { deltaKg, percent, direction };
}
