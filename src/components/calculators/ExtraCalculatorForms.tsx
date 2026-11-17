"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { CalculatorDisclaimer } from "@/components/calculators/CalculatorDisclaimer";
import {
  FieldError,
  MetricTile,
  ResultHero,
  ResultPanel,
  choiceCardClass,
  fieldClass,
} from "@/components/calculators/field";
import { RangeBar } from "@/components/calculators/RangeBar";
import { parseLocaleNumber } from "@/lib/nutrition-tools/parse";
import { calculateWhtR } from "@/lib/calculations/whtr";
import { calculateWhr } from "@/lib/calculations/whr";
import { calculateReferenceWeightRange } from "@/lib/calculations/reference-weight";
import { calculateWeightChangePercent } from "@/lib/calculations/weight-change";
import { calculateFromMeasuredBodyFat } from "@/lib/calculations/body-composition";
import { calculateProteinNeed } from "@/lib/calculations/protein";
import { getWaterReference } from "@/lib/calculations/water";
import { getFiberReference } from "@/lib/calculations/fiber";
import { sodiumMgToSaltG, saltGToSodiumMg } from "@/lib/calculations/sodium-salt";
import { calculateGlycemicLoad } from "@/lib/calculations/glycemic";
import { kcalToKj, scalePer100g } from "@/lib/calculations/label-convert";
import { estimateRoughWeightChange } from "@/lib/calculations/weight-planner";
import { pregnancyTotalGainRange } from "@/lib/calculations/pregnancy-gain";
import { sumCarbohydrates } from "@/lib/calculations/carb-count";
import { calculateRecipeNutrition } from "@/lib/calculations/recipe-nutrition";
import { DRI_STAGE_LABELS, DRI_TABLE, type DriLifeStage } from "@/lib/nutrition-data/dri";
import { STATIC_FOODS, foodsRecord, searchFoods } from "@/lib/nutrition-data/foods";

function num(raw: string, min: number, max: number): string | null {
  const n = parseLocaleNumber(raw);
  if (n === null) return "Geçerli bir sayı girin";
  if (n < min || n > max) return `${min}–${max} aralığında olmalı`;
  return null;
}

export function WhtrForm() {
  const [waist, setWaist] = useState("80");
  const [height, setHeight] = useState("170");
  const [go, setGo] = useState(false);
  const eW = go ? num(waist, 40, 200) : null;
  const eH = go ? num(height, 100, 250) : null;
  const result =
    go && !eW && !eH
      ? calculateWhtR(parseLocaleNumber(waist)!, parseLocaleNumber(height)!)
      : null;
  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(e) => {
        e.preventDefault();
        setGo(true);
      }}
    >
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Bel çevresi (cm)
          <input
            className={fieldClass}
            value={waist}
            onChange={(e) => {
              setWaist(e.target.value);
              setGo(false);
            }}
          />
          <FieldError id="whtr-w" message={eW ?? undefined} />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Boy (cm)
          <input
            className={fieldClass}
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              setGo(false);
            }}
          />
          <FieldError id="whtr-h" message={eH ?? undefined} />
        </label>
      </div>
      <Button type="submit" className="w-fit">
        Hesapla
      </Button>
      {result ? (
        <div className="space-y-space-md">
          <ResultHero
            value={String(result.value)}
            label={result.labelTr}
            hint="Bel / boy (WHtR)"
          />
          <RangeBar
            value={result.value}
            min={0.3}
            max={0.7}
            label={result.labelTr}
          />
        </div>
      ) : null}
    </form>
  );
}

