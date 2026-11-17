export type DriLifeStage = "adult_male" | "adult_female" | "pregnancy" | "lactation";

export type DriNutrient = {
  id: string;
  nameTr: string;
  unit: string;
  values: Record<DriLifeStage, number | null>;
  type: "RDA" | "AI";
  note?: string;
};

/** Özet bilgilendirme tablosu — tam NASEM seti değildir; takviye dozu değildir. */
export const DRI_TABLE: DriNutrient[] = [
  {
    id: "vitamin_c",
    nameTr: "C vitamini",
    unit: "mg",
    type: "RDA",
    values: { adult_male: 90, adult_female: 75, pregnancy: 85, lactation: 120 },
  },
  {
    id: "vitamin_d",
    nameTr: "D vitamini",
    unit: "µg",
    type: "RDA",
    values: { adult_male: 15, adult_female: 15, pregnancy: 15, lactation: 15 },
  },
  {
    id: "calcium",
    nameTr: "Kalsiyum",
    unit: "mg",
    type: "RDA",
    values: { adult_male: 1000, adult_female: 1000, pregnancy: 1000, lactation: 1000 },
  },
  {
    id: "iron",
    nameTr: "Demir",
    unit: "mg",
    type: "RDA",
    values: { adult_male: 8, adult_female: 18, pregnancy: 27, lactation: 9 },
  },
  {
    id: "folate",
    nameTr: "Folat",
    unit: "µg DFE",
    type: "RDA",
    values: { adult_male: 400, adult_female: 400, pregnancy: 600, lactation: 500 },
  },
];

export const DRI_STAGE_LABELS: Record<DriLifeStage, string> = {
  adult_male: "Yetişkin erkek",
  adult_female: "Yetişkin kadın",
  pregnancy: "Gebelik",
  lactation: "Emzirme",
};
