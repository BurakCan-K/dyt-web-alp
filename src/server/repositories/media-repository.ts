import type { MediaProvider, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";

export async function listMediaAssets(opts?: { q?: string }) {
  const where: Prisma.MediaAssetWhereInput = {};
  if (opts?.q?.trim()) {
    where.OR = [
      { alt: { contains: opts.q.trim() } },
      { url: { contains: opts.q.trim() } },
      { providerPublicId: { contains: opts.q.trim() } },
    ];
  }
  return prisma.mediaAsset.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          siteLogos: true,
          serviceImages: true,
          postCovers: true,
          recipeCovers: true,
          guideCovers: true,
        },
      },
    },
  });
}

export async function getMediaAsset(id: string) {
  return prisma.mediaAsset.findUnique({ where: { id } });
}

export async function createMediaAsset(data: {
  provider: MediaProvider;
  providerPublicId: string;
  url: string;
  alt: string;
  mimeType: string;
  bytes: number;
  width: number | null;
  height: number | null;
}) {
  return prisma.mediaAsset.create({ data });
}

export async function updateMediaAlt(id: string, alt: string) {
  return prisma.mediaAsset.update({
    where: { id },
    data: { alt: alt.slice(0, 300) },
  });
}

export async function countMediaUsages(id: string) {
  const [siteLogos, serviceImages, postCovers, recipeCovers, guideCovers] =
    await Promise.all([
      prisma.siteSettings.count({ where: { logoMediaId: id } }),
      prisma.service.count({ where: { imageId: id } }),
      prisma.blogPost.count({ where: { coverMediaId: id } }),
      prisma.recipe.count({ where: { coverMediaId: id } }),
      prisma.nutritionGuide.count({ where: { coverMediaId: id } }),
    ]);
  return {
    total:
      siteLogos + serviceImages + postCovers + recipeCovers + guideCovers,
    siteLogos,
    serviceImages,
    postCovers,
    recipeCovers,
    guideCovers,
  };
}

export async function deleteMediaAssetRecord(id: string) {
  return prisma.mediaAsset.delete({ where: { id } });
}
