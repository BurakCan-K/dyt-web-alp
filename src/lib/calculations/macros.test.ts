import { describe, expect, it } from "vitest";
import { calculateMacroGrams, macroPercentSum } from "./macros";

describe("calculateMacroGrams", () => {
  it("2000 kcal %20/50/30 → P100 K250 Y≈66.67", () => {
    const result = calculateMacroGrams(2000, {
      proteinPct: 20,
      carbPct: 50,
      fatPct: 30,
    });
    expect(result).not.toBeNull();
    expect(result!.proteinG).toBe(100);
    expect(result!.carbG).toBe(250);
    expect(result!.fatG).toBeCloseTo(66.67, 2);
  });

  it("%100 değilse null", () => {
    expect(
      calculateMacroGrams(2000, {
        proteinPct: 20,
        carbPct: 50,
        fatPct: 20,
      }),
    ).toBeNull();
  });

  it("negatif / NaN reddeder", () => {
    expect(
      calculateMacroGrams(NaN, {
        proteinPct: 20,
        carbPct: 50,
        fatPct: 30,
      }),
    ).toBeNull();
    expect(
      calculateMacroGrams(2000, {
        proteinPct: -1,
        carbPct: 50,
        fatPct: 51,
      }),
    ).toBeNull();
  });

  it("yüzde toplamı", () => {
    expect(
      macroPercentSum({ proteinPct: 20, carbPct: 50, fatPct: 30 }),
    ).toBe(100);
  });
});
