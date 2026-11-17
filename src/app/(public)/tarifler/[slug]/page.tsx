import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { PortionScaler } from "@/components/site/PortionScaler";
import { PrintButton } from "@/components/site/PrintButton";
import { ShareButtons } from "@/components/site/ShareButtons";
import { Container } from "@/components/ui/Container";
import { SiteImage } from "@/components/ui/SiteImage";
import { loadPublicRecipe, loadPublicRecipes } from "@/lib/content/public-source";
import { buildMetadata } from "@/lib/seo";
import { recipeJsonLd } from "@/lib/seo/json-ld";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const recipes = await loadPublicRecipes();
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await loadPublicRecipe(slug);
  if (!recipe) {
    return buildMetadata({ title: "Tarif bulunamadı", noIndex: true });
  }
  return buildMetadata({
    title: recipe.seoTitle ?? recipe.title,
    description: recipe.seoDescription ?? recipe.excerpt,
    path: `/tarifler/${recipe.slug}`,
  });
}

export default async function RecipeDetailPage({ params }: Props) {
  const { slug } = await params;
  const recipe = await loadPublicRecipe(slug);
  if (!recipe) notFound();

  return (
    <Container className="py-space-xl">
      <JsonLd
        data={recipeJsonLd({
          title: recipe.title,
          description: recipe.seoDescription ?? recipe.excerpt,
          path: `/tarifler/${recipe.slug}`,
          prepMinutes: recipe.prepMinutes,
          cookMinutes: recipe.cookMinutes,
          servingCount: recipe.servingCount,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          imageUrl: recipe.coverImageUrl,
        })}
      />
      <p className="text-label-sm text-tertiary">{recipe.categoryTitle}</p>
      <h1 className="mt-space-xs text-headline-lg text-on-surface">
        {recipe.title}
      </h1>
      <p className="mt-space-md max-w-2xl text-body-lg text-on-surface-variant">
        {recipe.excerpt}
      </p>

      {recipe.coverImageUrl ? (
        <div className="relative mt-space-lg aspect-[16/10] w-full overflow-hidden rounded-3xl bg-surface-container">
          <SiteImage
            src={recipe.coverImageUrl}
            alt={recipe.coverImageAlt ?? recipe.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
          />
        </div>
      ) : null}

      <dl className="mt-space-lg grid grid-cols-2 gap-space-sm sm:grid-cols-4 lg:grid-cols-5">
        {[
          { label: "Hazırlık", value: `${recipe.prepMinutes} dk` },
          { label: "Pişirme", value: `${recipe.cookMinutes} dk` },
          { label: "Porsiyon", value: String(recipe.servingCount) },
          {
            label: "Toplam",
            value: `${recipe.prepMinutes + recipe.cookMinutes} dk`,
          },
          ...(recipe.difficulty
            ? [{ label: "Zorluk", value: recipe.difficulty }]
            : []),
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl bg-surface-container-low p-space-md"
          >
            <dt className="text-label-sm text-on-surface-variant">{item.label}</dt>
            <dd className="text-headline-sm capitalize text-on-surface">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-space-lg flex flex-wrap items-center gap-space-sm print:hidden">
        <ShareButtons title={recipe.title} path={`/tarifler/${recipe.slug}`} />
        <PrintButton label="Tarifi yazdır" />
      </div>

      <div className="mt-space-xl grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <div className="lg:col-span-5">
          <PortionScaler
            baseServings={recipe.servingCount}
            ingredients={recipe.ingredients}
          />
        </div>
        <div className="lg:col-span-7">
          <h2 className="text-headline-sm text-on-surface">Uygulama</h2>
          <ol className="mt-space-md space-y-space-md">
            {recipe.steps.map((step, i) => (
              <li
                key={`${i}-${step.slice(0, 24)}`}
                className="flex gap-space-md rounded-2xl bg-surface-container-lowest p-space-md shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-label-md text-on-primary">
                  {i + 1}
                </span>
                <span className="text-body-md text-on-surface-variant">{step}</span>
              </li>
            ))}
          </ol>

          {recipe.nutrientsPerServing ? (
            <section
              className="mt-space-lg rounded-3xl bg-surface-container-low p-space-lg"
              aria-labelledby="besin"
            >
              <h2 id="besin" className="text-headline-sm text-on-surface">
                Porsiyon başına besin değerleri
              </h2>
              <ul className="mt-space-sm grid grid-cols-2 gap-space-sm text-body-md">
                <li>Enerji: {recipe.nutrientsPerServing.kcal} kcal</li>
                <li>Protein: {recipe.nutrientsPerServing.proteinG} g</li>
                <li>Karbonhidrat: {recipe.nutrientsPerServing.carbG} g</li>
                <li>Yağ: {recipe.nutrientsPerServing.fatG} g</li>
              </ul>
              <p className="mt-space-sm text-body-sm text-on-surface-variant">
                Kaynak: {recipe.nutrientsPerServing.source}
              </p>
            </section>
          ) : null}

          {recipe.tips.length > 0 ? (
            <section
              className="mt-space-lg"
              aria-labelledby="puf-noktalari"
            >
              <h2 id="puf-noktalari" className="text-headline-sm text-on-surface">
                Püf noktaları
              </h2>
              <ul className="mt-space-sm list-disc space-y-space-xs pl-space-lg text-body-md text-on-surface-variant">
                {recipe.tips.map((tip) => (
                  <li key={tip.slice(0, 40)}>{tip}</li>
                ))}
              </ul>
            </section>
          ) : null}

          {recipe.allergens.length > 0 ? (
            <section
              className="mt-space-lg rounded-2xl border border-outline-variant/40 p-space-md"
              aria-labelledby="alerjen"
            >
              <h2 id="alerjen" className="text-headline-sm text-on-surface">
                Alerjen bilgisi
              </h2>
              <ul className="mt-space-sm list-disc space-y-space-xs pl-space-lg text-body-md text-on-surface-variant">
                {recipe.allergens.map((a) => (
                  <li key={a.slice(0, 40)}>{a}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>

      <Link
        href="/tarifler"
        className="mt-space-lg inline-block text-label-md text-primary hover:underline print:hidden"
      >
        ← Tarif listesi
      </Link>
    </Container>
  );
}
