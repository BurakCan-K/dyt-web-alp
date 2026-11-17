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

export async function findMediaByProviderPublicId(
  provider: MediaProvider,
  providerPublicId: string,
) {
  return prisma.mediaAsset.findFirst({
    where: { provider, providerPublicId },
  });
}

/** Cloudinary public_id yoksa oluşturur; varsa URL/boyut günceller. */
export async function upsertCloudinaryMediaAsset(data: {
  providerPublicId: string;
  url: string;
  alt: string;
  mimeType: string;
  bytes: number;
  width: number | null;
  height: number | null;
}) {
  const existing = await findMediaByProviderPublicId(
    "CLOUDINARY",
    data.providerPublicId,
  );
  if (existing) {
    const asset = await prisma.mediaAsset.update({
      where: { id: existing.id },
      data: {
        url: data.url,
        mimeType: data.mimeType,
        bytes: data.bytes,
        width: data.width,
        height: data.height,
        alt: existing.alt || data.alt,
      },
    });
    return { asset, created: false as const };
  }
  const asset = await prisma.mediaAsset.create({
    data: {
      provider: "CLOUDINARY",
      providerPublicId: data.providerPublicId,
      url: data.url,
      alt: data.alt,
      mimeType: data.mimeType,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
    },
  });
  return { asset, created: true as const };
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
