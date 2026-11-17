import { describe, expect, it } from "vitest";
import {
  ACTIVITY_FACTORS,
  calculateMifflinStJeor,
  calculateTdee,
} from "./energy";

describe("calculateMifflinStJeor", () => {
  it("erkek 70kg 170cm 30y → 1617.5", () => {
    const result = calculateMifflinStJeor({
      weightKg: 70,
      heightCm: 170,
      ageYears: 30,
      sex: "male",
    });
    expect(result?.rmrKcal).toBe(1617.5);
    expect(result?.formulaSexConstant).toBe(5);
  });

  it("kadın 70kg 170cm 30y → 1451.5", () => {
    const result = calculateMifflinStJeor({
      weightKg: 70,
      heightCm: 170,
      ageYears: 30,
      sex: "female",
    });
    expect(result?.rmrKcal).toBe(1451.5);
    expect(result?.formulaSexConstant).toBe(-161);
  });

  it("18 altı ve uç değerleri reddeder", () => {
    expect(
      calculateMifflinStJeor({
        weightKg: 70,
        heightCm: 170,
        ageYears: 17,
        sex: "male",
      }),
    ).toBeNull();
    expect(
      calculateMifflinStJeor({
        weightKg: 0,
        heightCm: 170,
        ageYears: 30,
        sex: "male",
      }),
    ).toBeNull();
  });
});

describe("calculateTdee", () => {
  it("RMR × aktivite çarpanı", () => {
    expect(calculateTdee(1617.5, "sedentary")).toBeCloseTo(1617.5 * 1.2, 1);
    expect(calculateTdee(1617.5, "moderate")).toBeCloseTo(1617.5 * 1.55, 1);
  });

  it("çarpan listesi tanımlı", () => {
    expect(ACTIVITY_FACTORS.map((a) => a.factor)).toEqual([
      1.2, 1.375, 1.55, 1.725, 1.9,
    ]);
  });
});
