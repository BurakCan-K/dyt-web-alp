import type { ContentStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { sanitizeTipTapDoc } from "@/lib/richtext/sanitize";
import { guideUpsertSchema } from "@/lib/validators/content";

export async function listGuidesForAdmin(opts?: {
  status?: ContentStatus | "ALL";
  q?: string;
}) {
  const where: Prisma.NutritionGuideWhereInput = { deletedAt: null };
  if (opts?.status && opts.status !== "ALL") {
    where.status = opts.status;
  }
  if (opts?.q?.trim()) {
    where.OR = [
      { title: { contains: opts.q.trim() } },
      { intro: { contains: opts.q.trim() } },
      { slug: { contains: opts.q.trim() } },
    ];
  }
  return prisma.nutritionGuide.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getGuideForAdmin(id: string) {
  return prisma.nutritionGuide.findFirst({
    where: { id, deletedAt: null },
  });
}

export async function upsertGuide(id: string | null, raw: unknown) {
  const data = guideUpsertSchema.parse(raw);
  const contentJson = sanitizeTipTapDoc(
    data.contentJson,
  ) as Prisma.InputJsonValue;

  const payload = {
    slug: data.slug,
    title: data.title,
    intro: data.intro,
    contentJson,
    mealPlanJson: (data.mealPlanJson ?? null) as Prisma.InputJsonValue,
    relatedRecipeSlugsJson: (data.relatedRecipeSlugsJson ??
      []) as Prisma.InputJsonValue,
    coverMediaId: data.coverMediaId ?? null,
    status: data.status,
    publishedAt:
      data.status === "PUBLISHED"
        ? (data.publishedAt ?? new Date())
        : (data.publishedAt ?? null),
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
  };

  if (id) {
    return prisma.nutritionGuide.update({ where: { id }, data: payload });
  }
  return prisma.nutritionGuide.create({ data: payload });
}

export async function softDeleteGuide(id: string) {
  return prisma.nutritionGuide.update({
    where: { id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
}

export async function updateGuideStatus(id: string, status: ContentStatus) {
  return prisma.nutritionGuide.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
}

export async function findPublishedGuidesFromDb() {
  return prisma.nutritionGuide.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function findPublishedGuideBySlugFromDb(slug: string) {
  return prisma.nutritionGuide.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
    },
  });
}
