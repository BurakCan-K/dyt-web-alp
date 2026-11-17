export type WhtRBand = "lower" | "increased" | "high";

export type WhtRResult = {
  value: number;
  band: WhtRBand;
  labelTr: string;
};

/**
 * WHtR = bel(cm)/boy(cm).
 * Bilgilendirme eşikleri (NICE bağlamlı yaygın kullanım):
 * <0.40 düşük; 0.40–0.49 artmış; ≥0.50 yüksek (yetişkin).
 * Teşhis değildir.
 */
export function calculateWhtR(
  waistCm: number,
  heightCm: number,
): WhtRResult | null {
  if (
    !Number.isFinite(waistCm) ||
    !Number.isFinite(heightCm) ||
    waistCm < 40 ||
    waistCm > 200 ||
    heightCm < 100 ||
    heightCm > 250
  ) {
    return null;
  }
  const raw = waistCm / heightCm;
  const value = Math.round(raw * 1000) / 1000;
  let band: WhtRBand;
  let labelTr: string;
  if (value < 0.4) {
    band = "lower";
    labelTr = "0,40 altı aralık (bilgilendirme)";
  } else if (value < 0.5) {
    band = "increased";
    labelTr = "0,40–0,49 aralığı (bilgilendirme)";
  } else {
    band = "high";
    labelTr = "0,50 ve üzeri aralık (bilgilendirme)";
  }
  return { value, band, labelTr };
}
