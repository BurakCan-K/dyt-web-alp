import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/site/EmptyState";
import {
  listPostCategories,
  listPostsForAdmin,
} from "@/server/repositories/blog-repository";
import {
  deleteBlogPostAction,
  setBlogPostStatusAction,
} from "@/server/actions/blog-actions";
import type { ContentStatus } from "@/generated/prisma/client";

type Props = {
  searchParams: Promise<{ status?: string; q?: string; kategori?: string }>;
};

export default async function AdminPostsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = (sp.status as ContentStatus | "ALL" | undefined) ?? "ALL";
  const q = sp.q ?? "";
  const kategori = sp.kategori ?? "";

  let posts: Awaited<ReturnType<typeof listPostsForAdmin>> = [];
  let categories: Awaited<ReturnType<typeof listPostCategories>> = [];
  let error: string | null = null;
  try {
    [posts, categories] = await Promise.all([
      listPostsForAdmin({ status, q, categorySlug: kategori || undefined }),
      listPostCategories(),
    ]);
  } catch {
    error =
      "Veritabanına bağlanılamadı. Local MySQL ve migration gerekli (Prompt 04).";
  }

  return (
    <div className="space-y-space-md">
      <div className="flex flex-wrap items-center justify-between gap-space-sm">
        <h1 className="text-headline-md text-on-surface">Yazılar</h1>
        <Button href="/admin/yazilar/yeni">Yeni yazı</Button>
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
              <option value="DRAFT">Taslak</option>
              <option value="PUBLISHED">Yayında</option>
              <option value="ARCHIVED">Arşiv</option>
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
                <option key={c.slug} value={c.slug}>
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
      ) : posts.length === 0 ? (
        <EmptyState
          title="Yazı yok"
          description="Yeni yazı oluşturun veya filtreyi değiştirin."
        />
      ) : (
        <ul className="space-y-space-sm">
          {posts.map((post) => (
            <li key={post.id}>
              <Card className="flex flex-col gap-space-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-space-sm">
                    <Link
                      href={`/admin/yazilar/${post.id}`}
                      className="text-headline-sm hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <StatusBadge status={post.status} />
                  </div>
                  <p className="text-body-sm text-on-surface-variant">
                    /{post.slug}
                    {post.category ? ` · ${post.category.title}` : ""}
                    {post.coverMedia ? " · kapak var" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-space-xs">
                  <form action={setBlogPostStatusAction}>
                    <input type="hidden" name="id" value={post.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={
                        post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
                      }
                    />
                    <Button type="submit" variant="secondary">
                      {post.status === "PUBLISHED" ? "Taslağa al" : "Yayınla"}
                    </Button>
                  </form>
                  <Button href={`/blog/${post.slug}`} variant="ghost">
                    Önizle
                  </Button>
                  <form action={deleteBlogPostAction}>
                    <input type="hidden" name="id" value={post.id} />
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
