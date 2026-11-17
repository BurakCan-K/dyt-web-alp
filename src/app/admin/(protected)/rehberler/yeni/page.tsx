import { GuideForm } from "@/components/admin/GuideForm";
import { Card } from "@/components/ui/Card";
import { loadMediaOptions } from "@/lib/admin/media-options";
import { EMPTY_DOC } from "@/lib/richtext/types";

export default async function NewGuidePage() {
  const mediaAssets = await loadMediaOptions();
  return (
    <Card>
      <h1 className="mb-space-lg text-headline-md">Yeni rehber</h1>
      <GuideForm
        mediaAssets={mediaAssets}
        initial={{
          title: "",
          slug: "",
          intro: "",
          contentJson: EMPTY_DOC,
          status: "DRAFT",
          meals: [{ name: "Kahvaltı", itemsText: "" }],
        }}
      />
    </Card>
  );
}
