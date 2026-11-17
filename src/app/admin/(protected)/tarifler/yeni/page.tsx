import { RecipeForm } from "@/components/admin/RecipeForm";
import { Card } from "@/components/ui/Card";
import { loadMediaOptions } from "@/lib/admin/media-options";

export default async function NewRecipePage() {
  const mediaAssets = await loadMediaOptions();
  return (
    <Card>
      <h1 className="mb-space-lg text-headline-md">Yeni tarif</h1>
      <RecipeForm
        mediaAssets={mediaAssets}
        initial={{
          title: "",
          slug: "",
          excerpt: "",
          steps: [],
          servingCount: 1,
          prepMinutes: 0,
          cookMinutes: 0,
          status: "DRAFT",
          ingredients: [{ name: "", quantityDecimal: "", unit: "g", note: "" }],
        }}
      />
    </Card>
  );
}
