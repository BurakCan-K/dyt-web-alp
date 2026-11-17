import Link from "next/link";
import { notFound } from "next/navigation";
import { GuideForm } from "@/components/admin/GuideForm";
import { Card } from "@/components/ui/Card";
import { loadMediaOptions } from "@/lib/admin/media-options";
import { isTipTapDoc, paragraphsToDoc } from "@/lib/richtext/types";
import { getGuideForAdmin } from "@/server/repositories/guide-repository";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

function normalizeContent(contentJson: unknown) {
  if (isTipTapDoc(contentJson)) return contentJson;
  if (
    contentJson &&
    typeof contentJson === "object" &&
    Array.isArray((contentJson as { paragraphs?: unknown }).paragraphs)
  ) {
    return paragraphsToDoc(
      (contentJson as { paragraphs: string[] }).paragraphs,
    );
  }
  return contentJson;
}

function mealPlanToForm(mealPlanJson: unknown) {
  if (!mealPlanJson || typeof mealPlanJson !== "object") {
    return { meals: undefined, days: undefined };
  }
  const plan = mealPlanJson as {
    meals?: Array<{ name: string; items: string[] }>;
    days?: Array<{
      name: string;
      meals: Array<{ name: string; items: string[] }>;
    }>;
  };
  return {
    meals: plan.meals?.map((m) => ({
      name: m.name,
      itemsText: (m.items ?? []).join("\n"),
    })),
    days: plan.days?.map((d) => ({
      name: d.name,
      meals: (d.meals ?? []).map((m) => ({
        name: m.name,
        itemsText: (m.items ?? []).join("\n"),
      })),
    })),
  };
}

export default async function EditGuidePage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  let guide;
  try {
    guide = await getGuideForAdmin(id);
  } catch {
    return (
      <Card>
        <p className="text-body-md text-error">Veritabanı bağlantısı yok.</p>
      </Card>
    );
  }
  if (!guide) notFound();
  const mediaAssets = await loadMediaOptions();

  const mealForm = mealPlanToForm(guide.mealPlanJson);

  return (
    <div className="space-y-space-md">
      {sp.saved ? (
        <p role="status" className="text-body-sm text-primary">
          Kaydedildi.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-space-sm">
        <Link href="/admin/rehberler" className="text-label-md text-primary">
          ← Liste
        </Link>
        <Link
          href={`/beslenme-rehberleri/${guide.slug}`}
          className="text-label-md text-on-surface-variant"
        >
          Public önizleme
        </Link>
      </div>
      <Card>
        <h1 className="mb-space-lg text-headline-md">Rehberi düzenle</h1>
        <GuideForm
          id={guide.id}
          mediaAssets={mediaAssets}
          initial={{
            title: guide.title,
            slug: guide.slug,
            intro: guide.intro,
            contentJson: normalizeContent(guide.contentJson),
            status: guide.status,
            seoTitle: guide.seoTitle,
            seoDescription: guide.seoDescription,
            coverMediaId: guide.coverMediaId,
            relatedRecipeSlugs:
              (guide.relatedRecipeSlugsJson as string[] | null) ?? [],
            meals: mealForm.meals,
            days: mealForm.days,
          }}
        />
      </Card>
    </div>
  );
}
