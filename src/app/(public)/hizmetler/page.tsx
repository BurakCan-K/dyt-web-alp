import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/PageHero";
import { EmptyState } from "@/components/site/EmptyState";
import { ContactChannels } from "@/components/site/ContactChannels";
import { Container } from "@/components/ui/Container";
import { SiteImage } from "@/components/ui/SiteImage";
import { loadPublicServices } from "@/lib/content/public-source";
import { loadPublicSiteSettings } from "@/lib/content/site-settings";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/cn";
import { servicesProcessSteps } from "@/data/content";
import { PAGE_SEO } from "@/data/site-defaults";

export const metadata: Metadata = buildMetadata({
  title: PAGE_SEO.hizmetler.title,
  description: PAGE_SEO.hizmetler.description,
  path: "/hizmetler",
});

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    loadPublicServices(),
    loadPublicSiteSettings(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Hizmetler"
        title="Size uygun destek modelini birlikte seçelim"
        description="Bilimsel temelli, kişiye özel ve sürdürülebilir beslenme danışmanlığı. Sitede randevu takvimi veya ödeme yok; süreç WhatsApp, telefon veya e-posta ile ilerler."
      />

      <Container className="pb-space-xl">
        <section
          className="mb-space-xl rounded-3xl bg-surface-container-low p-space-lg"
          aria-labelledby="surec"
        >
          <h2 id="surec" className="text-headline-sm text-on-surface">
            Süreç nasıl işler?
          </h2>
          <p className="mt-space-xs max-w-2xl text-body-md text-on-surface-variant">
            Hitap sakin ve nettir: vaat değil, uygulanabilir plan ve düzenli takip.
          </p>
          <ol className="mt-space-lg grid grid-cols-1 gap-space-md sm:grid-cols-2 lg:grid-cols-4">
            {servicesProcessSteps.map((item) => (
              <li
                key={item.step}
                className="rounded-2xl bg-surface-container-lowest p-space-md"
              >
                <span className="text-label-sm font-bold text-primary">
                  {item.step}
                </span>
                <h3 className="mt-space-xs text-headline-sm text-on-surface">
                  {item.title}
                </h3>
                <p className="mt-space-xs text-body-sm text-on-surface-variant">
                  {item.text}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {services.length === 0 ? (
          <EmptyState title="Henüz yayınlanmış hizmet yok" />
        ) : (
          <ul className="grid grid-cols-1 gap-space-md lg:grid-cols-2">
            {services.map((service) => (
              <li key={service.slug}>
                <article
                  className={cn(
                    "flex h-full flex-col overflow-hidden rounded-3xl shadow-sm",
                    service.isFeatured
                      ? "bg-primary-fixed-dim/15 ring-1 ring-primary/20"
                      : "bg-surface-container-lowest",
                  )}
                >
                  {service.imageUrl ? (
                    <Link
                      href={`/hizmetler/${service.slug}`}
                      className="relative block aspect-[16/10] bg-surface-container"
                    >
                      <SiteImage
                        src={service.imageUrl}
                        alt={service.imageAlt ?? service.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </Link>
                  ) : null}
                  <div className="flex flex-1 flex-col p-space-lg">
                    <div className="flex flex-wrap items-center gap-space-xs">
                      {service.isFeatured ? (
                        <span className="rounded-full bg-secondary-container px-2 py-0.5 text-label-sm text-on-secondary">
                          Öne çıkan
                        </span>
                      ) : null}
                      {service.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-surface-container px-2 py-0.5 text-label-sm text-on-surface-variant"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-space-sm text-headline-sm text-on-surface">
                      <Link
                        href={`/hizmetler/${service.slug}`}
                        className="hover:text-primary"
                      >
                        {service.title}
                      </Link>
                    </h2>
                    <p className="mt-space-sm text-body-sm text-on-surface-variant">
                      {service.summary}
                    </p>
                    {service.highlights.length > 0 ? (
                      <ul className="mt-space-md space-y-1 text-body-sm text-on-surface-variant">
                        {service.highlights.slice(0, 3).map((h) => (
                          <li key={h.slice(0, 48)} className="flex gap-2">
                            <span className="text-primary" aria-hidden>
                              ·
                            </span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <Link
                      href={`/hizmetler/${service.slug}`}
                      className="mt-space-md text-label-md font-semibold text-primary"
                    >
                      Detay ve kapsam →
                    </Link>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}

        <aside className="mt-space-xl rounded-3xl bg-surface-container-lowest p-space-lg shadow-md">
          <h2 className="text-headline-sm text-on-surface">
            Hangisi size uygun, emin değil misiniz?
          </h2>
          <p className="mt-space-xs max-w-2xl text-body-md text-on-surface-variant">
            Kısa bir ön görüşmeyle ihtiyacınıza uygun modeli birlikte
            belirleyebiliriz. Sonuç garantisi verilmez; süreç şeffaf ve
            kişiye özel ilerler.
          </p>
          <ContactChannels
            className="mt-space-md"
            settings={settings}
            primaryLabel="WhatsApp ile sor"
            whatsappMessage="Merhaba, hizmetler hakkında kısa bilgi almak istiyorum."
          />
        </aside>
      </Container>
    </>
  );
}
