import { describe, expect, it } from "vitest";
import { calculateBmi } from "./bmi";

describe("calculateBmi", () => {
  it("70kg 170cm ≈ 24.22 (gösterim 1 ondalık → 24.2)", () => {
    const result = calculateBmi(170, 70);
    expect(result).not.toBeNull();
    expect(result!.raw).toBeCloseTo(24.22, 2);
    expect(result!.value).toBe(24.2);
    expect(result!.category).toBe("normal");
  });

  it("sınıf etiketinde tanı/ideal kilo garantisi yok", () => {
    const result = calculateBmi(170, 70);
    expect(result!.labelTr.toLowerCase()).not.toContain("ideal");
    expect(result!.labelTr.toLowerCase()).not.toContain("tanı");
  });

  it("geçersiz boyu reddeder", () => {
    expect(calculateBmi(0, 70)).toBeNull();
    expect(calculateBmi(NaN, 70)).toBeNull();
    expect(calculateBmi(170, -5)).toBeNull();
  });

  it("sınır sınıfları", () => {
    expect(calculateBmi(170, 50)?.category).toBe("underweight");
    expect(calculateBmi(170, 80)?.category).toBe("overweight");
    expect(calculateBmi(170, 100)?.category).toBe("obesity");
  });
});
