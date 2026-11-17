import { ServiceForm } from "@/components/admin/ServiceForm";
import { Card } from "@/components/ui/Card";
import { loadMediaOptions } from "@/lib/admin/media-options";
import { EMPTY_DOC } from "@/lib/richtext/types";

export default async function NewServicePage() {
  const mediaAssets = await loadMediaOptions();
  return (
    <Card>
      <h1 className="mb-space-lg text-headline-md">Yeni hizmet</h1>
      <ServiceForm
        mediaAssets={mediaAssets}
        initial={{
          title: "",
          slug: "",
          summary: "",
          descriptionJson: EMPTY_DOC,
          position: 0,
          isFeatured: false,
          status: "DRAFT",
        }}
      />
    </Card>
  );
}
