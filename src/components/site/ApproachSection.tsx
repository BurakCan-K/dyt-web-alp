import Image from "next/image";
import { approachPillarsFixture } from "@/data/fixtures";
import { Container } from "@/components/ui/Container";

const APPROACH_IMAGE =
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80";

export function ApproachSection() {
  return (
    <section
      className="w-full bg-surface-container-low py-space-xl"
      aria-labelledby="approach-heading"
    >
      <Container>
        <div className="grid grid-cols-1 items-center gap-space-xl lg:grid-cols-12">
          <div className="relative lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-container shadow-lg">
              <Image
                src={APPROACH_IMAGE}
                alt="Taze sebze ve yemek hazırlığı — sürdürülebilir beslenme atmosferi"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority={false}
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-on-surface/35 via-transparent to-transparent"
                aria-hidden
              />
            </div>
          </div>

          <div className="flex flex-col gap-space-lg lg:col-span-7">
            <div className="flex flex-col gap-space-xs">
              <span className="text-label-sm font-bold uppercase tracking-widest text-primary">
                Neden bu yaklaşım?
              </span>
              <h2
                id="approach-heading"
                className="text-headline-lg text-on-surface"
              >
                Diyet değil, yaşam boyu sürecek bir dönüşüm
              </h2>
              <p className="text-body-md text-on-surface-variant">
                Kalıplaşmış listeler yerine bireysel ihtiyaçlara ve bilimsel
                bilgilendirmeye dayanan bir çerçeve.
              </p>
            </div>

            <ul className="space-y-space-md">
              {approachPillarsFixture.map((pillar) => (
                <li
                  key={pillar.id}
                  className="flex items-start gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm"
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-fixed text-label-md font-semibold text-primary"
                    aria-hidden
                  >
                    {pillar.id}
                  </span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-headline-sm text-on-surface">
                      {pillar.title}
                    </h3>
                    <p className="text-body-sm text-on-surface-variant">
                      {pillar.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