export function WhrForm() {
  const [waist, setWaist] = useState("80");
  const [hip, setHip] = useState("100");
  const [sex, setSex] = useState<"female" | "male">("female");
  const [go, setGo] = useState(false);
  const eW = go ? num(waist, 40, 200) : null;
  const eH = go ? num(hip, 50, 200) : null;
  const result =
    go && !eW && !eH
      ? calculateWhr(parseLocaleNumber(waist)!, parseLocaleNumber(hip)!, sex)
      : null;
  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(e) => {
        e.preventDefault();
        setGo(true);
      }}
    >
      <fieldset>
        <legend className="mb-space-xs text-label-sm text-tertiary">
          Cinsiyet (eşik için)
        </legend>
        <div className="flex flex-wrap gap-space-sm">
          <label className={choiceCardClass}>
            <input
              type="radio"
              checked={sex === "female"}
              onChange={() => setSex("female")}
            />
            Kadın
          </label>
          <label className={choiceCardClass}>
            <input
              type="radio"
              checked={sex === "male"}
              onChange={() => setSex("male")}
            />
            Erkek
          </label>
        </div>
      </fieldset>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Bel (cm)
          <input
            className={fieldClass}
            value={waist}
            onChange={(e) => {
              setWaist(e.target.value);
              setGo(false);
            }}
          />
          <FieldError id="whr-w" message={eW ?? undefined} />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Kalça (cm)
          <input
            className={fieldClass}
            value={hip}
            onChange={(e) => {
              setHip(e.target.value);
              setGo(false);
            }}
          />
          <FieldError id="whr-h" message={eH ?? undefined} />
        </label>
      </div>
      <Button type="submit" className="w-fit">
        Hesapla
      </Button>
      {result ? (
        <ResultHero
          value={String(result.value)}
          label={result.labelTr}
          hint="Bel / kalça (WHR)"
        />
      ) : null}
    </form>
  );
}

export function ReferenceWeightForm() {
  const [height, setHeight] = useState("170");
  const [go, setGo] = useState(false);
  const eH = go ? num(height, 100, 250) : null;
  const result =
    go && !eH ? calculateReferenceWeightRange(parseLocaleNumber(height)!) : null;
  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(e) => {
        e.preventDefault();
        setGo(true);
      }}
    >
      <label className="flex flex-col gap-2 text-label-sm text-tertiary">
        Boy (cm)
        <input
          className={fieldClass}
          value={height}
          onChange={(e) => {
            setHeight(e.target.value);
            setGo(false);
          }}
        />
        <FieldError id="rw-h" message={eH ?? undefined} />
      </label>
      <Button type="submit" className="w-fit">
        Hesapla
      </Button>
      {result ? (
        <ResultHero
          value={`${result.minKg}–${result.maxKg}`}
          unit="kg"
          label="Referans ağırlık aralığı (VKİ 18,5–24,9)"
          hint="Tek bir “ideal kilo” değildir; bilgilendirme aralığıdır."
        />
      ) : null}
    </form>
  );
}

export function WeightChangeForm() {
  const [start, setStart] = useState("75");
  const [curr, setCurr] = useState("72");
  const [involuntary, setInvoluntary] = useState(false);
  const [go, setGo] = useState(false);
  const eS = go ? num(start, 30, 400) : null;
  const eC = go ? num(curr, 30, 400) : null;
  const result =
    go && !eS && !eC
      ? calculateWeightChangePercent(
          parseLocaleNumber(start)!,
          parseLocaleNumber(curr)!,
        )
      : null;
  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(e) => {
        e.preventDefault();
        setGo(true);
      }}
    >
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Başlangıç (kg)
          <input
            className={fieldClass}
            value={start}
            onChange={(e) => {
              setStart(e.target.value);
              setGo(false);
            }}
          />
          <FieldError id="wc-s" message={eS ?? undefined} />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Güncel (kg)
          <input
            className={fieldClass}
            value={curr}
            onChange={(e) => {
              setCurr(e.target.value);
              setGo(false);
            }}
          />
          <FieldError id="wc-c" message={eC ?? undefined} />
        </label>
      </div>
      <label className={choiceCardClass}>
        <input
          type="checkbox"
          checked={involuntary}
          onChange={(e) => setInvoluntary(e.target.checked)}
        />
        Değişim istemsiz (bilinçli diyet değil)
      </label>
      <Button type="submit" className="w-fit">
        Hesapla
      </Button>
      {result ? (
        <div className="space-y-space-md">
          <ResultHero
            value={`${result.percent > 0 ? "+" : ""}${result.percent}`}
            unit="%"
            label="Ağırlık değişimi"
            hint={`${result.deltaKg} kg`}
          />
          {involuntary &&
          result.direction === "loss" &&
          Math.abs(result.percent) >= 5 ? (
            <CalculatorDisclaimer>
              Belirgin istemsiz kayıpta sağlık kuruluşuna başvurun. Bu ekran tanı
              koymaz.
            </CalculatorDisclaimer>
          ) : null}
        </div>
      ) : null}
    </form>
  );
}

