"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export type MealRow = { name: string; itemsText: string };
export type DayRow = { name: string; meals: MealRow[] };

type Props = {
  name?: string;
  /** Flat meals (tek gün) veya days hiyerarşisi */
  initialMeals?: MealRow[];
  initialDays?: DayRow[];
};

const emptyMeal = (): MealRow => ({ name: "", itemsText: "" });
const emptyDay = (): DayRow => ({
  name: "Gün 1",
  meals: [emptyMeal()],
});

export function MealPlanEditor({
  name = "mealPlanJson",
  initialMeals,
  initialDays,
}: Props) {
  const [mode, setMode] = useState<"meals" | "days">(
    initialDays && initialDays.length > 0 ? "days" : "meals",
  );
  const [meals, setMeals] = useState<MealRow[]>(
    initialMeals && initialMeals.length > 0 ? initialMeals : [emptyMeal()],
  );
  const [days, setDays] = useState<DayRow[]>(
    initialDays && initialDays.length > 0 ? initialDays : [emptyDay()],
  );

  const payload =
    mode === "days"
      ? {
          days: days.map((d) => ({
            name: d.name.trim(),
            meals: d.meals
              .filter((m) => m.name.trim())
              .map((m) => ({
                name: m.name.trim(),
                items: m.itemsText
                  .split("\n")
                  .map((i) => i.trim())
                  .filter(Boolean),
              }))
              .filter((m) => m.items.length > 0),
          })),
        }
      : {
          meals: meals
            .filter((m) => m.name.trim())
            .map((m) => ({
              name: m.name.trim(),
              items: m.itemsText
                .split("\n")
                .map((i) => i.trim())
                .filter(Boolean),
            }))
            .filter((m) => m.items.length > 0),
        };

  return (
    <fieldset className="flex flex-col gap-space-sm">
      <legend className="text-label-sm">Öğün planı</legend>
      <input type="hidden" name={name} value={JSON.stringify(payload)} />
      <div className="flex gap-space-xs">
        <Button
          type="button"
          variant={mode === "meals" ? "primary" : "secondary"}
          onClick={() => setMode("meals")}
        >
          Tek gün / öğünler
        </Button>
        <Button
          type="button"
          variant={mode === "days" ? "primary" : "secondary"}
          onClick={() => setMode("days")}
        >
          Gün / öğün
        </Button>
      </div>

      {mode === "meals" ? (
        <ul className="space-y-space-sm">
          {meals.map((meal, index) => (
            <li
              key={index}
              className="rounded-xl bg-surface-container-low p-space-sm"
            >
              <input
                aria-label={`Öğün ${index + 1} adı`}
                placeholder="Kahvaltı"
                value={meal.name}
                onChange={(e) => {
                  const next = [...meals];
                  next[index] = { ...meal, name: e.target.value };
                  setMeals(next);
                }}
                className="mb-space-xs w-full rounded-lg bg-surface-container-lowest px-space-sm py-space-xs text-body-sm"
              />
              <textarea
                aria-label={`Öğün ${index + 1} maddeleri`}
                rows={3}
                placeholder="Her satıra bir madde"
                value={meal.itemsText}
                onChange={(e) => {
                  const next = [...meals];
                  next[index] = { ...meal, itemsText: e.target.value };
                  setMeals(next);
                }}
                className="w-full rounded-lg bg-surface-container-lowest px-space-sm py-space-xs text-body-sm"
              />
              <Button
                type="button"
                variant="ghost"
                className="mt-space-xs"
                onClick={() => setMeals(meals.filter((_, i) => i !== index))}
              >
                Öğünü sil
              </Button>
            </li>
          ))}
          <Button
            type="button"
            variant="secondary"
            className="w-fit"
            onClick={() => setMeals([...meals, emptyMeal()])}
          >
            Öğün ekle
          </Button>
        </ul>
      ) : (
        <ul className="space-y-space-md">
          {days.map((day, di) => (
            <li
              key={di}
              className="rounded-2xl bg-surface-container-low p-space-md"
            >
              <input
                aria-label={`Gün ${di + 1} adı`}
                value={day.name}
                onChange={(e) => {
                  const next = [...days];
                  next[di] = { ...day, name: e.target.value };
                  setDays(next);
                }}
                className="mb-space-sm w-full rounded-lg bg-surface-container-lowest px-space-sm py-space-xs text-body-sm"
              />
              {day.meals.map((meal, mi) => (
                <div key={mi} className="mb-space-sm">
                  <input
                    aria-label={`Gün ${di + 1} öğün ${mi + 1}`}
                    placeholder="Öğün adı"
                    value={meal.name}
                    onChange={(e) => {
                      const next = [...days];
                      const mealsCopy = [...day.meals];
                      mealsCopy[mi] = { ...meal, name: e.target.value };
                      next[di] = { ...day, meals: mealsCopy };
                      setDays(next);
                    }}
                    className="mb-space-xs w-full rounded-lg bg-surface-container-lowest px-space-sm py-space-xs text-body-sm"
                  />
                  <textarea
                    rows={2}
                    placeholder="Maddeler (satır satır)"
                    value={meal.itemsText}
                    onChange={(e) => {
                      const next = [...days];
                      const mealsCopy = [...day.meals];
                      mealsCopy[mi] = { ...meal, itemsText: e.target.value };
                      next[di] = { ...day, meals: mealsCopy };
                      setDays(next);
                    }}
                    className="w-full rounded-lg bg-surface-container-lowest px-space-sm py-space-xs text-body-sm"
                  />
                </div>
              ))}
              <div className="flex flex-wrap gap-space-xs">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    const next = [...days];
                    next[di] = {
                      ...day,
                      meals: [...day.meals, emptyMeal()],
                    };
                    setDays(next);
                  }}
                >
                  Öğün ekle
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setDays(days.filter((_, i) => i !== di))}
                >
                  Günü sil
                </Button>
              </div>
            </li>
          ))}
          <Button
            type="button"
            variant="secondary"
            className="w-fit"
            onClick={() =>
              setDays([
                ...days,
                { name: `Gün ${days.length + 1}`, meals: [emptyMeal()] },
              ])
            }
          >
            Gün ekle
          </Button>
        </ul>
      )}
    </fieldset>
  );
}
