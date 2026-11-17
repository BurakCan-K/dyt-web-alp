import Link from "next/link";
import { notFound } from "next/navigation";
import { RecipeForm } from "@/components/admin/RecipeForm";
import { Card } from "@/components/ui/Card";
import { loadMediaOptions } from "@/lib/admin/media-options";
import {
  extractRecipeMeta,
  extractRecipeSteps,
} from "@/lib/recipe/instructions";
import { getRecipeForAdmin } from "@/server/repositories/recipe-repository";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditRecipePage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  let recipe;
  try {
    recipe = await getRecipeForAdmin(id);
  } catch {
    return (
      <Card>
        <p className="text-body-md text-error">Veritabanı bağlantısı yok.</p>
      </Card>
    );
  }
  if (!recipe) notFound();
  const mediaAssets = await loadMediaOptions();

  const nutrients = recipe.nutrientsPerServingJson as {
    kcal?: number;
    proteinG?: number;
    carbG?: number;
    fatG?: number;
  } | null;
  const meta = extractRecipeMeta(recipe.instructionsJson);

  return (
    <div className="space-y-space-md">
      {sp.saved ? (
        <p role="status" className="text-body-sm text-primary">
          Kaydedildi.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-space-sm">
        <Link href="/admin/tarifler" className="text-label-md text-primary">
          ← Liste
        </Link>
        <Link
          href={`/tarifler/${recipe.slug}`}
          className="text-label-md text-on-surface-variant"
        >
          Public önizleme
        </Link>
      </div>
      <Card>
        <h1 className="mb-space-lg text-headline-md">Tarifi düzenle</h1>
        <RecipeForm
          id={recipe.id}
          mediaAssets={mediaAssets}
          initial={{
            title: recipe.title,
            slug: recipe.slug,
            excerpt: recipe.excerpt,
            steps: extractRecipeSteps(recipe.instructionsJson),
            difficulty: meta.difficulty,
            tips: meta.tips,
            allergens: meta.allergens,
            servingCount: recipe.servingCount,
            prepMinutes: recipe.prepMinutes,
            cookMinutes: recipe.cookMinutes,
            categoryTitle: recipe.category?.title,
            status: recipe.status,
            seoTitle: recipe.seoTitle,
            seoDescription: recipe.seoDescription,
            coverMediaId: recipe.coverMediaId,
            ingredients: recipe.ingredients.map((ing) => ({
              name: ing.name,
              quantityDecimal: Number(ing.quantityDecimal),
              unit: ing.unit,
              note: ing.note ?? "",
            })),
            nutrients:
              nutrients &&
              typeof nutrients.kcal === "number" &&
              typeof nutrients.proteinG === "number" &&
              typeof nutrients.carbG === "number" &&
              typeof nutrients.fatG === "number"
                ? {
                    kcal: nutrients.kcal,
                    proteinG: nutrients.proteinG,
                    carbG: nutrients.carbG,
                    fatG: nutrients.fatG,
                  }
                : null,
            nutrientSource: recipe.nutrientSource,
          }}
        />
      </Card>
    </div>
  );
}