export function BodyCompForm() {
  const [w, setW] = useState("70");
  const [h, setH] = useState("170");
  const [bf, setBf] = useState("25");
  const [go, setGo] = useState(false);
  const err = go
    ? num(w, 30, 300) || num(h, 100, 250) || num(bf, 3, 70)
    : null;
  const result =
    go && !err
      ? calculateFromMeasuredBodyFat(
          parseLocaleNumber(w)!,
          parseLocaleNumber(h)!,
          parseLocaleNumber(bf)!,
        )
      : null;
  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(e) => {
        e.preventDefault();
        setGo(true);
      }}
    >
      <p className="text-body-sm text-on-surface-variant">
        Yalnızca <strong>ölçülmüş</strong> yağ oranı girin. Tahmini model
        değildir.
      </p>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-3">
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Ağırlık (kg)
          <input
            className={fieldClass}
            value={w}
            onChange={(e) => {
              setW(e.target.value);
              setGo(false);
            }}
          />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Boy (cm)
          <input
            className={fieldClass}
            value={h}
            onChange={(e) => {
              setH(e.target.value);
              setGo(false);
            }}
          />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Ölçülmüş yağ %
          <input
            className={fieldClass}
            value={bf}
            onChange={(e) => {
              setBf(e.target.value);
              setGo(false);
            }}
          />
        </label>
      </div>
      <FieldError id="bc" message={err ?? undefined} />
      <Button type="submit" className="w-fit">
        Hesapla
      </Button>
      {result ? (
        <ResultPanel title="Kompozisyon">
          <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-3">
            <MetricTile
              label="Yağ kütlesi"
              value={String(result.fatMassKg)}
              unit="kg"
            />
            <MetricTile
              label="Yağsız kütle"
              value={String(result.fatFreeMassKg)}
              unit="kg"
            />
            <MetricTile label="FFMI" value={String(result.ffmi)} unit="kg/m²" />
          </div>
        </ResultPanel>
      ) : null}
    </form>
  );
}

export function ProteinForm() {
  const [w, setW] = useState("70");
  const [act, setAct] = useState<"sedentary" | "active" | "athlete">(
    "sedentary",
  );
  const [go, setGo] = useState(false);
  const e = go ? num(w, 30, 300) : null;
  const result =
    go && !e ? calculateProteinNeed(parseLocaleNumber(w)!, act) : null;
  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(ev) => {
        ev.preventDefault();
        setGo(true);
      }}
    >
      <label className="flex flex-col gap-2 text-label-sm text-tertiary">
        Ağırlık (kg)
        <input
          className={fieldClass}
          value={w}
          onChange={(e) => {
            setW(e.target.value);
            setGo(false);
          }}
        />
        <FieldError id="p" message={e ?? undefined} />
      </label>
      <label className="flex flex-col gap-2 text-label-sm text-tertiary">
        Durum
        <select
          className={fieldClass}
          value={act}
          onChange={(e) => setAct(e.target.value as typeof act)}
        >
          <option value="sedentary">Genel / hareketsiz (0,8–1,0 g/kg)</option>
          <option value="active">Aktif (1,2–1,6 g/kg)</option>
          <option value="athlete">Sporcu bandı (1,4–2,0 g/kg)</option>
        </select>
      </label>
      <Button type="submit" className="w-fit">
        Hesapla
      </Button>
      {result ? (
        <ResultHero
          value={`${result.gramsMin}–${result.gramsMax}`}
          unit="g/gün"
          label="Protein (bilgilendirme)"
        />
      ) : null}
    </form>
  );
}

export function WaterForm() {
  const [sex, setSex] = useState<"female" | "male">("female");
  const [extra, setExtra] = useState(false);
  const result = getWaterReference(sex, extra);
  return (
    <div className="flex flex-col gap-space-md">
      <fieldset>
        <legend className="mb-space-xs text-label-sm text-tertiary">
          Cinsiyet
        </legend>
        <div className="flex flex-wrap gap-space-sm">
          <label className={choiceCardClass}>
            <input
              type="radio"
              checked={sex === "female"}
              onChange={() => setSex("female")}
            />
            Kadın
          </label>
          <label className={choiceCardClass}>
            <input
              type="radio"
              checked={sex === "male"}
              onChange={() => setSex("male")}
            />
            Erkek
          </label>
        </div>
      </fieldset>
      <label className={choiceCardClass}>
        <input
          type="checkbox"
          checked={extra}
          onChange={(e) => setExtra(e.target.checked)}
        />
        Yoğun aktivite / sıcak ortam
      </label>
      <ResultHero
        value={String(result.aiLiters)}
        unit="L/gün"
        label="EFSA toplam su AI (yaklaşık)"
        hint={result.noteTr}
      />
    </div>
  );
}

