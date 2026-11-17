import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichTextView } from "@/components/content/RichTextView";
import { Container } from "@/components/ui/Container";
import {
  loadPublicGuide,
  loadPublicGuides,
  loadPublicRecipe,
} from "@/lib/content/public-source";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const guides = await loadPublicGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = await loadPublicGuide(slug);
  if (!guide) {
    return buildMetadata({ title: "Rehber bulunamadı", noIndex: true });
  }
  return buildMetadata({
    title: guide.seoTitle ?? guide.title,
    description: guide.seoDescription ?? guide.intro,
    path: `/beslenme-rehberleri/${guide.slug}`,
  });
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = await loadPublicGuide(slug);
  if (!guide) notFound();

  const related = (
    await Promise.all(
      guide.relatedRecipeSlugs.map((s) => loadPublicRecipe(s)),
    )
  ).filter(Boolean);

  const mealSections =
    guide.days.length > 0
      ? guide.days.map((day) => ({
          heading: day.name,
          meals: day.meals,
        }))
      : [{ heading: "Örnek öğün dağılımı", meals: guide.meals }];

  return (
    <Container className="py-space-xl">
      <p className="rounded-xl bg-secondary-fixed/40 px-space-md py-space-sm text-label-sm text-on-secondary-fixed-variant">
        Genel bilgilendirme — tıbbi tedavi veya kişiye özel reçete değildir.
      </p>
      <h1 className="mt-space-md text-headline-lg text-on-surface">
        {guide.title}
      </h1>
      <p className="mt-space-md max-w-2xl text-body-lg text-on-surface-variant">
        {guide.intro}
      </p>

      <article className="mt-space-lg max-w-3xl">
        <RichTextView doc={guide.bodyDoc} />
      </article>

      {mealSections.map((section) =>
        section.meals.length > 0 ? (
          <section
            key={section.heading}
            className="mt-space-xl"
            aria-labelledby={`ogun-${section.heading}`}
          >
            <h2
              id={`ogun-${section.heading}`}
              className="text-headline-md text-on-surface"
            >
              {section.heading}
            </h2>
            <ul className="mt-space-md grid grid-cols-1 gap-space-md sm:grid-cols-2">
              {section.meals.map((meal) => (
                <li
                  key={`${section.heading}-${meal.name}`}
                  className="rounded-3xl bg-surface-container-low p-space-lg"
                >
                  <h3 className="text-headline-sm text-on-surface">{meal.name}</h3>
                  <ul className="mt-space-sm list-disc space-y-1 pl-5 text-body-sm text-on-surface-variant">
                    {meal.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </section>
        ) : null,
      )}

      {related.length > 0 ? (
        <section className="mt-space-xl" aria-labelledby="ilgili-tarif">
          <h2 id="ilgili-tarif" className="text-headline-sm text-on-surface">
            İlgili tarifler
          </h2>
          <ul className="mt-space-sm flex flex-col gap-space-xs">
            {related.map((recipe) =>
              recipe ? (
                <li key={recipe.slug}>
                  <Link
                    href={`/tarifler/${recipe.slug}`}
                    className="text-label-md text-primary hover:underline"
                  >
                    {recipe.title}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}

      <p className="mt-space-xl max-w-3xl rounded-2xl bg-surface-container p-space-md text-body-sm text-on-surface-variant">
        {guide.disclaimer}
      </p>

      <Link
        href="/beslenme-rehberleri"
        className="mt-space-lg inline-block text-label-md text-primary hover:underline"
      >
        ← Rehber listesi
      </Link>
    </Container>
  );
}
