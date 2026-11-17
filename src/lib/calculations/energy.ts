/**
 * Mifflin–St Jeor dinlenme metabolizma hızı (RMR) ve TDEE.
 * Tahminidir; tıbbi reçete veya kişiye özel program değildir.
 */

export type FormulaSex = "male" | "female";

export type ActivityLevelId =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export type ActivityFactor = {
  id: ActivityLevelId;
  factor: number;
  labelTr: string;
  descriptionTr: string;
};

/**
 * Yaygın kullanılan aktivite çarpanları (tahmini).
 * Kaynak: literatürde sık atıf edilen çoklu düzey çarpan seti — bireysel ölçüm değildir.
 */
export const ACTIVITY_FACTORS: ActivityFactor[] = [
  {
    id: "sedentary",
    factor: 1.2,
    labelTr: "Hareketsiz (×1,2)",
    descriptionTr: "Masa başı, az hareket",
  },
  {
    id: "light",
    factor: 1.375,
    labelTr: "Hafif aktif (×1,375)",
    descriptionTr: "Haftada 1–3 gün hafif egzersiz",
  },
  {
    id: "moderate",
    factor: 1.55,
    labelTr: "Orta aktif (×1,55)",
    descriptionTr: "Haftada 3–5 gün orta egzersiz",
  },
  {
    id: "active",
    factor: 1.725,
    labelTr: "Aktif (×1,725)",
    descriptionTr: "Haftada 6–7 gün yoğun egzersiz",
  },
  {
    id: "very_active",
    factor: 1.9,
    labelTr: "Çok aktif (×1,9)",
    descriptionTr: "Fiziksel iş veya günde iki antrenman",
  },
];

export type RmrInput = {
  weightKg: number;
  heightCm: number;
  ageYears: number;
  sex: FormulaSex;
};

export type RmrResult = {
  rmrKcal: number;
  formulaSexConstant: number;
};

/**
 * Mifflin–St Jeor: 10·kg + 6.25·cm − 5·yaş + s
 * s: erkek +5, kadın −161
 */
export function calculateMifflinStJeor(input: RmrInput): RmrResult | null {
  const { weightKg, heightCm, ageYears, sex } = input;
  if (
    !Number.isFinite(weightKg) ||
    !Number.isFinite(heightCm) ||
    !Number.isFinite(ageYears) ||
    weightKg < 30 ||
    weightKg > 300 ||
    heightCm < 100 ||
    heightCm > 250 ||
    ageYears < 18 ||
    ageYears > 100
  ) {
    return null;
  }

  const sexConstant = sex === "male" ? 5 : -161;
  const rmr =
    10 * weightKg + 6.25 * heightCm - 5 * ageYears + sexConstant;
  return {
    rmrKcal: Math.round(rmr * 10) / 10,
    formulaSexConstant: sexConstant,
  };
}

export function calculateTdee(
  rmrKcal: number,
  activityId: ActivityLevelId,
): number | null {
  if (!Number.isFinite(rmrKcal) || rmrKcal <= 0) return null;
  const row = ACTIVITY_FACTORS.find((a) => a.id === activityId);
  if (!row) return null;
  return Math.round(rmrKcal * row.factor * 10) / 10;
}

export function getActivityFactor(id: ActivityLevelId): ActivityFactor | undefined {
  return ACTIVITY_FACTORS.find((a) => a.id === id);
}
