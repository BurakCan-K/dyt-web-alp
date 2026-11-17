import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { loadPublicGuides } from "@/lib/content/public-source";
import { PAGE_SEO } from "@/data/site-defaults";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: PAGE_SEO.rehberler.title,
  description: PAGE_SEO.rehberler.description,
  path: "/beslenme-rehberleri",
});

export default async function RehberlerPage() {
  const guides = await loadPublicGuides();

  return (
    <>
      <PageHero
        eyebrow="Rehberler"
        title="Örnek beslenme çerçeveleri"
        description="Genel bilgilendirme. Hastalık/kişiye özel tedavi listesi üretilmez."
      />
      <Container className="pb-space-xl">
        {guides.length === 0 ? (
          <EmptyState title="Henüz rehber yok" />
        ) : (
          <ul className="grid grid-cols-1 gap-space-md md:grid-cols-2">
            {guides.map((guide) => (
              <li key={guide.slug}>
                <article className="rounded-3xl bg-surface-container-lowest p-space-lg shadow-sm">
                  <h2 className="text-headline-sm">
                    <Link
                      href={`/beslenme-rehberleri/${guide.slug}`}
                      className="hover:text-primary"
                    >
                      {guide.title}
                    </Link>
                  </h2>
                  <p className="mt-space-sm text-body-sm text-on-surface-variant">
                    {guide.intro}
                  </p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
