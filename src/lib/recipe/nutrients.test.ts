import { describe, expect, it } from "vitest";
import { parseManualNutrients } from "./nutrients";

describe("parseManualNutrients", () => {
  it("boş formda null döner — malzemeden otomatik üretmez", () => {
    expect(
      parseManualNutrients({
        kcal: "",
        proteinG: "",
        carbG: "",
        fatG: "",
        source: "",
      }),
    ).toEqual({ nutrients: null, source: null });
  });

  it("el ile girilen değerleri kabul eder", () => {
    expect(
      parseManualNutrients({
        kcal: "260",
        proteinG: "12",
        carbG: "35.5",
        fatG: "6",
        source: "El ile doğrulanmış",
      }),
    ).toEqual({
      nutrients: { kcal: 260, proteinG: 12, carbG: 35.5, fatG: 6 },
      source: "El ile doğrulanmış",
    });
  });

  it("kısmi geçersiz sayıda hata verir", () => {
    expect(() =>
      parseManualNutrients({
        kcal: "abc",
        proteinG: "1",
        carbG: "1",
        fatG: "1",
      }),
    ).toThrow(/Besin/);
  });
});
