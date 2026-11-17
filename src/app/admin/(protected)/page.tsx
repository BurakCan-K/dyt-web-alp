import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getAdminSession } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo";
import { runLaunchSeedAction } from "@/server/actions/bootstrap-actions";

export const metadata: Metadata = buildMetadata({
  title: "Admin Özet",
  path: "/admin",
  noIndex: true,
});

type Props = {
  searchParams: Promise<{
    seeded?: string;
    seed_error?: string;
    posts?: string;
    services?: string;
    recipes?: string;
  }>;
};

export default async function AdminDashboardPage({ searchParams }: Props) {
  const session = await getAdminSession();
  const sp = await searchParams;

  return (
    <div className="space-y-space-md">
      <Card>
        <h1 className="text-headline-md text-on-surface">Özet</h1>
        <p className="mt-space-sm text-body-md text-on-surface-variant">
          Merhaba{session?.user.email ? `, ${session.user.email}` : ""}. Yazılar,
          tarifler, hizmetler, medya ve site ayarlarını sol menüden yönetin.
        </p>
        {sp.seeded === "1" ? (
          <p className="mt-space-sm text-body-sm text-primary">
            Örnek içerik yüklendi — yazı: {sp.posts}, hizmet: {sp.services},
            tarif: {sp.recipes}.
          </p>
        ) : null}
        {sp.seed_error === "confirm" ? (
          <p className="mt-space-sm text-body-sm text-error">
            Onay için alana tam olarak SEED yazın.
          </p>
        ) : null}
      </Card>

      <Card className="bg-surface-container-low shadow-sm">
        <h2 className="text-headline-sm text-on-surface">İlk kurulum</h2>
        <p className="mt-space-sm text-body-sm text-on-surface-variant">
          Canlı veritabanı boşsa örnek blog, hizmet, tarif, rehber ve SSS
          kayıtlarını bir kez yükleyin. Mevcut slug&apos;lar güncellenir;
          admin hesabına dokunulmaz. Marka/iletişim için Site ayarlarını
          düzenleyin.
        </p>
        <form action={runLaunchSeedAction} className="mt-space-md flex flex-col gap-space-sm sm:flex-row sm:items-end">
          <label className="flex flex-1 flex-col gap-1 text-label-sm">
            Onay (SEED yazın)
            <input
              name="confirm"
              autoComplete="off"
              placeholder="SEED"
              className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm"
            />
          </label>
          <Button type="submit">Örnek içeriği yükle</Button>
        </form>
      </Card>

      <Card className="bg-surface-container-low shadow-sm">
        <h2 className="text-headline-sm text-on-surface">Medya</h2>
        <p className="mt-space-sm text-body-sm text-on-surface-variant">
          Cloudinary&apos;de daha önce yüklenen görseller otomatik listelenmez.
          Medya sayfasındaki &quot;Cloudinary&apos;den içe aktar&quot; ile{" "}
          <code>dyt-web</code> klasörünü DB&apos;ye çekin veya yeni dosya yükleyin.
        </p>
      </Card>
    </div>
  );
}
