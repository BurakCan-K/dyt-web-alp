import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { siteSettingsUpdateSchema } from "@/lib/validators/content";

export const SITE_SETTINGS_ID = "default";

export async function getSiteSettingsForAdmin() {
  return prisma.siteSettings.findUnique({
    where: { id: SITE_SETTINGS_ID },
    include: { logoMedia: true },
  });
}

export async function getSiteSettingsPublic() {
  return prisma.siteSettings.findUnique({
    where: { id: SITE_SETTINGS_ID },
    include: { logoMedia: true },
  });
}

export async function upsertSiteSettings(raw: unknown) {
  const data = siteSettingsUpdateSchema.parse(raw);
  const payload = {
    brandName: data.brandName,
    dietitianName: data.dietitianName,
    professionalTitle: data.professionalTitle,
    heroTitle: data.heroTitle,
    heroSubtitle: data.heroSubtitle,
    biography: data.biography ?? null,
    phone: data.phone || null,
    whatsappE164: data.whatsappE164 || null,
    email: data.email || null,
    address: data.address || null,
    mapUrl: data.mapUrl || null,
    openingHoursJson: (data.openingHoursJson ??
      null) as Prisma.InputJsonValue,
    instagramUrl: data.instagramUrl || null,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    logoMediaId: data.logoMediaId ?? null,
  };

  return prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    create: { id: SITE_SETTINGS_ID, ...payload },
    update: payload,
    include: { logoMedia: true },
  });
}
