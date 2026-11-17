import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PAGE_SEO } from "@/data/site-defaults";
import { loadPublicSiteSettings } from "@/lib/content/site-settings";
import { buildMetadata } from "@/lib/seo";

const PORTRAIT_FALLBACK =
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: PAGE_SEO.hakkimda.title,
  description: PAGE_SEO.hakkimda.description,
  path: "/hakkimda",
});

export default async function HakkimdaPage() {
  const settings = await loadPublicSiteSettings();
  const portraitSrc = settings.logoUrl || PORTRAIT_FALLBACK;
  const portraitAlt = settings.logoUrl
    ? settings.logoAlt || settings.dietitianName
    : "Beslenme danışmanlığı — taze malzemeler";

  return (
    <>
      <PageHero
        eyebrow="Hakkımda"
        title={settings.dietitianName}
        description={`${settings.professionalTitle}. Unvan ve eğitim bilgileri yayın öncesi belgelerle doğrulanmalıdır.`}
      />
      <Container className="pb-space-xl">
        <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-surface-container shadow-lg">
              <Image
                src={portraitSrc}
                alt={portraitAlt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
          <div className="flex flex-col gap-space-md lg:col-span-7">
            <Card className="bg-secondary-fixed/30 shadow-sm">
              <p className="text-label-sm font-semibold text-on-secondary-fixed-variant">
                Doğrulama gerekli
              </p>
              <p className="mt-space-xs text-body-md text-on-surface">
                Ad, unvan, eğitim, sertifika ve deneyim süresi yalnızca
                diyetisyen tarafından onaylandıktan sonra doldurulmalıdır.
              </p>
            </Card>
            <section aria-labelledby="yaklasim">
              <h2 id="yaklasim" className="text-headline-md text-on-surface">
                Çalışma yaklaşımı
              </h2>
              <p className="mt-space-sm text-body-md text-on-surface-variant">
                {settings.biography?.trim() ||
                  "Sürdürülebilir beslenme alışkanlıkları, açık iletişim ve genel bilgilendirme. Teşhis, tedavi garantisi veya danışan başarı hikâyesi bu sayfada yer almaz."}
              </p>
            </section>
            <section aria-labelledby="egitim">
              <h2 id="egitim" className="text-headline-md text-on-surface">
                Eğitim & sertifikalar
              </h2>
              <ul className="mt-space-sm list-disc space-y-1 pl-5 text-body-md text-on-surface-variant">
                <li>[Eğitim kurumu — doğrulanacak]</li>
                <li>[Sertifika / uzmanlık — doğrulanacak]</li>
              </ul>
            </section>
          </div>
        </div>
      </Container>
    </>
  );
}
