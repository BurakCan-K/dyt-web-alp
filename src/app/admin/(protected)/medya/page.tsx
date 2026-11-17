import { MediaUploadPanel } from "@/components/admin/MediaUploadPanel";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/site/EmptyState";
import { getMediaStorageMode } from "@/lib/media/config";
import {
  deleteUnusedMediaAction,
  updateMediaAltAction,
} from "@/server/actions/media-actions";
import { listMediaAssets } from "@/server/repositories/media-repository";

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function AdminMediaPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const mode = getMediaStorageMode();

  let assets: Awaited<ReturnType<typeof listMediaAssets>> = [];
  let error: string | null = null;
  try {
    assets = await listMediaAssets({ q });
  } catch {
    error =
      "Veritabanına bağlanılamadı. Local MySQL ve migration gerekli (Prompt 04).";
  }

  return (
    <div className="space-y-space-md">
      <h1 className="text-headline-md text-on-surface">Medya</h1>
      <p className="text-body-sm text-on-surface-variant">
        Depo:{" "}
        {mode === "cloudinary"
          ? "Cloudinary yapılandırıldı"
          : mode === "s3"
            ? "S3 seçili (MVP: Cloudinary kullanın)"
            : "Yapılandırılmadı — yükleme reddedilir"}
      </p>

      <MediaUploadPanel />

      <Card>
        <form method="get" className="mb-space-md flex gap-space-sm">
          <input
            name="q"
            defaultValue={q}
            placeholder="Ara"
            className="flex-1 rounded-xl bg-surface-container-low px-space-md py-space-sm"
          />
          <Button type="submit" variant="secondary">
            Filtrele
          </Button>
        </form>

        {error ? (
          <EmptyState title="DB hatası" description={error} />
        ) : assets.length === 0 ? (
          <EmptyState
            title="Medya yok"
            description="Cloudinary env tanımlayıp görsel yükleyin."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-space-md md:grid-cols-2">
            {assets.map((asset) => {
              const usage =
                asset._count.siteLogos +
                asset._count.serviceImages +
                asset._count.postCovers +
                asset._count.recipeCovers +
                asset._count.guideCovers;
              return (
                <li
                  key={asset.id}
                  className="rounded-2xl bg-surface-container-low p-space-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset.url}
                    alt={asset.alt || "Medya"}
                    className="mb-space-sm h-36 w-full rounded-xl object-cover"
                  />
                  <p className="text-label-sm text-on-surface-variant">
                    {asset.mimeType} · {(asset.bytes / 1024).toFixed(1)} KB
                    {asset.width && asset.height
                      ? ` · ${asset.width}×${asset.height}`
                      : ""}
                    {" · "}
                    kullanım: {usage}
                  </p>
                  <form
                    action={updateMediaAltAction}
                    className="mt-space-sm flex flex-col gap-space-xs"
                  >
                    <input type="hidden" name="id" value={asset.id} />
                    <input
                      name="alt"
                      defaultValue={asset.alt}
                      aria-label="Alt text"
                      className="rounded-xl bg-surface-container-lowest px-space-sm py-space-xs text-body-sm"
                    />
                    <Button type="submit" variant="secondary" className="w-fit">
                      Alt kaydet
                    </Button>
                  </form>
                  <form action={deleteUnusedMediaAction} className="mt-space-xs">
                    <input type="hidden" name="id" value={asset.id} />
                    <Button
                      type="submit"
                      variant="ghost"
                      disabled={usage > 0}
                      title={
                        usage > 0
                          ? "Kullanımda — önce bağlantıları kaldırın"
                          : "Güvenli sil"
                      }
                    >
                      {usage > 0 ? "Kullanımda" : "Sil"}
                    </Button>
                  </form>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
