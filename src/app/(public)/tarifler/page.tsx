import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { SiteImage } from "@/components/ui/SiteImage";
import {
  loadPublicRecipeCategories,
  loadPublicRecipes,
} from "@/lib/content/public-source";
import { PAGE_SEO } from "@/data/site-defaults";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: PAGE_SEO.tarifler.title,
  description: PAGE_SEO.tarifler.description,
  path: "/tarifler",
});

type Props = {
  searchParams: Promise<{ kategori?: string }>;
};

export default async function TariflerPage({ searchParams }: Props) {
  const sp = await searchParams;
  const kategori = sp.kategori ?? "";
  const [recipes, categories] = await Promise.all([
    loadPublicRecipes({ kategori: kategori || undefined }),
    loadPublicRecipeCategories(),
  ]);

  function hrefFor(nextKategori: string) {
    return nextKategori ? `/tarifler?kategori=${nextKategori}` : "/tarifler";
  }

  return (
    <>
      <PageHero
        eyebrow="Tarifler"
        title="Mutfak örnekleri"
        description="Malzeme miktarları porsiyona göre ölçeklenebilir. Besin değerleri el ile girilmiş örneklerdir."
      />
      <Container className="pb-space-xl">
        <div className="mb-space-lg flex flex-wrap gap-space-xs">
          <Link
            href={hrefFor("")}
            className={cn(
              "rounded-full px-space-md py-space-xs text-label-sm",
              !kategori
                ? "bg-primary-container text-on-primary-container"
                : "bg-surface-container text-on-surface-variant",
            )}
          >
            Tüm kategoriler
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={hrefFor(cat.slug)}
              className={cn(
                "rounded-full px-space-md py-space-xs text-label-sm",
                kategori === cat.slug
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container text-on-surface-variant",
              )}
            >
              {cat.title}
            </Link>
          ))}
        </div>

        {recipes.length === 0 ? (
          <EmptyState
            title="Tarif bulunamadı"
            description="Filtreleri temizleyip tekrar deneyin."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-space-md md:grid-cols-2 lg:grid-cols-3">
            {recipes.map((recipe) => (
              <li key={recipe.slug}>
                <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm">
                  {recipe.coverImageUrl ? (
                    <Link
                      href={`/tarifler/${recipe.slug}`}
                      className="relative block aspect-[4/3] bg-surface-container"
                    >
                      <SiteImage
                        src={recipe.coverImageUrl}
                        alt={recipe.coverImageAlt ?? recipe.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </Link>
                  ) : null}
                  <div className="flex flex-1 flex-col p-space-lg">
                    <span className="text-label-sm text-tertiary">
                      {recipe.categoryTitle} ·{" "}
                      {recipe.prepMinutes + recipe.cookMinutes} dk
                    </span>
                    <h2 className="mt-space-sm text-headline-sm">
                      <Link
                        href={`/tarifler/${recipe.slug}`}
                        className="hover:text-primary"
                      >
                        {recipe.title}
                      </Link>
                    </h2>
                    <p className="mt-space-sm flex-1 text-body-sm text-on-surface-variant">
                      {recipe.excerpt}
                    </p>
                    <p className="mt-space-sm text-label-sm text-on-surface-variant">
                      {recipe.servingCount} porsiyon
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
