import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { getAdminSession } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Özet",
  path: "/admin",
  noIndex: true,
});

export default async function AdminDashboardPage() {
  const session = await getAdminSession();

  return (
    <div className="space-y-space-md">
      <Card>
        <h1 className="text-headline-md text-on-surface">Özet</h1>
        <p className="mt-space-sm text-body-md text-on-surface-variant">
          Merhaba{session?.user.email ? `, ${session.user.email}` : ""}. İçerik
          sayıları ve CRUD Prompt 06+ ile bağlanacak.
        </p>
      </Card>
      <Card className="bg-surface-container-low shadow-sm">
        <h2 className="text-headline-sm text-on-surface">Durum</h2>
        <ul className="mt-space-sm list-disc space-y-1 pl-5 text-body-sm text-on-surface-variant">
          <li>Oturum: aktif (OWNER)</li>
          <li>Yazma koruması: <code>requireAdmin()</code> hazır</li>
          <li>İçerik CRUD: henüz yok</li>
        </ul>
      </Card>
    </div>
  );
}
