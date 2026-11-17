import Link from "next/link";
import { CalculatorDisclaimer } from "@/components/calculators/CalculatorDisclaimer";
import { ContactChannels } from "@/components/site/ContactChannels";
import { Container } from "@/components/ui/Container";
import type { ContactSettingsInput } from "@/components/site/ContactChannels";
import { getToolBySlug } from "@/lib/nutrition-tools/registry";
import type { NutritionTool } from "@/lib/nutrition-tools/types";
import { cn } from "@/lib/cn";

type Props = {
  tool: NutritionTool;
  settings: ContactSettingsInput;
  children: React.ReactNode;
};

const groupTone: Record<string, string> = {
  A: "from-primary/12 via-background to-background",
  B: "from-tertiary/15 via-background to-background",
  C: "from-secondary/10 via-background to-background",
  D: "from-outline/15 via-background to-background",
};

export function CalculatorShell({ tool, settings, children }: Props) {
  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-b",
        groupTone[tool.group] ?? "from-surface-container-low to-background",
      )}
    >
      <div
        className="pointer-events-none absolute -left-24 top-0 h-64 w-64 rounded-full bg-primary-fixed/30 blur-3xl motion-reduce:hidden"
        aria-hidden
      />
      <Container className="relative py-space-xl">
        <Link
          href="/hesaplayicilar"
          className="text-label-md text-primary transition-opacity hover:opacity-80"
        >
          ← Tüm hesaplayıcılar
        </Link>

        <header className="mt-space-lg max-w-3xl">
          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="rounded-full bg-primary/10 px-space-md py-1 text-label-sm font-bold uppercase tracking-[0.12em] text-primary">
              {tool.groupLabel}
            </span>
            <span className="text-label-sm text-on-surface-variant">
              {tool.id} · ~{tool.minutes} dk
            </span>
          </div>
          <h1 className="mt-space-md text-headline-lg text-on-surface">
            {tool.title}
          </h1>
          <p className="mt-space-md max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
            {tool.summary}
          </p>
          <p className="mt-space-sm text-body-sm text-on-surface-variant">
            {tool.audience}
          </p>
        </header>

        <div className="mt-space-lg max-w-3xl">
          <CalculatorDisclaimer>
            {tool.warnings.length > 0 ? (
              <>
                <strong className="text-on-secondary-fixed">Uyarı:</strong>{" "}
                {tool.warnings.join(" ")}{" "}
              </>
            ) : null}
            Teşhis veya tedavi değildir. Hesaplar tarayıcıda kalır; kaydedilmez.
          </CalculatorDisclaimer>
        </div>

        <div className="mt-space-xl grid grid-cols-1 gap-space-lg lg:grid-cols-12">
          <div className="lg:col-span-7">{children}</div>

          <aside className="flex flex-col gap-space-md lg:col-span-5">
            <section
              className="rounded-[1.75rem] border border-outline-variant/30 bg-surface-container-lowest/80 p-space-lg backdrop-blur-sm"
              aria-labelledby="yontem"
            >
              <h2 id="yontem" className="text-headline-sm text-on-surface">
                Yöntem
              </h2>
              <p className="mt-space-sm text-body-md leading-relaxed text-on-surface-variant">
                {tool.method}
              </p>
              {tool.sources.length > 0 ? (
                <div className="mt-space-md">
                  <h3 className="text-label-sm font-bold uppercase tracking-wider text-tertiary">
                    Kaynaklar
                  </h3>
                  <ul className="mt-space-xs space-y-1 text-body-sm text-on-surface-variant">
                    {tool.sources.map((s) => (
                      <li key={s} className="border-l-2 border-primary/25 pl-space-sm">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {tool.limits.length > 0 ? (
                <div className="mt-space-md">
                  <h3 className="text-label-sm font-bold uppercase tracking-wider text-tertiary">
                    Sınırlar
                  </h3>
                  <ul className="mt-space-xs list-disc space-y-1 pl-space-md text-body-sm text-on-surface-variant">
                    {tool.limits.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </section>

            {tool.relatedHrefs && tool.relatedHrefs.length > 0 ? (
              <nav
                className="rounded-[1.75rem] border border-outline-variant/30 bg-surface-container-low/80 p-space-lg"
                aria-label="İlgili araçlar"
              >
                <h2 className="text-label-sm font-bold uppercase tracking-wider text-tertiary">
                  İlgili
                </h2>
                <ul className="mt-space-sm space-y-space-xs">
                  {tool.relatedHrefs.map((href) => {
                    const slug = href.replace("/hesaplayicilar/", "");
                    const related = getToolBySlug(slug);
                    return (
                      <li key={href}>
                        <Link
                          href={href}
                          className="group flex items-center justify-between gap-space-sm rounded-xl px-space-sm py-2 text-label-md text-primary transition-colors hover:bg-primary/5"
                        >
                          <span>{related?.title ?? slug}</span>
                          <span
                            className="transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
                            aria-hidden
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ) : null}

            <div className="rounded-[1.75rem] bg-primary text-on-primary p-space-lg shadow-md">
              <h2 className="text-headline-sm">Diyetisyen ile konuşun</h2>
              <p className="mt-space-xs text-body-sm text-on-primary/85">
                Sonuçları kişisel plana taşımak için iletişime geçin. Randevu
                takvimi yoktur.
              </p>
              <div className="mt-space-md [&_a]:!bg-surface-container-lowest [&_a]:!text-primary [&_button]:!bg-surface-container-lowest [&_button]:!text-primary">
                <ContactChannels
                  settings={settings}
                  primaryLabel="WhatsApp"
                  compact
                  showNote={false}
                  whatsappMessage={`Merhaba, "${tool.title}" hesaplayıcısı hakkında görüşmek istiyorum.`}
                />
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
