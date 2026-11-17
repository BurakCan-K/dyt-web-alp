import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SiteImage } from "@/components/ui/SiteImage";
import { cn } from "@/lib/cn";
import type { PublicService } from "@/lib/content/public-source";

export function ServicesPreview({ services }: { services: PublicService[] }) {
  return (
    <section
      id="hizmetler"
      className="py-space-xl"
      aria-labelledby="services-heading"
    >
      <Container>
        <div className="mb-space-xl flex flex-col justify-between gap-space-md lg:flex-row lg:items-end">
          <div id="services-heading">
            <SectionHeading
              eyebrow="Hizmetler"
              title="Size uygun destek modelini seçin"
              description="Online veya yüz yüze; süreç WhatsApp, telefon veya e-posta ile ilerler. Sonuç garantisi yok — sürdürülebilir plan var."
            />
          </div>
          <Link
            href="/hizmetler"
            className="text-label-md font-semibold text-primary hover:underline"
          >
            Tüm hizmetler →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-space-md md:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 4).map((service) => (
            <article
              key={service.slug}
              className={cn(
                "group flex flex-col overflow-hidden rounded-3xl shadow-sm transition-all",
                service.isFeatured
                  ? "bg-primary-fixed-dim/20 ring-1 ring-primary/15"
                  : "bg-surface-container-lowest",
              )}
            >
              {service.imageUrl ? (
                <Link
                  href={`/hizmetler/${service.slug}`}
                  className="relative block aspect-[4/3] bg-surface-container"
                >
                  <SiteImage
                    src={service.imageUrl}
                    alt={service.imageAlt ?? service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none"
                  />
                </Link>
              ) : null}
              <div className="flex flex-1 flex-col justify-between p-space-lg">
                <div className="flex flex-col gap-space-xs">
                  <div className="flex items-start justify-between gap-space-sm">
                    <h3 className="text-headline-sm text-on-surface">
                      {service.title}
                    </h3>
                    {service.isFeatured ? (
                      <span className="shrink-0 rounded-full bg-secondary-container px-2 py-0.5 text-label-sm text-on-secondary">
                        Öne çıkan
                      </span>
                    ) : null}
                  </div>
                  <p className="text-body-sm leading-relaxed text-on-surface-variant">
                    {service.summary}
                  </p>
                </div>
                <div className="pt-space-md">
                  <Link
                    href={`/hizmetler/${service.slug}`}
                    className="inline-flex items-center gap-1 text-label-md text-primary transition-all group-hover:gap-2"
                  >
                    Detayları incele
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
