import { describe, expect, it } from "vitest";
import { calculateBmi } from "./bmi";
import { calculateMifflinStJeor, calculateTdee } from "./energy";
import { calculateWhtR } from "./whtr";
import { calculateWhr } from "./whr";
import { calculateReferenceWeightRange } from "./reference-weight";
import { calculateWeightChangePercent } from "./weight-change";
import { calculateFromMeasuredBodyFat } from "./body-composition";
import { calculateProteinNeed } from "./protein";
import { getWaterReference } from "./water";
import { sodiumMgToSaltG, saltGToSodiumMg } from "./sodium-salt";
import { calculateGlycemicLoad } from "./glycemic";
import { kcalToKj, scalePer100g } from "./label-convert";
import { estimateRoughWeightChange } from "./weight-planner";
import { pregnancyTotalGainRange } from "./pregnancy-gain";
import { sumCarbohydrates } from "./carb-count";
import { calculateRecipeNutrition } from "./recipe-nutrition";
import { foodsRecord } from "@/lib/nutrition-data/foods";
import { parseLocaleNumber } from "@/lib/nutrition-tools/parse";

describe("parseLocaleNumber", () => {
  it("virgül ve nokta", () => {
    expect(parseLocaleNumber("72,5")).toBe(72.5);
    expect(parseLocaleNumber("72.5")).toBe(72.5);
  });
});

describe("A01 BMI", () => {
  it("referans: 70kg 175cm ≈ 22.9", () => {
    const r = calculateBmi(175, 70);
    expect(r?.value).toBe(22.9);
    expect(r?.category).toBe("normal");
  });
  it("geçersiz", () => {
    expect(calculateBmi(50, 70)).toBeNull();
  });
});

describe("A02 WHtR", () => {
  it("80/170", () => {
    const r = calculateWhtR(80, 170);
    expect(r?.value).toBeCloseTo(0.471, 2);
  });
});

describe("A03 WHR", () => {
  it("eşik", () => {
    const r = calculateWhr(85, 100, "female");
    expect(r?.elevated).toBe(true);
  });
});

describe("A04 referans ağırlık", () => {
  it("170 cm aralık", () => {
    const r = calculateReferenceWeightRange(170);
    expect(r?.minKg).toBeGreaterThan(50);
    expect(r?.maxKg).toBeLessThan(80);
  });
});

describe("A05 ağırlık değişim", () => {
  it("%", () => {
    const r = calculateWeightChangePercent(80, 76);
    expect(r?.percent).toBe(-5);
  });
  it("sıfır başlangıç", () => {
    expect(calculateWeightChangePercent(0, 70)).toBeNull();
  });
});

describe("A06 kompozisyon", () => {
  it("FM/FFM", () => {
    const r = calculateFromMeasuredBodyFat(80, 180, 25);
    expect(r?.fatMassKg).toBe(20);
    expect(r?.fatFreeMassKg).toBe(60);
  });
});

describe("B01/B02 enerji", () => {
  it("Mifflin erkek", () => {
    const r = calculateMifflinStJeor({
      weightKg: 80,
      heightCm: 180,
      ageYears: 30,
      sex: "male",
    });
    expect(r?.rmrKcal).toBeCloseTo(1780, 0);
    expect(calculateTdee(r!.rmrKcal, "sedentary")).toBeCloseTo(2136, 0);
  });
});

describe("B03 planner", () => {
  it("aşırı açığı engeller", () => {
    const r = estimateRoughWeightChange({
      currentKg: 80,
      targetKg: 70,
      tdeeKcal: 2200,
      dailyIntakeKcal: 800,
      days: 60,
    });
    expect(r?.safe).toBe(false);
  });
});

describe("B05 protein", () => {
  it("bant", () => {
    const r = calculateProteinNeed(70, "sedentary");
    expect(r?.gramsMin).toBe(56);
  });
});

describe("B06 su", () => {
  it("EFSA AI", () => {
    expect(getWaterReference("female", false)?.aiLiters).toBe(2);
  });
});

describe("C04/C07", () => {
  it("kcal kJ", () => {
    expect(kcalToKj(100)).toBeCloseTo(418.4, 0);
  });
  it("ölçek", () => {
    expect(scalePer100g(200, 50)).toBe(100);
  });
  it("tuz", () => {
    expect(sodiumMgToSaltG(2000)).toBe(5);
    expect(saltGToSodiumMg(5)).toBe(2000);
  });
});

describe("C06 GL", () => {
  it("formül", () => {
    const r = calculateGlycemicLoad(50, 20);
    expect(r?.gl).toBe(10);
  });
});

describe("C05 CHO", () => {
  it("toplam", () => {
    expect(sumCarbohydrates([{ name: "a", carbG: 10 }, { name: "b", carbG: 5.5 }])).toBe(15.5);
  });
});

describe("C01 tarif", () => {
  it("porsiyon", () => {
    const r = calculateRecipeNutrition(
      [{ foodId: "olive_oil", grams: 10 }],
      foodsRecord(),
      2,
    );
    expect(r?.perServing.kcal).toBeGreaterThan(40);
  });
});

describe("D02 gebelik", () => {
  it("normal BMI band", () => {
    const r = pregnancyTotalGainRange(22);
    expect(r?.totalGainMinKg).toBe(11.5);
  });
});
