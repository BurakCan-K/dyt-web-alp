import type { ContentStatus } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

/** Public yüzeyde yalnızca yayınlanmış ve tarihi gelmiş içerik */
export function isPubliclyVisible(
  status: ContentStatus,
  publishedAt: Date | null,
  deletedAt?: Date | null,
) {
  if (deletedAt) return false;
  if (status !== "PUBLISHED") return false;
  if (!publishedAt) return false;
  return publishedAt.getTime() <= Date.now();
}

export async function findPublishedServices() {
  return prisma.service.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
    },
    orderBy: [{ position: "asc" }, { publishedAt: "desc" }],
  });
}

export async function findPublishedServiceBySlug(slug: string) {
  const service = await prisma.service.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
    },
  });
  return service;
}

export async function findPublishedPosts() {
  return prisma.blogPost.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
    },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getSiteSettings() {
  return prisma.siteSettings.findUnique({ where: { id: "default" } });
}
