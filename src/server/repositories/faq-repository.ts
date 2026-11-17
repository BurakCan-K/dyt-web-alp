import { prisma } from "@/lib/db";
import { faqUpsertSchema } from "@/lib/validators/content";

export async function listFaqsForAdmin() {
  return prisma.faq.findMany({ orderBy: [{ position: "asc" }, { updatedAt: "desc" }] });
}

export async function getFaqForAdmin(id: string) {
  return prisma.faq.findUnique({ where: { id } });
}

export async function upsertFaq(id: string | null, raw: unknown) {
  const data = faqUpsertSchema.parse(raw);
  if (id) {
    return prisma.faq.update({ where: { id }, data });
  }
  return prisma.faq.create({ data });
}

export async function deleteFaq(id: string) {
  return prisma.faq.delete({ where: { id } });
}

export async function findPublishedFaqs() {
  return prisma.faq.findMany({
    where: { published: true },
    orderBy: { position: "asc" },
  });
}
