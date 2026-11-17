"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorDisclaimer } from "@/components/calculators/CalculatorDisclaimer";
import { RangeBar } from "@/components/calculators/RangeBar";
import {
  CalcFormCard,
  FieldError,
  ResultHero,
  fieldClass,
} from "@/components/calculators/field";
import { calculateBmi } from "@/lib/calculations/bmi";

const DEFAULTS = { height: "170", weight: "70" };

export function BmiCalculatorForm() {
  const baseId = useId();
  const [height, setHeight] = useState(DEFAULTS.height);
  const [weight, setWeight] = useState(DEFAULTS.weight);
  const [submitted, setSubmitted] = useState(false);

  const heightN = Number(height);
  const weightN = Number(weight);

  const errors = useMemo(() => {
    const e: { height?: string; weight?: string } = {};
    if (height === "" || !Number.isFinite(heightN)) {
      e.height = "Geçerli boy girin (cm)";
    } else if (heightN < 100 || heightN > 250) {
      e.height = "Boy 100–250 cm arasında olmalı";
    }
    if (weight === "" || !Number.isFinite(weightN)) {
      e.weight = "Geçerli kilo girin (kg)";
    } else if (weightN < 30 || weightN > 300) {
      e.weight = "Kilo 30–300 kg arasında olmalı";
    }
    return e;
  }, [height, heightN, weight, weightN]);

  const result =
    submitted && !errors.height && !errors.weight
      ? calculateBmi(heightN, weightN)
      : null;

  return (
    <div className="flex flex-col gap-space-md">
      <CalcFormCard>
        <CalculatorDisclaimer className="mb-space-lg">
          Yetişkin bilgilendirme aracıdır. Sınıflar tanı değildir. Gebelik ve 18
          yaş altında kullanmayın. Veriler kaydedilmez.
        </CalculatorDisclaimer>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          noValidate
          className="grid grid-cols-1 gap-space-md sm:grid-cols-2"
        >
          <label className="flex flex-col gap-2 text-label-sm text-tertiary">
            Boy (cm)
            <input
              type="number"
              inputMode="decimal"
              min={100}
              max={250}
              step="any"
              value={height}
              onChange={(e) => {
                setHeight(e.target.value);
                setSubmitted(false);
              }}
              aria-invalid={submitted && !!errors.height}
              aria-describedby={
                submitted && errors.height ? `${baseId}-h-err` : undefined
              }
              className={fieldClass}
            />
            {submitted ? (
              <FieldError id={`${baseId}-h-err`} message={errors.height} />
            ) : null}
          </label>
          <label className="flex flex-col gap-2 text-label-sm text-tertiary">
            Kilo (kg)
            <input
              type="number"
              inputMode="decimal"
              min={30}
              max={300}
              step="any"
              value={weight}
              onChange={(e) => {
                setWeight(e.target.value);
                setSubmitted(false);
              }}
              aria-invalid={submitted && !!errors.weight}
              aria-describedby={
                submitted && errors.weight ? `${baseId}-w-err` : undefined
              }
              className={fieldClass}
            />
            {submitted ? (
              <FieldError id={`${baseId}-w-err`} message={errors.weight} />
            ) : null}
          </label>
          <div className="flex flex-wrap gap-space-sm sm:col-span-2">
            <Button type="submit">Hesapla</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setHeight(DEFAULTS.height);
                setWeight(DEFAULTS.weight);
                setSubmitted(false);
              }}
            >
              Sıfırla
            </Button>
          </div>
        </form>
      </CalcFormCard>

      {result ? (
        <div className="space-y-space-md">
          <ResultHero
            value={result.value.toFixed(1)}
            label={result.labelTr}
            hint="Formül: kg / m². Yaş bu formülde kullanılmaz."
          />
          <CalcFormCard>
            <RangeBar
              value={result.value}
              min={15}
              max={40}
              label={result.labelTr}
              segments={[
                { from: 15, to: 18.5, label: "<18,5" },
                { from: 18.5, to: 25, label: "18,5–24,9" },
                { from: 25, to: 30, label: "25–29,9" },
                { from: 30, to: 40, label: "≥30" },
              ]}
            />
          </CalcFormCard>
        </div>
      ) : null}
    </div>
  );
}
