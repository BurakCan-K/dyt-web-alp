import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { EmptyState } from "@/components/site/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { deleteServiceAction } from "@/server/actions/service-actions";
import { listServicesForAdmin } from "@/server/repositories/service-repository";

export default async function AdminServicesPage() {
  let services: Awaited<ReturnType<typeof listServicesForAdmin>> = [];
  let error: string | null = null;
  try {
    services = await listServicesForAdmin();
  } catch {
    error = "Veritabanına bağlanılamadı.";
  }

  return (
    <div className="space-y-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <h1 className="text-headline-md">Hizmetler</h1>
        <Button href="/admin/hizmetler/yeni">Yeni hizmet</Button>
      </div>
      {error ? (
        <EmptyState title="DB hatası" description={error} />
      ) : services.length === 0 ? (
        <EmptyState title="Hizmet yok" />
      ) : (
        <ul className="space-y-space-sm">
          {services.map((s) => (
            <li key={s.id}>
              <Card className="flex flex-col gap-space-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <Link
                      href={`/admin/hizmetler/${s.id}`}
                      className="text-headline-sm hover:text-primary"
                    >
                      {s.title}
                    </Link>
                    <StatusBadge status={s.status} />
                    {s.isFeatured ? (
                      <span className="text-label-sm text-secondary">Öne çıkan</span>
                    ) : null}
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    sıra {s.position} · /{s.slug}
                  </p>
                </div>
                <form action={deleteServiceAction}>
                  <input type="hidden" name="id" value={s.id} />
                  <Button type="submit" variant="ghost">
                    Arşivle
                  </Button>
                </form>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