export function FiberForm() {
  const r = getFiberReference();
  return (
    <ResultHero
      value={`${r.minG}–${r.maxG}`}
      unit="g/gün"
      label="Lif referansı"
      hint={r.noteTr}
    />
  );
}

export function DriForm() {
  const [stage, setStage] = useState<DriLifeStage>("adult_female");
  return (
    <div className="flex flex-col gap-space-md">
      <label className="flex flex-col gap-2 text-label-sm text-tertiary">
        Yaşam evresi
        <select
          className={fieldClass}
          value={stage}
          onChange={(e) => setStage(e.target.value as DriLifeStage)}
        >
          {Object.entries(DRI_STAGE_LABELS).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <div className="overflow-x-auto rounded-2xl border border-outline-variant/25 bg-surface-container-lowest/80">
        <table className="w-full text-left text-body-sm">
          <thead>
            <tr className="border-b border-outline-variant/30 text-label-sm text-tertiary">
              <th className="px-space-md py-space-sm">Besin</th>
              <th className="px-space-md py-space-sm">Tür</th>
              <th className="px-space-md py-space-sm">Değer</th>
            </tr>
          </thead>
          <tbody>
            {DRI_TABLE.map((n) => (
              <tr
                key={n.id}
                className="border-t border-outline-variant/20 odd:bg-primary/[0.03]"
              >
                <td className="px-space-md py-space-sm">{n.nameTr}</td>
                <td className="px-space-md py-space-sm text-on-surface-variant">
                  {n.type}
                </td>
                <td className="px-space-md py-space-sm font-medium text-primary">
                  {n.values[stage] ?? "—"} {n.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CalculatorDisclaimer>
        Takviye veya tedavi dozu değildir. UL (üst sınır) aşımı riskine dikkat
        edin.
      </CalculatorDisclaimer>
    </div>
  );
}

export function WeightPlannerForm() {
  const [cur, setCur] = useState("80");
  const [tgt, setTgt] = useState("75");
  const [tdee, setTdee] = useState("2200");
  const [intake, setIntake] = useState("1800");
  const [days, setDays] = useState("90");
  const [pregnant, setPregnant] = useState(false);
  const [go, setGo] = useState(false);

  if (pregnant) {
    return (
      <CalculatorDisclaimer>
        Gebelikte zayıflama hedefi sunulmaz. Gebelik kilo aracını veya
        hekiminizi kullanın.
      </CalculatorDisclaimer>
    );
  }

  const result = go
    ? estimateRoughWeightChange({
        currentKg: parseLocaleNumber(cur) ?? 0,
        targetKg: parseLocaleNumber(tgt) ?? 0,
        tdeeKcal: parseLocaleNumber(tdee) ?? 0,
        dailyIntakeKcal: parseLocaleNumber(intake) ?? 0,
        days: parseLocaleNumber(days) ?? 0,
      })
    : null;

  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(e) => {
        e.preventDefault();
        setGo(true);
      }}
    >
      <label className={choiceCardClass}>
        <input
          type="checkbox"
          checked={pregnant}
          onChange={(e) => setPregnant(e.target.checked)}
        />
        Gebelik / emzirme
      </label>
      <div className="grid gap-space-md sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Güncel kg
          <input
            className={fieldClass}
            value={cur}
            onChange={(e) => {
              setCur(e.target.value);
              setGo(false);
            }}
          />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Hedef kg
          <input
            className={fieldClass}
            value={tgt}
            onChange={(e) => {
              setTgt(e.target.value);
              setGo(false);
            }}
          />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Tahmini TDEE (kcal)
          <input
            className={fieldClass}
            value={tdee}
            onChange={(e) => {
              setTdee(e.target.value);
              setGo(false);
            }}
          />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Günlük alım (kcal)
          <input
            className={fieldClass}
            value={intake}
            onChange={(e) => {
              setIntake(e.target.value);
              setGo(false);
            }}
          />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary sm:col-span-2">
          Süre (gün)
          <input
            className={fieldClass}
            value={days}
            onChange={(e) => {
              setDays(e.target.value);
              setGo(false);
            }}
          />
        </label>
      </div>
      <Button type="submit" className="w-fit">
        Yardımcı tahmini göster
      </Button>
      <p className="text-body-sm text-on-surface-variant">
        Dinamik NIH modeli bu sitede doğrulanıp açılmamıştır. Resmi araç:{" "}
        <a
          className="text-primary underline"
          href="https://www.niddk.nih.gov/bwp"
          target="_blank"
          rel="noopener noreferrer"
        >
          NIDDK Body Weight Planner
        </a>
      </p>
      {result ? (
        <ResultPanel title="Kaba yardımcı (garanti yok)">
          <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
            <MetricTile
              label="Hedef farkı"
              value={String(result.deltaKgGoal)}
              unit="kg"
            />
            <MetricTile
              label="Günlük enerji farkı"
              value={String(result.dailyDeficitKcal)}
              unit="kcal"
            />
            {result.safe ? (
              <MetricTile
                label="Kaba projeksiyon"
                value={String(result.roughProjectedDeltaKg)}
                unit="kg"
              />
            ) : null}
          </div>
          <p className="mt-space-md text-body-sm text-on-surface-variant">
            {result.noteTr}
          </p>
        </ResultPanel>
      ) : null}
    </form>
  );
}

export function SodiumForm() {
  const [mode, setMode] = useState<"na" | "salt">("na");
  const [val, setVal] = useState("2000");
  const [go, setGo] = useState(false);
  const n = parseLocaleNumber(val);
  const out =
    go && n !== null
      ? mode === "na"
        ? sodiumMgToSaltG(n)
        : saltGToSodiumMg(n)
      : null;
  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(e) => {
        e.preventDefault();
        setGo(true);
      }}
    >
      <label className="flex flex-col gap-2 text-label-sm text-tertiary">
        Dönüşüm
        <select
          className={fieldClass}
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as "na" | "salt");
            setGo(false);
          }}
        >
          <option value="na">Sodyum (mg) → tuz (g)</option>
          <option value="salt">Tuz (g) → sodyum (mg)</option>
        </select>
      </label>
      <label className="flex flex-col gap-2 text-label-sm text-tertiary">
        Değer
        <input
          className={fieldClass}
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setGo(false);
          }}
        />
      </label>
      <Button type="submit" className="w-fit">
        Dönüştür
      </Button>
      {out !== null ? (
        <ResultHero
          value={String(out)}
          unit={mode === "na" ? "g tuz" : "mg sodyum"}
          label="Dönüşüm sonucu"
        />
      ) : null}
    </form>
  );
}

