"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorDisclaimer } from "@/components/calculators/CalculatorDisclaimer";
import {
  CalcFormCard,
  FieldError,
  ResultHero,
  fieldClass,
} from "@/components/calculators/field";
import { scaleIngredientQuantity } from "@/lib/calculations/portion";

const DEFAULTS = {
  quantity: "150",
  unit: "g",
  base: "2",
  target: "3",
};

export function PortionCalculatorForm() {
  const baseId = useId();
  const [quantity, setQuantity] = useState(DEFAULTS.quantity);
  const [unit, setUnit] = useState(DEFAULTS.unit);
  const [base, setBase] = useState(DEFAULTS.base);
  const [target, setTarget] = useState(DEFAULTS.target);
  const [submitted, setSubmitted] = useState(false);

  const q = Number(quantity);
  const b = Number(base);
  const t = Number(target);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (quantity === "" || !Number.isFinite(q) || q < 0) {
      e.quantity = "Miktar ≥ 0 olmalı (ondalık serbest, örn. 0.5)";
    }
    if (base === "" || !Number.isFinite(b) || b <= 0) {
      e.base = "Orijinal porsiyon > 0 olmalı";
    }
    if (target === "" || !Number.isFinite(t) || t <= 0 || t > 50) {
      e.target = "Hedef porsiyon 0–50 arası olmalı";
    }
    return e;
  }, [quantity, q, base, b, target, t]);

  const scaled =
    submitted && Object.keys(errors).length === 0
      ? scaleIngredientQuantity(q, b, t)
      : null;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function onReset() {
    setQuantity(DEFAULTS.quantity);
    setUnit(DEFAULTS.unit);
    setBase(DEFAULTS.base);
    setTarget(DEFAULTS.target);
    setSubmitted(false);
  }

  return (
    <div className="flex flex-col gap-space-md">
      <CalcFormCard>
      <CalculatorDisclaimer className="mb-space-lg">
        Porsiyon ölçekleme yalnızca tarayıcıda yapılır; tarif veritabanına
        yazılmaz. Tarif detay sayfasındaki ölçekleyici ile aynı formülü kullanır.
      </CalculatorDisclaimer>

      <form
        onSubmit={onSubmit}
        noValidate
        className="grid grid-cols-1 gap-space-md sm:grid-cols-2"
      >
        <label className="flex flex-col gap-1 text-label-sm">
          Malzeme miktarı
          <input
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setSubmitted(false);
            }}
            aria-invalid={submitted && !!errors.quantity}
            aria-describedby={
              submitted && errors.quantity ? `${baseId}-q` : undefined
            }
            className={fieldClass}
          />
          {submitted ? (
            <FieldError id={`${baseId}-q`} message={errors.quantity} />
          ) : null}
        </label>
        <label className="flex flex-col gap-1 text-label-sm">
          Birim
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            className={fieldClass}
            placeholder="g, yemek kaşığı…"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-sm">
          Orijinal porsiyon
          <input
            type="number"
            inputMode="decimal"
            min={0.1}
            step="any"
            value={base}
            onChange={(e) => {
              setBase(e.target.value);
              setSubmitted(false);
            }}
            aria-invalid={submitted && !!errors.base}
            aria-describedby={
              submitted && errors.base ? `${baseId}-b` : undefined
            }
            className={fieldClass}
          />
          {submitted ? (
            <FieldError id={`${baseId}-b`} message={errors.base} />
          ) : null}
        </label>
        <label className="flex flex-col gap-1 text-label-sm">
          Hedef porsiyon
          <input
            type="number"
            inputMode="decimal"
            min={0.1}
            max={50}
            step="any"
            value={target}
            onChange={(e) => {
              setTarget(e.target.value);
              setSubmitted(false);
            }}
            aria-invalid={submitted && !!errors.target}
            aria-describedby={
              submitted && errors.target ? `${baseId}-t` : undefined
            }
            className={fieldClass}
          />
          {submitted ? (
            <FieldError id={`${baseId}-t`} message={errors.target} />
          ) : null}
        </label>
        <div className="flex flex-wrap gap-space-sm sm:col-span-2">
          <Button type="submit">Ölçekle</Button>
          <Button type="button" variant="secondary" onClick={onReset}>
            Sıfırla
          </Button>
        </div>
      </form>
      </CalcFormCard>

      {scaled != null ? (
        <ResultHero
          value={String(scaled)}
          unit={unit.trim() || "birim"}
          label="Ölçeklenmiş miktar"
          hint={`${q} × ${t} / ${b}`}
        />
      ) : null}
    </div>
  );
}
