"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { calculateBmi } from "@/lib/calculations/bmi";
import { cn } from "@/lib/cn";
import { buildWhatsAppLink } from "@/lib/whatsapp";

type GoalId = "kilo" | "sindirim" | "spor" | "genel";

const goals: Array<{
  id: GoalId;
  title: string;
  subtitle: string;
  note: string;
}> = [
  {
    id: "kilo",
    title: "Kilo yönetimi",
    subtitle: "Dengeli alışkanlıklar",
    note: "Boy ve kiloya göre VKİ bilgilendirmesi; kişisel diyet reçetesi değildir.",
  },
  {
    id: "sindirim",
    title: "Sindirim & rahatlık",
    subtitle: "Genel bilgilendirme",
    note: "Semptomlar için hekim değerlendirmesi gerekebilir; bu araç teşhis koymaz.",
  },
  {
    id: "spor",
    title: "Spor & enerji",
    subtitle: "Aktiviteye uygun çerçeve",
    note: "Enerji ihtiyacı için ayrı hesaplayıcıyı kullanabilirsiniz.",
  },
  {
    id: "genel",
    title: "Genel sağlık",
    subtitle: "Sürdürülebilir beslenme",
    note: "Sonuçlar yalnızca bilgilendirme amaçlıdır; tıbbi tavsiye yerine geçmez.",
  },
];

type Props = {
  whatsappE164?: string | null;
};

export function QuickBmiWidget({ whatsappE164 = null }: Props) {
  const [height, setHeight] = useState("168");
  const [weight, setWeight] = useState("68");
  const [goalId, setGoalId] = useState<GoalId>("kilo");
  const wa = buildWhatsAppLink(whatsappE164);

  const bmi = useMemo(
    () => calculateBmi(Number(height), Number(weight)),
    [height, weight],
  );
  const goal = goals.find((g) => g.id === goalId) ?? goals[0];

  return (
    <section
      id="hizli-olcum"
      className="w-full bg-surface-container-low py-space-xl shadow-sm"
      aria-labelledby="bmi-heading"
    >
      <Container>
        <div className="rounded-3xl bg-surface-container-lowest p-space-md shadow-md md:p-space-xl">
          <div className="mx-auto mb-space-lg flex max-w-3xl flex-col gap-space-xs text-center">
            <span className="text-label-sm font-bold uppercase tracking-widest text-primary">
              Bilgilendirme aracı
            </span>
            <h2 id="bmi-heading" className="text-headline-lg text-on-surface">
              Hızlı VKİ tahmini
            </h2>
            <p className="text-body-md text-on-surface-variant">
              Veriler tarayıcınızda kalır; kaydedilmez. Sonuç teşhis veya tedavi
              önerisi değildir.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
            <div className="flex flex-col gap-space-sm lg:col-span-5">
              <span className="text-label-md font-semibold text-on-surface-variant">
                1. Odak alanınızı seçin
              </span>
              <div role="radiogroup" aria-label="Odak alanı" className="space-y-space-sm">
                {goals.map((g) => {
                  const selected = g.id === goalId;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => setGoalId(g.id)}
                      className={cn(
                        "flex w-full items-start gap-space-sm rounded-2xl p-space-md text-left transition-colors",
                        selected
                          ? "bg-surface-container shadow-sm"
                          : "bg-surface-container-low hover:bg-surface-container",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-1 h-3 w-3 shrink-0 rounded-full border-2",
                          selected
                            ? "border-primary bg-primary"
                            : "border-outline",
                        )}
                        aria-hidden
                      />
                      <span className="flex flex-col">
                        <span className="text-headline-sm text-on-surface">
                          {g.title}
                        </span>
                        <span className="text-body-sm text-on-surface-variant">
                          {g.subtitle}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-space-md rounded-2xl bg-surface-container p-space-lg lg:col-span-7">
              <div>
                <span className="text-label-md font-semibold text-on-surface-variant">
                  2. Boy ve kilo
                </span>
                <div className="mt-space-sm grid grid-cols-1 gap-space-sm sm:grid-cols-2">
                  <label className="flex flex-col gap-1 text-label-sm text-on-surface">
                    Boy (cm)
                    <input
                      type="number"
                      inputMode="decimal"
                      min={100}
                      max={250}
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/40"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-label-sm text-on-surface">
                    Kilo (kg)
                    <input
                      type="number"
                      inputMode="decimal"
                      min={30}
                      max={300}
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/40"
                    />
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-space-xs rounded-2xl bg-surface-container-lowest p-space-md shadow-sm">
                <div className="flex items-center justify-between gap-space-sm">
                  <span className="text-label-md text-tertiary">VKİ sonucu</span>
                  <span className="rounded-full bg-primary-fixed px-space-sm py-space-xs text-label-sm font-semibold text-on-primary-fixed">
                    {goal.title}
                  </span>
                </div>
                {bmi ? (
                  <>
                    <div className="flex items-baseline gap-space-sm">
                      <span className="font-display text-display leading-none text-primary">
                        {bmi.value.toFixed(1)}
                      </span>
                      <span className="text-headline-sm text-on-surface-variant">
                        {bmi.labelTr}
                      </span>
                    </div>
                    <p className="text-body-sm text-on-surface-variant">
                      {goal.note}
                    </p>
                  </>
                ) : (
                  <p className="text-body-sm text-error">
                    Geçerli boy (100–250 cm) ve kilo (30–300 kg) girin.
                  </p>
                )}
              </div>

              <div className="flex flex-col items-stretch justify-between gap-space-sm sm:flex-row sm:items-center">
                <p className="text-label-sm text-on-surface-variant">
                  Ayrıntılı araçlar:{" "}
                  <Link href="/hesaplayicilar/vki" className="text-primary underline">
                    VKİ
                  </Link>
                  ,{" "}
                  <Link
                    href="/hesaplayicilar/enerji"
                    className="text-primary underline"
                  >
                    enerji
                  </Link>
                </p>
                {wa.ready ? (
                  <Button href={wa.href} target="_blank" rel="noopener noreferrer">
                    WhatsApp ile sor
                  </Button>
                ) : (
                  <Button disabled variant="secondary">
                    WhatsApp yakında
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
