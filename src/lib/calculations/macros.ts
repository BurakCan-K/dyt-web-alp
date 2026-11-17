export type MacroPercents = {
  proteinPct: number;
  carbPct: number;
  fatPct: number;
};

export type MacroGrams = {
  proteinG: number;
  carbG: number;
  fatG: number;
};

export type MacroResult = MacroGrams & {
  kcal: number;
  percents: MacroPercents;
};

const PCT_TOLERANCE = 0.01;

/**
 * Makro gramları: kcal × oran / (100 × 4) protein/karb, / (100 × 9) yağ.
 * Yüzdeler toplamı %100 olmalıdır.
 */
export function calculateMacroGrams(
  kcal: number,
  percents: MacroPercents,
): MacroResult | null {
  if (
    !Number.isFinite(kcal) ||
    kcal < 500 ||
    kcal > 10000 ||
    !Number.isFinite(percents.proteinPct) ||
    !Number.isFinite(percents.carbPct) ||
    !Number.isFinite(percents.fatPct) ||
    percents.proteinPct < 0 ||
    percents.carbPct < 0 ||
    percents.fatPct < 0
  ) {
    return null;
  }

  const sum =
    percents.proteinPct + percents.carbPct + percents.fatPct;
  if (Math.abs(sum - 100) > PCT_TOLERANCE) {
    return null;
  }

  const proteinG =
    Math.round(((kcal * percents.proteinPct) / (100 * 4)) * 100) / 100;
  const carbG =
    Math.round(((kcal * percents.carbPct) / (100 * 4)) * 100) / 100;
  const fatG =
    Math.round(((kcal * percents.fatPct) / (100 * 9)) * 100) / 100;

  return {
    kcal,
    percents,
    proteinG,
    carbG,
    fatG,
  };
}

export function macroPercentSum(percents: MacroPercents): number {
  return percents.proteinPct + percents.carbPct + percents.fatPct;
}
