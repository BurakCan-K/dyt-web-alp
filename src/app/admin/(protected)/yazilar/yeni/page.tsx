import { BlogPostForm } from "@/components/admin/BlogPostForm";
import { Card } from "@/components/ui/Card";
import { loadMediaOptions } from "@/lib/admin/media-options";
import { EMPTY_DOC } from "@/lib/richtext/types";
import { listPostCategories } from "@/server/repositories/blog-repository";

export default async function NewPostPage() {
  const [mediaAssets, categories] = await Promise.all([
    loadMediaOptions(),
    listPostCategories().catch(() => []),
  ]);
  return (
    <Card>
      <h1 className="mb-space-lg text-headline-md">Yeni yazı</h1>
      <BlogPostForm
        mediaAssets={mediaAssets}
        categories={categories.map((c) => ({ slug: c.slug, title: c.title }))}
        initial={{
          title: "",
          slug: "",
          excerpt: "",
          contentJson: EMPTY_DOC,
          status: "DRAFT",
          categoryTitle: categories[0]?.title,
        }}
      />
    </Card>
  );
}
