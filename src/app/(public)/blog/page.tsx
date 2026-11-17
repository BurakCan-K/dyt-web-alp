import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmptyState } from "@/components/site/EmptyState";
import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";
import { postCategories } from "@/data/content";
import { PAGE_SEO } from "@/data/site-defaults";
import { loadPublicPosts } from "@/lib/content/public-source";
import { paginate } from "@/lib/content-query";
import { buildMetadata } from "@/lib/seo";
import { cn } from "@/lib/cn";

export const metadata: Metadata = buildMetadata({
  title: PAGE_SEO.blog.title,
  description: PAGE_SEO.blog.description,
  path: "/blog",
});

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{ q?: string; kategori?: string; page?: string }>;
};

const PAGE_SIZE = 6;

export default async function BlogPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q ?? "";
  const kategori = sp.kategori ?? "";
  const page = Number(sp.page ?? "1");

  const all = await loadPublicPosts();
  const filtered = all.filter((post) => {
    if (kategori && post.categorySlug !== kategori) return false;
    if (!q.trim()) return true;
    const hay = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
    return hay.includes(q.trim().toLowerCase());
  });
  const { items, page: current, totalPages, total } = paginate(
    filtered,
    page,
    PAGE_SIZE,
  );

  function hrefFor(next: { q?: string; kategori?: string; page?: number }) {
    const params = new URLSearchParams();
    const qq = next.q ?? q;
    const kk = next.kategori ?? kategori;
    const pp = next.page ?? 1;
    if (qq) params.set("q", qq);
    if (kk) params.set("kategori", kk);
    if (pp > 1) params.set("page", String(pp));
    const s = params.toString();
    return s ? `/blog?${s}` : "/blog";
  }

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Bilgilendirme yazıları"
        description="Yalnızca yayınlanmış içerikler listelenir. Teşhis veya kişiye özel tedavi içermez."
      />
      <Container className="pb-space-xl">
        <form
          className="mb-space-lg flex flex-col gap-space-sm rounded-3xl bg-surface-container-low p-space-md md:flex-row md:items-end"
          action="/blog"
          method="get"
        >
          <label className="flex flex-1 flex-col gap-1 text-label-sm text-on-surface">
            Ara
            <input
              name="q"
              defaultValue={q}
              placeholder="Başlık veya etiket"
              className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md shadow-sm"
            />
          </label>
          {kategori ? (
            <input type="hidden" name="kategori" value={kategori} />
          ) : null}
          <button
            type="submit"
            className="rounded-full bg-primary-container px-space-lg py-space-sm text-label-md text-on-primary"
          >
            Filtrele
          </button>
        </form>

        <div className="mb-space-lg flex flex-wrap gap-space-xs">
          <Link
            href={hrefFor({ kategori: "", page: 1 })}
            className={cn(
              "rounded-full px-space-md py-space-xs text-label-sm",
              !kategori
                ? "bg-primary-container text-on-primary-container"
                : "bg-surface-container text-on-surface-variant",
            )}
          >
            Tümü
          </Link>
          {postCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={hrefFor({ kategori: cat.slug, page: 1 })}
              className={cn(
                "rounded-full px-space-md py-space-xs text-label-sm",
                kategori === cat.slug
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container text-on-surface-variant",
              )}
            >
              {cat.title}
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <EmptyState
            title="Sonuç bulunamadı"
            description="Farklı bir arama deneyin veya admin panelinden yayınlanmış yazı ekleyin."
          />
        ) : (
          <>
            <p className="mb-space-md text-body-sm text-on-surface-variant">
              {total} yazı
              {all[0]?.source === "fixture" ? " (örnek fixture)" : ""}
            </p>
            <ul className="grid grid-cols-1 gap-space-md md:grid-cols-2">
              {items.map((post) => (
                <li key={post.slug}>
                  <article className="flex h-full flex-col overflow-hidden rounded-3xl bg-surface-container-lowest shadow-sm">
                    {post.coverImageUrl ? (
                      <Link
                        href={`/blog/${post.slug}`}
                        className="relative block aspect-[16/10] overflow-hidden bg-surface-container"
                      >
                        <Image
                          src={post.coverImageUrl}
                          alt={post.coverImageAlt ?? post.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-[1.02] motion-reduce:transform-none"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </Link>
                    ) : null}
                    <div className="flex flex-1 flex-col p-space-lg">
                      <span className="text-label-sm text-tertiary">
                        {post.categoryTitle} · {post.publishedAt}
                      </span>
                      <h2 className="mt-space-sm text-headline-sm text-on-surface">
                        <Link
                          href={`/blog/${post.slug}`}
                          className="hover:text-primary"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="mt-space-sm flex-1 text-body-sm text-on-surface-variant">
                        {post.excerpt}
                      </p>
                      {post.tags.length > 0 ? (
                        <ul className="mt-space-sm flex flex-wrap gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full bg-surface-container px-space-sm py-0.5 text-label-sm text-on-surface-variant"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-space-md text-label-md font-semibold text-primary"
                      >
                        Oku →
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
            {totalPages > 1 ? (
              <nav
                className="mt-space-lg flex items-center justify-center gap-space-sm"
                aria-label="Sayfalama"
              >
                {current > 1 ? (
                  <Link
                    href={hrefFor({ page: current - 1 })}
                    className="rounded-full bg-surface-container px-space-md py-space-xs text-label-md"
                  >
                    Önceki
                  </Link>
                ) : null}
                <span className="text-body-sm text-on-surface-variant">
                  {current} / {totalPages}
                </span>
                {current < totalPages ? (
                  <Link
                    href={hrefFor({ page: current + 1 })}
                    className="rounded-full bg-surface-container px-space-md py-space-xs text-label-md"
                  >
                    Sonraki
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </>
        )}
      </Container>
    </>
  );
}
