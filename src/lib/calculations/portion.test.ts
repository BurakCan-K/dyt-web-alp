import { describe, expect, it } from "vitest";
import { scaleIngredientQuantity } from "./portion";

describe("scaleIngredientQuantity", () => {
  it("150g iki porsiyon → 225g üç porsiyon", () => {
    expect(scaleIngredientQuantity(150, 2, 3)).toBe(225);
  });

  it("ondalık miktarı korur (0.5 × 2)", () => {
    expect(scaleIngredientQuantity(0.5, 1, 2)).toBe(1);
    expect(scaleIngredientQuantity(0.5, 2, 3)).toBe(0.75);
  });

  it("geçersiz girdileri reddeder", () => {
    expect(scaleIngredientQuantity(150, 0, 3)).toBeNull();
    expect(scaleIngredientQuantity(150, 2, -1)).toBeNull();
    expect(scaleIngredientQuantity(NaN, 2, 3)).toBeNull();
  });
});