export function GlycemicForm() {
  const [gi, setGi] = useState("55");
  const [carb, setCarb] = useState("30");
  const [go, setGo] = useState(false);
  const result = go
    ? calculateGlycemicLoad(
        parseLocaleNumber(gi) ?? -1,
        parseLocaleNumber(carb) ?? -1,
      )
    : null;
  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(e) => {
        e.preventDefault();
        setGo(true);
      }}
    >
      <p className="text-body-sm text-on-surface-variant">
        Yalnızca bilinen GI girin; bilinmeyen değeri uydurmayın.
      </p>
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          GI
          <input
            className={fieldClass}
            value={gi}
            onChange={(e) => {
              setGi(e.target.value);
              setGo(false);
            }}
          />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Kullanılabilir CHO (g)
          <input
            className={fieldClass}
            value={carb}
            onChange={(e) => {
              setCarb(e.target.value);
              setGo(false);
            }}
          />
        </label>
      </div>
      <Button type="submit" className="w-fit">
        Hesapla
      </Button>
      {result ? (
        <ResultHero
          value={String(result.gl)}
          label={result.labelTr}
          hint="Glisemik yük (GL)"
        />
      ) : go ? (
        <FieldError id="gl" message="Geçersiz girdi" />
      ) : null}
    </form>
  );
}

