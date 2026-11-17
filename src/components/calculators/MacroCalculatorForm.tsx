"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorDisclaimer } from "@/components/calculators/CalculatorDisclaimer";
import {
  CalcFormCard,
  FieldError,
  MetricTile,
  ResultPanel,
  fieldClass,
} from "@/components/calculators/field";
import {
  calculateMacroGrams,
  macroPercentSum,
} from "@/lib/calculations/macros";

const DEFAULTS = {
  kcal: "2000",
  protein: "20",
  carb: "50",
  fat: "30",
};

export function MacroCalculatorForm() {
  const baseId = useId();
  const [kcal, setKcal] = useState(DEFAULTS.kcal);
  const [protein, setProtein] = useState(DEFAULTS.protein);
  const [carb, setCarb] = useState(DEFAULTS.carb);
  const [fat, setFat] = useState(DEFAULTS.fat);
  const [submitted, setSubmitted] = useState(false);

  const kcalN = Number(kcal);
  const proteinN = Number(protein);
  const carbN = Number(carb);
  const fatN = Number(fat);
  const sum = macroPercentSum({
    proteinPct: proteinN || 0,
    carbPct: carbN || 0,
    fatPct: fatN || 0,
  });

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (kcal === "" || !Number.isFinite(kcalN) || kcalN < 500 || kcalN > 10000) {
      e.kcal = "Enerji 500–10000 kcal olmalı";
    }
    if (
      protein === "" ||
      carb === "" ||
      fat === "" ||
      !Number.isFinite(proteinN) ||
      !Number.isFinite(carbN) ||
      !Number.isFinite(fatN) ||
      proteinN < 0 ||
      carbN < 0 ||
      fatN < 0
    ) {
      e.pct = "Yüzdeler negatif olamaz ve sayı olmalıdır";
    } else if (Math.abs(sum - 100) > 0.01) {
      e.pct = `Yüzdeler toplamı %100 olmalı (şu an %${sum.toFixed(1)})`;
    }
    return e;
  }, [kcal, kcalN, protein, proteinN, carb, carbN, fat, fatN, sum]);

  const result =
    submitted && !errors.kcal && !errors.pct
      ? calculateMacroGrams(kcalN, {
          proteinPct: proteinN,
          carbPct: carbN,
          fatPct: fatN,
        })
      : null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function onReset() {
    setKcal(DEFAULTS.kcal);
    setProtein(DEFAULTS.protein);
    setCarb(DEFAULTS.carb);
    setFat(DEFAULTS.fat);
    setSubmitted(false);
  }

  return (
    <div className="flex flex-col gap-space-md">
      <CalcFormCard>
      <CalculatorDisclaimer className="mb-space-lg">
        Kullanıcının girdiği enerji ve yüzde dağılımından gram hesabı yapılır.
        Otomatik “sana özel program” veya tıbbi diyet önerisi üretilmez. Veriler
        kaydedilmez.
      </CalculatorDisclaimer>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-space-md">
        <label className="flex flex-col gap-1 text-label-sm">
          Günlük enerji (kcal)
          <input
            type="number"
            inputMode="decimal"
            min={500}
            max={10000}
            value={kcal}
            onChange={(e) => {
              setKcal(e.target.value);
              setSubmitted(false);
            }}
            aria-invalid={submitted && !!errors.kcal}
            aria-describedby={
              submitted && errors.kcal ? `${baseId}-k` : undefined
            }
            className={fieldClass}
          />
          {submitted ? (
            <FieldError id={`${baseId}-k`} message={errors.kcal} />
          ) : null}
        </label>

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-label-sm">
            Protein %
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="any"
              value={protein}
              onChange={(e) => {
                setProtein(e.target.value);
                setSubmitted(false);
              }}
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-label-sm">
            Karbonhidrat %
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="any"
              value={carb}
              onChange={(e) => {
                setCarb(e.target.value);
                setSubmitted(false);
              }}
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-label-sm">
            Yağ %
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={100}
              step="any"
              value={fat}
              onChange={(e) => {
                setFat(e.target.value);
                setSubmitted(false);
              }}
              className={fieldClass}
            />
          </label>
        </div>
        <p className="text-body-sm text-on-surface-variant">
          Toplam: %{Number.isFinite(sum) ? sum.toFixed(1) : "—"} (hedef %100)
        </p>
        {submitted ? (
          <FieldError id={`${baseId}-p`} message={errors.pct} />
        ) : null}

        <div className="flex flex-wrap gap-space-sm">
          <Button type="submit">Hesapla</Button>
          <Button type="button" variant="secondary" onClick={onReset}>
            Sıfırla
          </Button>
        </div>
      </form>
      </CalcFormCard>

      {result ? (
        <ResultPanel title="Makro gramları">
          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
            <MetricTile
              label="Protein"
              value={String(result.proteinG)}
              unit="g"
            />
            <MetricTile
              label="Karbonhidrat"
              value={String(result.carbG)}
              unit="g"
            />
            <MetricTile label="Yağ" value={String(result.fatG)} unit="g" />
          </div>
          <p className="mt-space-md text-body-sm text-on-surface-variant">
            4 / 4 / 9 kcal/g · yüzde toplamı %100 olmalı.
          </p>
        </ResultPanel>
      ) : null}
    </div>
  );
}
