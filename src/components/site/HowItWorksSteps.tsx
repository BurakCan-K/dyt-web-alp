import { processStepsFixture } from "@/data/fixtures";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

export function HowItWorksSteps() {
  return (
    <section
      className="w-full bg-surface-container py-space-xl"
      aria-labelledby="steps-heading"
    >
      <Container>
        <div className="mx-auto mb-space-xl flex max-w-2xl flex-col items-center gap-space-xs text-center">
          <span className="text-label-sm font-bold uppercase tracking-widest text-primary">
            Süreç nasıl ilerliyor?
          </span>
          <h2 id="steps-heading" className="text-headline-lg text-on-surface">
            Dört net adım
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Randevu takvimi yoktur; adımlar iletişim kanalları üzerinden
            planlanır.
          </p>
        </div>

        <ol className="grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
          {processStepsFixture.map((step, index) => (
            <li
              key={step.id}
              className="flex flex-col gap-space-md rounded-3xl bg-surface-container-lowest p-space-lg shadow-sm"
            >
              <span
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-full text-headline-sm",
                  index === processStepsFixture.length - 1
                    ? "bg-secondary-container text-on-secondary"
                    : "bg-primary text-on-primary",
                )}
              >
                {step.id}
              </span>
              <div className="flex flex-col gap-space-xs">
                <h3 className="text-headline-sm text-on-surface">{step.title}</h3>
                <p className="text-body-sm leading-relaxed text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
