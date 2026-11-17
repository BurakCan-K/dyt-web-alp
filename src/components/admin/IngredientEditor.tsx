"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export type IngredientRow = {
  name: string;
  quantityDecimal: number | "";
  unit: string;
  note: string;
};

type Props = {
  name?: string;
  initial?: IngredientRow[];
};

const emptyRow = (): IngredientRow => ({
  name: "",
  quantityDecimal: "",
  unit: "g",
  note: "",
});

export function IngredientEditor({
  name = "ingredientsJson",
  initial = [emptyRow()],
}: Props) {
  const [rows, setRows] = useState<IngredientRow[]>(
    initial.length > 0 ? initial : [emptyRow()],
  );

  return (
    <fieldset className="flex flex-col gap-space-sm">
      <legend className="text-label-sm">Malzemeler (decimal miktar)</legend>
      <input type="hidden" name={name} value={JSON.stringify(rows)} />
      <ul className="space-y-space-sm">
        {rows.map((row, index) => (
          <li
            key={index}
            className="grid grid-cols-1 gap-space-xs rounded-xl bg-surface-container-low p-space-sm md:grid-cols-12"
          >
            <input
              aria-label={`Malzeme ${index + 1} adı`}
              placeholder="Ad"
              value={row.name}
              onChange={(e) => {
                const next = [...rows];
                next[index] = { ...row, name: e.target.value };
                setRows(next);
              }}
              className="rounded-lg bg-surface-container-lowest px-space-sm py-space-xs text-body-sm md:col-span-4"
            />
            <input
              aria-label={`Malzeme ${index + 1} miktar`}
              type="number"
              step="any"
              min="0"
              placeholder="0.5"
              value={row.quantityDecimal}
              onChange={(e) => {
                const next = [...rows];
                const v = e.target.value;
                next[index] = {
                  ...row,
                  quantityDecimal: v === "" ? "" : Number(v),
                };
                setRows(next);
              }}
              className="rounded-lg bg-surface-container-lowest px-space-sm py-space-xs text-body-sm md:col-span-2"
            />
            <input
              aria-label={`Malzeme ${index + 1} birim`}
              placeholder="birim"
              value={row.unit}
              onChange={(e) => {
                const next = [...rows];
                next[index] = { ...row, unit: e.target.value };
                setRows(next);
              }}
              className="rounded-lg bg-surface-container-lowest px-space-sm py-space-xs text-body-sm md:col-span-2"
            />
            <input
              aria-label={`Malzeme ${index + 1} not`}
              placeholder="not"
              value={row.note}
              onChange={(e) => {
                const next = [...rows];
                next[index] = { ...row, note: e.target.value };
                setRows(next);
              }}
              className="rounded-lg bg-surface-container-lowest px-space-sm py-space-xs text-body-sm md:col-span-3"
            />
            <Button
              type="button"
              variant="ghost"
              className="md:col-span-1"
              onClick={() => setRows(rows.filter((_, i) => i !== index))}
            >
              Sil
            </Button>
          </li>
        ))}
      </ul>
      <Button
        type="button"
        variant="secondary"
        className="w-fit"
        onClick={() => setRows([...rows, emptyRow()])}
      >
        Malzeme ekle
      </Button>
    </fieldset>
  );
}
