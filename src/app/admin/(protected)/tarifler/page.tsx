import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/site/EmptyState";
import {
  listRecipeCategories,
  listRecipesForAdmin,
} from "@/server/repositories/recipe-repository";
import {
  deleteRecipeAction,
  setRecipeStatusAction,
} from "@/server/actions/recipe-actions";
import type { ContentStatus } from "@/generated/prisma/client";

type Props = {
  searchParams: Promise<{ status?: string; q?: string; kategori?: string }>;
};

export default async function AdminRecipesPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = (sp.status as ContentStatus | "ALL" | undefined) ?? "ALL";
  const q = sp.q ?? "";
  const kategori = sp.kategori ?? "";

  let recipes: Awaited<ReturnType<typeof listRecipesForAdmin>> = [];
  let categories: Awaited<ReturnType<typeof listRecipeCategories>> = [];
  let error: string | null = null;
  try {
    categories = await listRecipeCategories();
    const categoryId = kategori
      ? categories.find((c) => c.slug === kategori)?.id
      : undefined;
    recipes = await listRecipesForAdmin({ status, q, categoryId });
  } catch {
    error =
      "Veritabanına bağlanılamadı. Local MySQL ve migration gerekli (Prompt 04).";
  }

  return (
    <div className="space-y-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <h1 className="text-headline-md text-on-surface">Tarifler</h1>
        <Button href="/admin/tarifler/yeni">Yeni tarif</Button>
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
          <label className="flex flex-col gap-1 text-label-sm">
            Kategori
            <select
              name="kategori"
              defaultValue={kategori}
              className="rounded-xl bg-surface-container-low px-space-md py-space-sm"
            >
              <option value="">Tümü</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.title}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" variant="secondary">
            Filtrele
          </Button>
        </form>
      </Card>

      {error ? (
        <EmptyState title="DB hatası" description={error} />
      ) : recipes.length === 0 ? (
        <EmptyState
          title="Tarif yok"
          description="Yeni tarif oluşturun veya filtreyi değiştirin."
        />
      ) : (
        <ul className="space-y-space-sm">
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <Card className="flex flex-col gap-space-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <Link
                      href={`/admin/tarifler/${recipe.id}`}
                      className="text-headline-sm hover:text-primary"
                    >
                      {recipe.title}
                    </Link>
                    <StatusBadge status={recipe.status} />
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    /{recipe.slug}
                    {recipe.category ? ` · ${recipe.category.title}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-space-xs">
                  <form action={setRecipeStatusAction}>
                    <input type="hidden" name="id" value={recipe.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={
                        recipe.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
                      }
                    />
                    <Button type="submit" variant="secondary">
                      {recipe.status === "PUBLISHED" ? "Taslağa al" : "Yayınla"}
                    </Button>
                  </form>
                  <Button href={`/tarifler/${recipe.slug}`} variant="ghost">
                    Önizle
                  </Button>
                  <form action={deleteRecipeAction}>
                    <input type="hidden" name="id" value={recipe.id} />
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
