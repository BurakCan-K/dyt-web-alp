/**
 * Sınırlı yardımcı tahmin — tam NIH dinamik modeli değildir.
 * ~7700 kcal/kg tek başına uzun vadeli garanti olarak kullanılmaz;
 * burada yalnızca kaba enerji farkı × gün gösterilir ve belirsizlik notu eklenir.
 */

export type PlannerInput = {
  currentKg: number;
  targetKg: number;
  tdeeKcal: number;
  dailyIntakeKcal: number;
  days: number;
};

export type PlannerResult = {
  deltaKgGoal: number;
  dailyDeficitKcal: number;
  roughProjectedDeltaKg: number;
  noteTr: string;
  safe: boolean;
  blockReason?: string;
};

export function estimateRoughWeightChange(
  input: PlannerInput,
): PlannerResult | null {
  const { currentKg, targetKg, tdeeKcal, dailyIntakeKcal, days } = input;
  if (
    ![currentKg, targetKg, tdeeKcal, dailyIntakeKcal, days].every(Number.isFinite)
  ) {
    return null;
  }
  if (currentKg < 40 || currentKg > 250 || targetKg < 40 || targetKg > 250) {
    return null;
  }
  if (days < 7 || days > 730) return null;
  if (tdeeKcal < 1000 || tdeeKcal > 6000) return null;

  const deltaKgGoal = Math.round((targetKg - currentKg) * 10) / 10;
  const dailyDeficitKcal = Math.round(tdeeKcal - dailyIntakeKcal);

  // Güvenlik: aşırı açık veya gebelik dışı çok düşük alım
  if (dailyIntakeKcal < 1200) {
    return {
      deltaKgGoal,
      dailyDeficitKcal,
      roughProjectedDeltaKg: 0,
      noteTr: "Çok düşük enerji alımı için otomatik projeksiyon yapılmaz.",
      safe: false,
      blockReason: "intake_too_low",
    };
  }
  if (Math.abs(dailyDeficitKcal) > 1000) {
    return {
      deltaKgGoal,
      dailyDeficitKcal,
      roughProjectedDeltaKg: 0,
      noteTr:
        "Günlük enerji farkı çok yüksek; güvenli projeksiyon sunulmaz. NIDDK Body Weight Planner’a bakın.",
      safe: false,
      blockReason: "deficit_extreme",
    };
  }

  // Kaba: 7700 kcal ≈ 1 kg — yalnızca kısa vadeli kabaca; dinamik adaptasyon yok
  const roughProjectedDeltaKg =
    Math.round(((-dailyDeficitKcal * days) / 7700) * 10) / 10;

  return {
    deltaKgGoal,
    dailyDeficitKcal,
    roughProjectedDeltaKg,
    noteTr:
      "Bu kaba yardımcıdır; metabolik adaptasyon ve kompozisyon değişimini modellemez. Kesin tarih garantisi yoktur. Detaylı dinamik model için NIDDK Body Weight Planner kullanın.",
    safe: true,
  };
}
