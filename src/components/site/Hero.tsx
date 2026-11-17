import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ContactChannels } from "@/components/site/ContactChannels";
import type { PublicSiteSettings } from "@/lib/content/site-settings";

const HERO_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80";

type Props = {
  settings: PublicSiteSettings;
};

export function Hero({ settings }: Props) {
  const portraitSrc = settings.logoUrl || HERO_FALLBACK_IMAGE;
  const portraitAlt = settings.logoUrl
    ? settings.logoAlt || settings.brandName
    : "Taze sebze ve dengeli öğün — beslenme danışmanlığı";

  return (
    <div className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-primary-fixed/20 blur-3xl motion-reduce:hidden"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute top-48 -right-24 h-80 w-80 rounded-full bg-secondary-fixed/30 blur-3xl motion-reduce:hidden"
        aria-hidden
      />

      <Container className="pt-space-md pb-space-xl lg:pt-space-xl">
        <section className="grid grid-cols-1 items-center gap-space-lg lg:grid-cols-12 lg:gap-space-xl">
          <div className="flex flex-col gap-space-md lg:col-span-7 lg:pr-space-md">
            <span className="inline-flex w-fit items-center gap-space-xs rounded-full bg-surface-container-low px-space-md py-space-xs text-label-sm font-semibold uppercase tracking-wider text-primary shadow-sm">
              {settings.professionalTitle}
            </span>
            <h1 className="text-headline-lg tracking-tight text-on-surface">
              {settings.heroTitle}
            </h1>
            <p className="max-w-2xl text-body-lg leading-relaxed text-on-surface-variant">
              {settings.heroSubtitle}
            </p>

            <div className="flex flex-col gap-space-sm pt-space-xs">
              <ContactChannels
                settings={settings}
                primaryLabel="WhatsApp ile İletişime Geç"
                compact
                showNote={false}
              />
              <div>
                <Button href="/hizmetler" variant="secondary">
                  Hizmetlerimi İncele
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-space-sm pt-space-md sm:grid-cols-3">
              {[
                {
                  title: "Bilgilendirici yaklaşım",
                  subtitle: "Teşhis vaadi yok",
                },
                {
                  title: "Açık iletişim",
                  subtitle: "WhatsApp · Tel · E-posta",
                },
                {
                  title: "Sürdürülebilir plan",
                  subtitle: "Yasak listesi dayatılmaz",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col rounded-xl bg-surface-container-lowest p-space-sm shadow-sm"
                >
                  <span className="text-label-md font-semibold text-on-surface">
                    {item.title}
                  </span>
                  <span className="text-body-sm text-on-surface-variant">
                    {item.subtitle}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-space-md lg:col-span-5 lg:mt-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-container shadow-xl">
              <Image
                src={portraitSrc}
                alt={portraitAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/50 via-transparent to-transparent" />
              <div className="absolute inset-0 flex flex-col justify-end p-space-md">
                <div className="rounded-2xl bg-surface/95 p-space-md shadow-lg backdrop-blur-md">
                  <p className="text-headline-sm leading-tight text-on-surface">
                    {settings.dietitianName}
                  </p>
                  <p className="text-body-sm text-on-surface-variant">
                    {settings.professionalTitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
