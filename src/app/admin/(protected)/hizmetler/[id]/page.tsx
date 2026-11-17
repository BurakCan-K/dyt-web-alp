import Link from "next/link";
import { notFound } from "next/navigation";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { Card } from "@/components/ui/Card";
import { loadMediaOptions } from "@/lib/admin/media-options";
import { getServiceForAdmin } from "@/server/repositories/service-repository";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditServicePage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  let service;
  try {
    service = await getServiceForAdmin(id);
  } catch {
    return (
      <Card>
        <p className="text-error">Veritabanı bağlantısı yok.</p>
      </Card>
    );
  }
  if (!service) notFound();
  const mediaAssets = await loadMediaOptions();

  return (
    <div className="space-y-space-md">
      {sp.saved ? (
        <p role="status" className="text-body-sm text-primary">
          Kaydedildi.
        </p>
      ) : null}
      <Link href="/admin/hizmetler" className="text-label-md text-primary">
        ← Liste
      </Link>
      <Card>
        <h1 className="mb-space-lg text-headline-md">Hizmeti düzenle</h1>
        <ServiceForm
          id={service.id}
          mediaAssets={mediaAssets}
          initial={{
            title: service.title,
            slug: service.slug,
            summary: service.summary,
            descriptionJson: service.descriptionJson,
            position: service.position,
            isFeatured: service.isFeatured,
            status: service.status,
            seoTitle: service.seoTitle,
            seoDescription: service.seoDescription,
            imageId: service.imageId,
          }}
        />
      </Card>
    </div>
  );
}
