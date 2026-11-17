import type { Metadata } from "next";
import { ContactCta } from "@/components/site/ContactCta";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { PAGE_SEO } from "@/data/site-defaults";
import { loadPublicSiteSettings } from "@/lib/content/site-settings";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: PAGE_SEO.iletisim.title,
  description: PAGE_SEO.iletisim.description,
  path: "/iletisim",
});

export default async function IletisimPage() {
  const settings = await loadPublicSiteSettings();

  return (
    <>
      <PageHero
        eyebrow="İletişim"
        title="Bize ulaşın"
        description="Online randevu, ödeme veya lead formu yoktur. Kanallar site ayarlarından tanımlanır."
      />
      <Container className="pb-space-xl">
        <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12">
          <div className="lg:col-span-6">
            <ContactCta settings={settings} />
          </div>
          <div className="lg:col-span-6 space-y-space-md">
            <div className="rounded-3xl bg-surface-container-low p-space-lg">
              <h2 className="text-headline-sm text-on-surface">Adres</h2>
              <p className="mt-space-sm text-body-md text-on-surface-variant">
                {settings.address ??
                  "[Adres — yayın öncesi doğrulanacak]"}
              </p>
              {settings.mapUrl ? (
                <a
                  href={settings.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-space-sm inline-block text-label-md text-primary hover:underline"
                >
                  Haritada aç
                </a>
              ) : null}
            </div>
            <div className="rounded-3xl bg-surface-container-low p-space-lg">
              <h2 className="text-headline-sm text-on-surface">Çalışma saatleri</h2>
              {settings.openingHours.length > 0 ? (
                <ul className="mt-space-sm space-y-1 text-body-md text-on-surface-variant">
                  {settings.openingHours.map((row) => (
                    <li key={`${row.label}-${row.hours}`}>
                      <span className="font-semibold text-on-surface">
                        {row.label}
                      </span>
                      {row.hours ? ` — ${row.hours}` : null}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-space-sm text-body-md text-on-surface-variant">
                  [Çalışma saatleri — site ayarlarından]
                </p>
              )}
            </div>
            {settings.instagramUrl ? (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label-md text-primary hover:underline"
              >
                Instagram
              </a>
            ) : null}
          </div>
        </div>
      </Container>
    </>
  );
}
