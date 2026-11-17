export type RecipeDifficulty = "çok kolay" | "kolay" | "orta" | "zor";

export type RecipeInstructions = {
  steps: string[];
  difficulty?: RecipeDifficulty | string;
  tips?: string[];
  allergens?: string[];
};

export function stepsToInstructionsJson(
  steps: string[],
  extras?: {
    difficulty?: string;
    tips?: string[];
    allergens?: string[];
  },
): RecipeInstructions {
  const payload: RecipeInstructions = {
    steps: steps.map((s) => s.trim()).filter(Boolean).slice(0, 60),
  };
  const difficulty = extras?.difficulty?.trim();
  if (difficulty) payload.difficulty = difficulty;
  const tips = (extras?.tips ?? [])
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
  if (tips.length) payload.tips = tips;
  const allergens = (extras?.allergens ?? [])
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
  if (allergens.length) payload.allergens = allergens;
  return payload;
}

export function extractRecipeSteps(instructionsJson: unknown): string[] {
  if (!instructionsJson || typeof instructionsJson !== "object") return [];
  const steps = (instructionsJson as { steps?: unknown }).steps;
  if (!Array.isArray(steps)) return [];
  return steps
    .filter((s): s is string => typeof s === "string")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function extractRecipeMeta(instructionsJson: unknown): {
  difficulty?: string;
  tips: string[];
  allergens: string[];
} {
  if (!instructionsJson || typeof instructionsJson !== "object") {
    return { tips: [], allergens: [] };
  }
  const raw = instructionsJson as RecipeInstructions;
  const tips = Array.isArray(raw.tips)
    ? raw.tips.filter((s): s is string => typeof s === "string").map((s) => s.trim()).filter(Boolean)
    : [];
  const allergens = Array.isArray(raw.allergens)
    ? raw.allergens.filter((s): s is string => typeof s === "string").map((s) => s.trim()).filter(Boolean)
    : [];
  const difficulty =
    typeof raw.difficulty === "string" && raw.difficulty.trim()
      ? raw.difficulty.trim()
      : undefined;
  return { difficulty, tips, allergens };
}

export function parseStepsField(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 60);
}

export function parseLinesField(raw: FormDataEntryValue | null, max = 20): string[] {
  if (typeof raw !== "string" || !raw.trim()) return [];
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, max);
}
