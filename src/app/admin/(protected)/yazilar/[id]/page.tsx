import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { Card } from "@/components/ui/Card";
import { loadMediaOptions } from "@/lib/admin/media-options";
import {
  getPostForAdmin,
  listPostCategories,
} from "@/server/repositories/blog-repository";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function EditPostPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  let post;
  let categories: Awaited<ReturnType<typeof listPostCategories>> = [];
  try {
    [post, categories] = await Promise.all([
      getPostForAdmin(id),
      listPostCategories(),
    ]);
  } catch {
    return (
      <Card>
        <p className="text-body-md text-error">Veritabanı bağlantısı yok.</p>
      </Card>
    );
  }
  if (!post) notFound();
  const mediaAssets = await loadMediaOptions();

  return (
    <div className="space-y-space-md">
      {sp.saved ? (
        <p role="status" className="text-body-sm text-primary">
          Kaydedildi.
        </p>
      ) : null}
      <div className="flex flex-wrap gap-space-sm">
        <Link href="/admin/yazilar" className="text-label-md text-primary">
          ← Liste
        </Link>
        <Link
          href={`/blog/${post.slug}`}
          className="text-label-md text-on-surface-variant"
        >
          Public önizleme
        </Link>
      </div>
      <Card>
        <h1 className="mb-space-lg text-headline-md">Yazıyı düzenle</h1>
        <BlogPostForm
          id={post.id}
          mediaAssets={mediaAssets}
          categories={categories.map((c) => ({
            slug: c.slug,
            title: c.title,
          }))}
          initial={{
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            contentJson: post.contentJson,
            categoryTitle: post.category?.title,
            tags: (post.tagsJson as string[] | null) ?? [],
            references: (post.referencesJson as string[] | null) ?? [],
            status: post.status,
            seoTitle: post.seoTitle,
            seoDescription: post.seoDescription,
            coverMediaId: post.coverMediaId,
          }}
        />
      </Card>
    </div>
  );
}
