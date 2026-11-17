export type PrePregnancyBmiBand =
  | "underweight"
  | "normal"
  | "overweight"
  | "obesity";

export type PregnancyGainResult = {
  band: PrePregnancyBmiBand;
  totalGainMinKg: number;
  totalGainMaxKg: number;
  labelTr: string;
};

/** IOM 2009 tekil gebelik toplam kazanım aralıkları (bilgilendirme). */
export function pregnancyTotalGainRange(
  prePregnancyBmi: number,
): PregnancyGainResult | null {
  if (!Number.isFinite(prePregnancyBmi) || prePregnancyBmi < 10 || prePregnancyBmi > 60) {
    return null;
  }
  let band: PrePregnancyBmiBand;
  let totalGainMinKg: number;
  let totalGainMaxKg: number;
  if (prePregnancyBmi < 18.5) {
    band = "underweight";
    totalGainMinKg = 12.5;
    totalGainMaxKg = 18;
  } else if (prePregnancyBmi < 25) {
    band = "normal";
    totalGainMinKg = 11.5;
    totalGainMaxKg = 16;
  } else if (prePregnancyBmi < 30) {
    band = "overweight";
    totalGainMinKg = 7;
    totalGainMaxKg = 11.5;
  } else {
    band = "obesity";
    totalGainMinKg = 5;
    totalGainMaxKg = 9;
  }
  return {
    band,
    totalGainMinKg,
    totalGainMaxKg,
    labelTr: `Tekil gebelik için önerilen toplam kazanım aralığı (IOM bilgilendirme): ${totalGainMinKg}–${totalGainMaxKg} kg`,
  };
}
