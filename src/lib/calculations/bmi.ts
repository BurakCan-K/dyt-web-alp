export type BmiCategory =
  | "underweight"
  | "normal"
  | "overweight"
  | "obesity";

export type BmiResult = {
  value: number;
  /** Yuvarlanmamış ham değer (test / bilgilendirme) */
  raw: number;
  category: BmiCategory;
  labelTr: string;
};

/** Yetişkin bilgilendirme sınıfları — tanı veya “ideal kilo” garantisi değildir */
const LABELS: Record<BmiCategory, string> = {
  underweight: "18,5 altı aralık (bilgilendirme)",
  normal: "18,5–24,9 aralığı (bilgilendirme)",
  overweight: "25–29,9 aralığı (bilgilendirme)",
  obesity: "30 ve üzeri aralık (bilgilendirme)",
};

/**
 * Yetişkin VKİ: kg / m². Teşhis değildir; bilgilendirme amaçlıdır.
 * Yaş formülde kullanılmaz.
 */
export function calculateBmi(
  heightCm: number,
  weightKg: number,
): BmiResult | null {
  if (
    !Number.isFinite(heightCm) ||
    !Number.isFinite(weightKg) ||
    heightCm < 100 ||
    heightCm > 250 ||
    weightKg < 30 ||
    weightKg > 300
  ) {
    return null;
  }

  const m = heightCm / 100;
  const raw = weightKg / (m * m);
  const value = Math.round(raw * 10) / 10;

  let category: BmiCategory;
  if (value < 18.5) category = "underweight";
  else if (value < 25) category = "normal";
  else if (value < 30) category = "overweight";
  else category = "obesity";

  return { value, raw, category, labelTr: LABELS[category] };
}