export function LabelForm() {
  const [kcal, setKcal] = useState("250");
  const [per100, setPer100] = useState("250");
  const [grams, setGrams] = useState("50");
  const kj = kcalToKj(parseLocaleNumber(kcal) ?? -1);
  const scaled = scalePer100g(
    parseLocaleNumber(per100) ?? -1,
    parseLocaleNumber(grams) ?? -1,
  );
  return (
    <div className="flex flex-col gap-space-md">
      <label className="flex flex-col gap-2 text-label-sm text-tertiary">
        kcal → kJ
        <input
          className={fieldClass}
          value={kcal}
          onChange={(e) => setKcal(e.target.value)}
        />
      </label>
      {kj !== null ? (
        <ResultHero value={String(kj)} unit="kJ" label="Enerji dönüşümü" />
      ) : null}
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          100 g değeri
          <input
            className={fieldClass}
            value={per100}
            onChange={(e) => setPer100(e.target.value)}
          />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Porsiyon (g)
          <input
            className={fieldClass}
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
        </label>
      </div>
      {scaled !== null ? (
        <ResultHero
          value={String(scaled)}
          label="Porsiyon değeri"
          hint={`${grams} g için ölçeklenmiş`}
        />
      ) : null}
    </div>
  );
}

export function CarbCountForm() {
  const [rows, setRows] = useState("Ekmek,30\nPirinç,40");
  const [go, setGo] = useState(false);
  const items = useMemo(() => {
    return rows
      .split("\n")
      .map((line) => {
        const [name, g] = line.split(",");
        return {
          name: (name ?? "").trim(),
          carbG: parseLocaleNumber((g ?? "").trim()) ?? NaN,
        };
      })
      .filter((x) => x.name);
  }, [rows]);
  const total = go ? sumCarbohydrates(items) : null;
  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(e) => {
        e.preventDefault();
        setGo(true);
      }}
    >
      <CalculatorDisclaimer>İnsülin dozu hesaplanmaz.</CalculatorDisclaimer>
      <label className="flex flex-col gap-2 text-label-sm text-tertiary">
        Satır: ad,karbonhidrat_g
        <textarea
          className={fieldClass}
          rows={5}
          value={rows}
          onChange={(e) => {
            setRows(e.target.value);
            setGo(false);
          }}
        />
      </label>
      <Button type="submit" className="w-fit">
        Topla
      </Button>
      {total !== null ? (
        <ResultHero value={String(total)} unit="g" label="Toplam CHO" />
      ) : go ? (
        <FieldError id="carb" message="Geçersiz satır" />
      ) : null}
    </form>
  );
}

