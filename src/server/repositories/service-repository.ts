import type { ContentStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { sanitizeTipTapDoc } from "@/lib/richtext/sanitize";
import { serviceUpsertSchema } from "@/lib/validators/content";

export async function listServicesForAdmin(opts?: {
  status?: ContentStatus | "ALL";
  q?: string;
}) {
  const where: Prisma.ServiceWhereInput = { deletedAt: null };
  if (opts?.status && opts.status !== "ALL") where.status = opts.status;
  if (opts?.q?.trim()) {
    where.OR = [
      { title: { contains: opts.q.trim() } },
      { summary: { contains: opts.q.trim() } },
      { slug: { contains: opts.q.trim() } },
    ];
  }
  return prisma.service.findMany({
    where,
    orderBy: [{ position: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getServiceForAdmin(id: string) {
  return prisma.service.findFirst({ where: { id, deletedAt: null } });
}

export async function upsertService(id: string | null, raw: unknown) {
  const data = serviceUpsertSchema.parse(raw);
  const descriptionJson = sanitizeTipTapDoc(
    data.descriptionJson,
  ) as Prisma.InputJsonValue;

  const payload = {
    slug: data.slug,
    title: data.title,
    summary: data.summary,
    descriptionJson,
    position: data.position,
    isFeatured: data.isFeatured,
    status: data.status,
    publishedAt:
      data.status === "PUBLISHED"
        ? (data.publishedAt ?? new Date())
        : data.publishedAt ?? null,
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
    imageId: data.imageId ?? null,
  };

  if (id) {
    return prisma.service.update({ where: { id }, data: payload });
  }
  return prisma.service.create({ data: payload });
}

export async function softDeleteService(id: string) {
  return prisma.service.update({
    where: { id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
}

export async function findPublishedServicesFromDb() {
  return prisma.service.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
    },
    include: { image: true },
    orderBy: [{ position: "asc" }, { publishedAt: "desc" }],
  });
}

export async function findPublishedServiceBySlugFromDb(slug: string) {
  return prisma.service.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
    },
    include: { image: true },
  });
}
