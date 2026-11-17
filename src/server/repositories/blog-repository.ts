import type { ContentStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { sanitizeTipTapDoc } from "@/lib/richtext/sanitize";
import { slugify, uniqueSlug } from "@/lib/slug";
import { blogPostUpsertSchema } from "@/lib/validators/content";

export async function listPostsForAdmin(opts?: {
  status?: ContentStatus | "ALL";
  q?: string;
  categorySlug?: string;
}) {
  const where: Prisma.BlogPostWhereInput = { deletedAt: null };
  if (opts?.status && opts.status !== "ALL") {
    where.status = opts.status;
  }
  if (opts?.categorySlug?.trim()) {
    where.category = { slug: opts.categorySlug.trim() };
  }
  if (opts?.q?.trim()) {
    where.OR = [
      { title: { contains: opts.q.trim() } },
      { excerpt: { contains: opts.q.trim() } },
      { slug: { contains: opts.q.trim() } },
    ];
  }
  return prisma.blogPost.findMany({
    where,
    include: { category: true, coverMedia: true },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getPostForAdmin(id: string) {
  return prisma.blogPost.findFirst({
    where: { id, deletedAt: null },
    include: { category: true, coverMedia: true },
  });
}

export async function listPostCategories() {
  return prisma.postCategory.findMany({ orderBy: { position: "asc" } });
}

export async function ensurePostCategory(title: string) {
  const base = slugify(title);
  const existing = await prisma.postCategory.findMany({
    select: { slug: true },
  });
  const slug = uniqueSlug(
    base,
    existing.map((e) => e.slug),
  );
  const found = await prisma.postCategory.findFirst({
    where: { OR: [{ title }, { slug: base }] },
  });
  if (found) return found;
  return prisma.postCategory.create({
    data: { title, slug, position: existing.length },
  });
}

export async function upsertBlogPost(id: string | null, raw: unknown) {
  const data = blogPostUpsertSchema.parse(raw);
  const contentJson = sanitizeTipTapDoc(
    data.contentJson,
  ) as Prisma.InputJsonValue;

  const payload = {
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    contentJson,
    categoryId: data.categoryId ?? null,
    coverMediaId: data.coverMediaId ?? null,
    tagsJson: (data.tagsJson ?? []) as Prisma.InputJsonValue,
    referencesJson: (data.referencesJson ?? []) as Prisma.InputJsonValue,
    status: data.status,
    publishedAt:
      data.status === "PUBLISHED"
        ? (data.publishedAt ?? new Date())
        : data.publishedAt ?? null,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
  };

  if (id) {
    return prisma.blogPost.update({ where: { id }, data: payload });
  }
  return prisma.blogPost.create({ data: payload });
}

export async function softDeleteBlogPost(id: string) {
  return prisma.blogPost.update({
    where: { id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
}

export async function updateBlogPostStatus(id: string, status: ContentStatus) {
  return prisma.blogPost.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
}

export async function findPublishedBlogPosts() {
  return prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
    },
    include: { category: true, coverMedia: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function findPublishedBlogPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
    },
    include: { category: true, coverMedia: true },
  });
}
