"use client";

import { useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorDisclaimer } from "@/components/calculators/CalculatorDisclaimer";
import {
  CalcFormCard,
  FieldError,
  ResultHero,
  ResultPanel,
  choiceCardClass,
  fieldClass,
} from "@/components/calculators/field";
import {
  ACTIVITY_FACTORS,
  calculateMifflinStJeor,
  calculateTdee,
  type ActivityLevelId,
  type FormulaSex,
} from "@/lib/calculations/energy";

const DEFAULTS = {
  weight: "70",
  height: "170",
  age: "30",
  sex: "male" as FormulaSex,
  activity: "moderate" as ActivityLevelId,
};

export function EnergyCalculatorForm() {
  const baseId = useId();
  const [weight, setWeight] = useState(DEFAULTS.weight);
  const [height, setHeight] = useState(DEFAULTS.height);
  const [age, setAge] = useState(DEFAULTS.age);
  const [sex, setSex] = useState<FormulaSex>(DEFAULTS.sex);
  const [activity, setActivity] = useState<ActivityLevelId>(DEFAULTS.activity);
  const [submitted, setSubmitted] = useState(false);

  const weightN = Number(weight);
  const heightN = Number(height);
  const ageN = Number(age);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (weight === "" || !Number.isFinite(weightN) || weightN < 30 || weightN > 300) {
      e.weight = "Kilo 30–300 kg olmalı";
    }
    if (height === "" || !Number.isFinite(heightN) || heightN < 100 || heightN > 250) {
      e.height = "Boy 100–250 cm olmalı";
    }
    if (age === "" || !Number.isFinite(ageN) || ageN < 18 || ageN > 100) {
      e.age = "Yaş 18–100 olmalı (18 altı için bu araç uygun değildir)";
    }
    return e;
  }, [weight, weightN, height, heightN, age, ageN]);

  const rmr =
    submitted && Object.keys(errors).length === 0
      ? calculateMifflinStJeor({
          weightKg: weightN,
          heightCm: heightN,
          ageYears: ageN,
          sex,
        })
      : null;
  const tdee = rmr ? calculateTdee(rmr.rmrKcal, activity) : null;
  const activityRow = ACTIVITY_FACTORS.find((a) => a.id === activity);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  function onReset() {
    setWeight(DEFAULTS.weight);
    setHeight(DEFAULTS.height);
    setAge(DEFAULTS.age);
    setSex(DEFAULTS.sex);
    setActivity(DEFAULTS.activity);
    setSubmitted(false);
  }

  return (
    <div className="flex flex-col gap-space-md">
      <CalcFormCard>
      <CalculatorDisclaimer className="mb-space-lg">
        Mifflin–St Jeor tahmini dinlenme enerjisi (RMR) ve aktivite çarpanlı TDEE.
        Gebelik, emzirme, 18 yaş altı ve özel klinik durumlarda genel hesaplayıcı
        uygun değildir. Sonuç kişiye özel program veya reçete değildir. Veriler
        kaydedilmez.
      </CalculatorDisclaimer>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-space-md">
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
          <label className="flex flex-col gap-1 text-label-sm">
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
                submitted && errors.weight ? `${baseId}-w` : undefined
              }
              className={fieldClass}
            />
            {submitted ? (
              <FieldError id={`${baseId}-w`} message={errors.weight} />
            ) : null}
          </label>
          <label className="flex flex-col gap-1 text-label-sm">
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
                submitted && errors.height ? `${baseId}-h` : undefined
              }
              className={fieldClass}
            />
            {submitted ? (
              <FieldError id={`${baseId}-h`} message={errors.height} />
            ) : null}
          </label>
          <label className="flex flex-col gap-1 text-label-sm">
            Yaş (yıl)
            <input
              type="number"
              inputMode="numeric"
              min={18}
              max={100}
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                setSubmitted(false);
              }}
              aria-invalid={submitted && !!errors.age}
              aria-describedby={
                submitted && errors.age ? `${baseId}-a` : undefined
              }
              className={fieldClass}
            />
            {submitted ? (
              <FieldError id={`${baseId}-a`} message={errors.age} />
            ) : null}
          </label>
        </div>

        <fieldset>
          <legend className="text-label-sm">
            Formüldeki cinsiyet parametresi (Mifflin–St Jeor sabiti)
          </legend>
          <p className="mb-space-xs text-body-sm text-on-surface-variant">
            Erkek sabiti +5, kadın sabiti −161. Kimlik beyanı değildir; formül
            girdisidir.
          </p>
          <div className="flex flex-wrap gap-space-sm">
            <label className={choiceCardClass}>
              <input
                type="radio"
                name="sex"
                checked={sex === "male"}
                onChange={() => {
                  setSex("male");
                  setSubmitted(false);
                }}
              />
              Erkek (+5)
            </label>
            <label className={choiceCardClass}>
              <input
                type="radio"
                name="sex"
                checked={sex === "female"}
                onChange={() => {
                  setSex("female");
                  setSubmitted(false);
                }}
              />
              Kadın (−161)
            </label>
          </div>
        </fieldset>

        <label className="flex flex-col gap-1 text-label-sm">
          Aktivite çarpanı (TDEE = RMR × çarpan)
          <select
            value={activity}
            onChange={(e) => {
              setActivity(e.target.value as ActivityLevelId);
              setSubmitted(false);
            }}
            className={fieldClass}
          >
            {ACTIVITY_FACTORS.map((a) => (
              <option key={a.id} value={a.id}>
                {a.labelTr} — {a.descriptionTr}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap gap-space-sm">
          <Button type="submit">Hesapla</Button>
          <Button type="button" variant="secondary" onClick={onReset}>
            Sıfırla
          </Button>
        </div>
      </form>
      </CalcFormCard>

      {rmr && tdee != null && activityRow ? (
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
          <ResultHero
            value={rmr.rmrKcal.toFixed(0)}
            unit="kcal"
            label="RMR (tahmini dinlenme)"
            hint={`10×kg + 6,25×cm − 5×yaş + (${rmr.formulaSexConstant})`}
          />
          <ResultPanel title="TDEE (tahmini)">
            <p className="font-display text-[clamp(2.5rem,6vw,3.5rem)] leading-none text-primary">
              {tdee.toFixed(0)}
            </p>
            <p className="mt-space-sm text-body-sm text-on-surface-variant">
              {rmr.rmrKcal.toFixed(0)} × {activityRow.factor} · {activityRow.labelTr}
            </p>
          </ResultPanel>
        </div>
      ) : null}
    </div>
  );
}
