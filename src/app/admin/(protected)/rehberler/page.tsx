import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/site/EmptyState";
import { listGuidesForAdmin } from "@/server/repositories/guide-repository";
import {
  deleteGuideAction,
  setGuideStatusAction,
} from "@/server/actions/guide-actions";
import type { ContentStatus } from "@/generated/prisma/client";

type Props = {
  searchParams: Promise<{ status?: string; q?: string }>;
};

export default async function AdminGuidesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = (sp.status as ContentStatus | "ALL" | undefined) ?? "ALL";
  const q = sp.q ?? "";

  let guides: Awaited<ReturnType<typeof listGuidesForAdmin>> = [];
  let error: string | null = null;
  try {
    guides = await listGuidesForAdmin({ status, q });
  } catch {
    error =
      "Veritabanına bağlanılamadı. Local MySQL ve migration gerekli (Prompt 04).";
  }

  return (
    <div className="space-y-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <h1 className="text-headline-md text-on-surface">Rehberler</h1>
        <Button href="/admin/rehberler/yeni">Yeni rehber</Button>
      </div>

      <Card className="bg-surface shadow-sm">
        <form
          className="flex flex-col gap-space-sm md:flex-row md:items-end"
          method="get"
        >
          <label className="flex flex-1 flex-col gap-1 text-label-sm">
            Ara
            <input
              name="q"
              defaultValue={q}
              className="rounded-xl bg-surface-container-low px-space-md py-space-sm"
            />
          </label>
          <label className="flex flex-col gap-1 text-label-sm">
            Durum
            <select
              name="status"
              defaultValue={status}
              className="rounded-xl bg-surface-container-low px-space-md py-space-sm"
            >
              <option value="ALL">Tümü</option>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </label>
          <Button type="submit" variant="secondary">
            Filtrele
          </Button>
        </form>
      </Card>

      {error ? (
        <EmptyState title="DB hatası" description={error} />
      ) : guides.length === 0 ? (
        <EmptyState
          title="Rehber yok"
          description="Yeni rehber oluşturun veya filtreyi değiştirin."
        />
      ) : (
        <ul className="space-y-space-sm">
          {guides.map((guide) => (
            <li key={guide.id}>
              <Card className="flex flex-col gap-space-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <Link
                      href={`/admin/rehberler/${guide.id}`}
                      className="text-headline-sm hover:text-primary"
                    >
                      {guide.title}
                    </Link>
                    <StatusBadge status={guide.status} />
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    /{guide.slug}
                  </p>
                </div>
                <div className="flex flex-wrap gap-space-xs">
                  <form action={setGuideStatusAction}>
                    <input type="hidden" name="id" value={guide.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={
                        guide.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
                      }
                    />
                    <Button type="submit" variant="secondary">
                      {guide.status === "PUBLISHED" ? "Taslağa al" : "Yayınla"}
                    </Button>
                  </form>
                  <Button
                    href={`/beslenme-rehberleri/${guide.slug}`}
                    variant="ghost"
                  >
                    Önizle
                  </Button>
                  <form action={deleteGuideAction}>
                    <input type="hidden" name="id" value={guide.id} />
                    <Button type="submit" variant="ghost">
                      Arşivle
                    </Button>
                  </form>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
