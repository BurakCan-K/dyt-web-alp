export type WhrSex = "female" | "male";

export type WhrResult = {
  value: number;
  elevated: boolean;
  labelTr: string;
};

/**
 * WHR = bel/kalça.
 * Yaygın bilgilendirme eşikleri (WHO bağlamı): kadın ≥0.85, erkek ≥0.90 “yüksek”.
 */
export function calculateWhr(
  waistCm: number,
  hipCm: number,
  sex: WhrSex,
): WhrResult | null {
  if (
    !Number.isFinite(waistCm) ||
    !Number.isFinite(hipCm) ||
    waistCm < 40 ||
    waistCm > 200 ||
    hipCm < 50 ||
    hipCm > 200
  ) {
    return null;
  }
  const value = Math.round((waistCm / hipCm) * 1000) / 1000;
  const cut = sex === "female" ? 0.85 : 0.9;
  const elevated = value >= cut;
  return {
    value,
    elevated,
    labelTr: elevated
      ? `Eşik (${cut}) ve üzeri aralık (bilgilendirme)`
      : `Eşik (${cut}) altı aralık (bilgilendirme)`,
  };
}
