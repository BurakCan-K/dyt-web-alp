"use client";

import { useMemo, useState } from "react";
import type { RecipeIngredient } from "@/data/content";
import { scaleQuantity } from "@/lib/content-query";

type Props = {
  baseServings: number;
  ingredients: RecipeIngredient[];
};

export function PortionScaler({ baseServings, ingredients }: Props) {
  const [servings, setServings] = useState(baseServings);

  const scaled = useMemo(
    () =>
      ingredients.map((ing) => ({
        ...ing,
        quantity: scaleQuantity(ing.quantity, baseServings, servings),
      })),
    [ingredients, baseServings, servings],
  );

  return (
    <div className="rounded-3xl bg-surface-container-low p-space-lg">
      <div className="flex flex-wrap items-end justify-between gap-space-md">
        <div>
          <h2 className="text-headline-sm text-on-surface">Malzemeler</h2>
          <p className="text-body-sm text-on-surface-variant">
            Porsiyon ölçekleme tarayıcıda yapılır; veri kaydedilmez.
          </p>
        </div>
        <label className="flex flex-col gap-1 text-label-sm text-on-surface">
          Porsiyon
          <input
            type="number"
            min={1}
            max={20}
            value={servings}
            onChange={(e) => {
              const n = Number(e.target.value);
              if (Number.isFinite(n)) setServings(Math.min(20, Math.max(1, n)));
            }}
            className="w-24 rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/40"
          />
        </label>
      </div>
      <ul className="mt-space-md space-y-space-sm">
        {scaled.map((ing) => (
          <li
            key={ing.name}
            className="flex justify-between gap-space-md border-b border-outline-variant/20 pb-space-sm text-body-md"
          >
            <span>
              {ing.name}
              {ing.note ? (
                <span className="text-body-sm text-on-surface-variant">
                  {" "}
                  ({ing.note})
                </span>
              ) : null}
            </span>
            <span className="shrink-0 font-semibold text-on-surface">
              {ing.quantity} {ing.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