export function FoodSearchForm() {
  const [q, setQ] = useState("");
  const [grams, setGrams] = useState("100");
  const foods = searchFoods(q);
  const g = parseLocaleNumber(grams) ?? 100;
  return (
    <div className="flex flex-col gap-space-md">
      <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Ara
          <input
            className={fieldClass}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ör. yoğurt, mercimek…"
          />
        </label>
        <label className="flex flex-col gap-2 text-label-sm text-tertiary">
          Gram
          <input
            className={fieldClass}
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
        </label>
      </div>
      <ul className="space-y-space-sm">
        {foods.map((f) => {
          const factor = g / 100;
          return (
            <li
              key={f.id}
              className="rounded-2xl border border-outline-variant/25 bg-surface-container-lowest/80 p-space-md transition-colors hover:border-primary/20"
            >
              <strong className="text-on-surface">{f.nameTr}</strong>
              <div className="mt-space-sm grid grid-cols-2 gap-space-xs sm:grid-cols-4">
                <MetricTile
                  label="Enerji"
                  value={String(Math.round(f.kcal * factor))}
                  unit="kcal"
                />
                <MetricTile
                  label="Protein"
                  value={String(Math.round(f.proteinG * factor * 10) / 10)}
                  unit="g"
                />
                <MetricTile
                  label="CHO"
                  value={String(Math.round(f.carbG * factor * 10) / 10)}
                  unit="g"
                />
                <MetricTile
                  label="Yağ"
                  value={String(Math.round(f.fatG * factor * 10) / 10)}
                  unit="g"
                />
              </div>
              <p className="mt-space-sm text-body-sm text-on-surface-variant">
                {f.sourceNote}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function RecipeNutritionForm() {
  const [servings, setServings] = useState("4");
  const [lines, setLines] = useState(
    () => STATIC_FOODS.slice(0, 3).map((f) => `${f.id},100`).join("\n"),
  );
  const [go, setGo] = useState(false);
  const parsed = lines
    .split("\n")
    .map((l) => {
      const [id, g] = l.split(",");
      return {
        foodId: (id ?? "").trim(),
        grams: parseLocaleNumber((g ?? "").trim()) ?? 0,
      };
    })
    .filter((x) => x.foodId);
  const result = go
    ? calculateRecipeNutrition(
        parsed,
        foodsRecord(),
        parseLocaleNumber(servings) ?? 0,
      )
    : null;
  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(e) => {
        e.preventDefault();
        setGo(true);
      }}
    >
      <p className="text-body-sm text-on-surface-variant">
        Satır: foodId,gram — id listesi:{" "}
        {STATIC_FOODS.map((f) => f.id).join(", ")}
      </p>
      <textarea
        className={fieldClass}
        rows={5}
        value={lines}
        onChange={(e) => {
          setLines(e.target.value);
          setGo(false);
        }}
      />
      <label className="flex flex-col gap-2 text-label-sm text-tertiary">
        Porsiyon
        <input
          className={fieldClass}
          value={servings}
          onChange={(e) => {
            setServings(e.target.value);
            setGo(false);
          }}
        />
      </label>
      <Button type="submit" className="w-fit">
        Hesapla
      </Button>
      {result ? (
        <ResultPanel title="Porsiyon başına">
          <div className="grid grid-cols-2 gap-space-sm sm:grid-cols-3">
            <MetricTile
              label="Enerji"
              value={String(result.perServing.kcal)}
              unit="kcal"
            />
            <MetricTile
              label="Protein"
              value={String(result.perServing.proteinG)}
              unit="g"
            />
            <MetricTile
              label="CHO"
              value={String(result.perServing.carbG)}
              unit="g"
            />
            <MetricTile
              label="Yağ"
              value={String(result.perServing.fatG)}
              unit="g"
            />
            <MetricTile
              label="Lif"
              value={String(result.perServing.fiberG)}
              unit="g"
            />
            <MetricTile
              label="Sodyum"
              value={String(result.perServing.sodiumMg)}
              unit="mg"
            />
          </div>
        </ResultPanel>
      ) : go ? (
        <FieldError id="rn" message="Geçersiz malzeme veya porsiyon" />
      ) : null}
    </form>
  );
}

export function PlateForm() {
  return (
    <div>
      <div className="mx-auto grid max-w-sm grid-cols-2 gap-2 overflow-hidden rounded-[2rem]">
        <div className="col-span-2 bg-primary/15 px-space-lg py-space-xl text-center">
          <p className="font-display text-headline-sm text-primary">½</p>
          <p className="mt-1 text-label-md text-on-surface">Sebze & meyve</p>
        </div>
        <div className="bg-secondary-container/45 px-space-md py-space-lg text-center">
          <p className="font-display text-headline-sm text-secondary">¼</p>
          <p className="mt-1 text-label-md text-on-surface">Tahıl / nişasta</p>
        </div>
        <div className="bg-tertiary-fixed/55 px-space-md py-space-lg text-center">
          <p className="font-display text-headline-sm text-tertiary">¼</p>
          <p className="mt-1 text-label-md text-on-surface">Protein</p>
        </div>
      </div>
      <p className="mt-space-md text-body-sm text-on-surface-variant">
        Tabak yöntemi bilgilendirme şablonudur; kişiye özel tedavi planı
        değildir.
      </p>
    </div>
  );
}

export function PregnancyForm() {
  const [bmi, setBmi] = useState("22");
  const [go, setGo] = useState(false);
  const result = go
    ? pregnancyTotalGainRange(parseLocaleNumber(bmi) ?? -1)
    : null;
  return (
    <form
      className="flex flex-col gap-space-md"
      onSubmit={(e) => {
        e.preventDefault();
        setGo(true);
      }}
    >
      <CalculatorDisclaimer>
        Gebelikte kilo verme önerisi üretilmez. Hekim takibi esastır.
      </CalculatorDisclaimer>
      <label className="flex flex-col gap-2 text-label-sm text-tertiary">
        Gebelik öncesi VKİ
        <input
          className={fieldClass}
          value={bmi}
          onChange={(e) => {
            setBmi(e.target.value);
            setGo(false);
          }}
        />
      </label>
      <Button type="submit" className="w-fit">
        Göster
      </Button>
      {result ? (
        <ResultHero
          value={result.labelTr}
          label="IOM toplam kazanım (tekil)"
        />
      ) : go ? (
        <FieldError id="pg" message="Geçersiz VKİ" />
      ) : null}
    </form>
  );
}

export function NrsForm() {
  const [items, setItems] = useState({
    bmi: false,
    loss: false,
    intake: false,
    severe: false,
  });
  const score = Object.values(items).filter(Boolean).length;
  return (
    <div className="flex flex-col gap-space-md">
      <CalculatorDisclaimer>
        Eğitimsel özet; resmi NRS-2002 formunun ve kurum protokolünün yerine
        geçmez. Otomatik tanı yoktur.
      </CalculatorDisclaimer>
      {(
        [
          ["bmi", "Düşük BMI veya zayıf görünüm (eğitim kutusu)"],
          ["loss", "Son dönemde istemsiz kilo kaybı"],
          ["intake", "Azalmış gıda alımı"],
          ["severe", "Ciddi hastalık şiddeti"],
        ] as const
      ).map(([k, label]) => (
        <label key={k} className={choiceCardClass}>
          <input
            type="checkbox"
            checked={items[k]}
            onChange={(e) =>
              setItems((s) => ({ ...s, [k]: e.target.checked }))
            }
          />
          {label}
        </label>
      ))}
      <ResultHero
        value={`${score} / 4`}
        label="İşaretlenen madde sayısı (eğitim)"
        hint="Klinik kararı bu sayıya indirgemeyin."
      />
    </div>
  );
}

export function GlimForm() {
  const [pheno, setPheno] = useState({
    loss: false,
    lowBmi: false,
    lowMuscle: false,
  });
  const [etio, setEtio] = useState({ intake: false, inflammation: false });
  const hasPheno = Object.values(pheno).some(Boolean);
  const hasEtio = Object.values(etio).some(Boolean);
  return (
    <div className="flex flex-col gap-space-md">
      <CalculatorDisclaimer>
        GLIM eğitim checklist’i. Otomatik tanı değildir.
      </CalculatorDisclaimer>
      <h3 className="text-label-sm font-bold uppercase tracking-wider text-tertiary">
        Fenotipik
      </h3>
      {(
        [
          ["loss", "İstemsiz kilo kaybı"],
          ["lowBmi", "Düşük BMI"],
          ["lowMuscle", "Azalmış kas kütlesi"],
        ] as const
      ).map(([k, l]) => (
        <label key={k} className={choiceCardClass}>
          <input
            type="checkbox"
            checked={pheno[k]}
            onChange={(e) =>
              setPheno((s) => ({ ...s, [k]: e.target.checked }))
            }
          />
          {l}
        </label>
      ))}
      <h3 className="mt-space-sm text-label-sm font-bold uppercase tracking-wider text-tertiary">
        Etiyolojik
      </h3>
      {(
        [
          ["intake", "Azalmış alım / emilim"],
          ["inflammation", "İnflamasyon / hastalık yükü"],
        ] as const
      ).map(([k, l]) => (
        <label key={k} className={choiceCardClass}>
          <input
            type="checkbox"
            checked={etio[k]}
            onChange={(e) =>
              setEtio((s) => ({ ...s, [k]: e.target.checked }))
            }
          />
          {l}
        </label>
      ))}
      <ResultPanel title="Eğitim özeti">
        <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-2">
          <MetricTile
            label="Fenotip"
            value={hasPheno ? "En az bir" : "Yok"}
          />
          <MetricTile
            label="Etiyoloji"
            value={hasEtio ? "En az bir" : "Yok"}
          />
        </div>
        <p className="mt-space-md text-body-sm text-on-surface-variant">
          Konsensüse göre her iki kategoriden kriter birlikteliği klinik
          değerlendirme bağlamında tartışılır — bu ekran tanı koymaz.
        </p>
      </ResultPanel>
    </div>
  );
}
