import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichTextView } from "@/components/content/RichTextView";
import { JsonLd } from "@/components/seo/JsonLd";
import { ShareButtons } from "@/components/site/ShareButtons";
import { Container } from "@/components/ui/Container";
import { loadPublicPost, loadPublicPosts } from "@/lib/content/public-source";
import { buildMetadata } from "@/lib/seo";
import { articleJsonLd } from "@/lib/seo/json-ld";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const posts = await loadPublicPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await loadPublicPost(slug);
  if (!post) return buildMetadata({ title: "Yazı bulunamadı", noIndex: true });
  return buildMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = await loadPublicPost(slug);
  if (!post) notFound();

  return (
    <Container className="py-space-xl">
      <JsonLd
        data={articleJsonLd({
          title: post.title,
          description: post.seoDescription ?? post.excerpt,
          path: `/blog/${post.slug}`,
          publishedAt: post.publishedAt,
        })}
      />
      <p className="text-label-sm text-tertiary">
        {post.categoryTitle} · {post.publishedAt}
      </p>
      <h1 className="mt-space-xs max-w-3xl text-headline-lg text-on-surface">
        {post.title}
      </h1>
      <p className="mt-space-md max-w-2xl text-body-lg text-on-surface-variant">
        {post.excerpt}
      </p>
      {post.tags.length > 0 ? (
        <ul className="mt-space-md flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-surface-container px-space-sm py-0.5 text-label-sm text-on-surface-variant"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      {post.coverImageUrl ? (
        <div className="relative mt-space-lg aspect-[21/9] max-w-4xl overflow-hidden rounded-[1.75rem] bg-surface-container">
          <Image
            src={post.coverImageUrl}
            alt={post.coverImageAlt ?? post.title}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 896px"
            priority
          />
        </div>
      ) : null}
      <div className="mt-space-lg">
        <ShareButtons title={post.title} path={`/blog/${post.slug}`} />
      </div>
      <article className="mt-space-xl max-w-3xl">
        <RichTextView doc={post.bodyDoc} />
      </article>
      {post.references.length > 0 ? (
        <section className="mt-space-xl max-w-3xl" aria-labelledby="kaynaklar">
          <h2 id="kaynaklar" className="text-headline-sm text-on-surface">
            Kaynaklar
          </h2>
          <ul className="mt-space-sm list-disc space-y-1 pl-5 text-body-sm text-on-surface-variant">
            {post.references.map((ref) => (
              <li key={ref}>{ref}</li>
            ))}
          </ul>
        </section>
      ) : null}
      <Link
        href="/blog"
        className="mt-space-lg inline-block text-label-md text-primary hover:underline"
      >
        ← Blog listesi
      </Link>
    </Container>
  );
}
