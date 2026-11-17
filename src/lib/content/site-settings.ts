import { siteSettingsFixture } from "@/data/fixtures";
import { SITE_DEFAULTS } from "@/data/site-defaults";
import { withDbFallback } from "@/lib/db/availability";

export type OpeningHoursDay = { label: string; hours: string };

export type PublicSiteSettings = {
  brandName: string;
  dietitianName: string;
  professionalTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  biography: string | null;
  phone: string | null;
  whatsappE164: string | null;
  email: string | null;
  address: string | null;
  mapUrl: string | null;
  openingHours: OpeningHoursDay[];
  instagramUrl: string | null;
  metaTitle: string;
  metaDescription: string;
  logoUrl: string | null;
  logoAlt: string | null;
  isPlaceholder: boolean;
  source: "db" | "fixture";
};

function parseOpeningHours(raw: unknown): OpeningHoursDay[] {
  if (!raw) return [];
  if (typeof raw === "string") {
    return raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        const [label, ...rest] = line.split(":");
        if (rest.length === 0) return { label: line, hours: "" };
        return { label: label.trim(), hours: rest.join(":").trim() };
      });
  }
  if (typeof raw === "object" && Array.isArray((raw as { days?: unknown }).days)) {
    return ((raw as { days: OpeningHoursDay[] }).days ?? []).filter(
      (d) => d && typeof d.label === "string",
    );
  }
  if (Array.isArray(raw)) {
    return (raw as OpeningHoursDay[]).filter(
      (d) => d && typeof d.label === "string",
    );
  }
  return [];
}

export function fixtureSiteSettings(): PublicSiteSettings {
  return {
    brandName: siteSettingsFixture.brandName,
    dietitianName: siteSettingsFixture.dietitianName,
    professionalTitle: siteSettingsFixture.professionalTitle,
    heroTitle: siteSettingsFixture.heroTitle,
    heroSubtitle: siteSettingsFixture.heroSubtitle,
    biography: SITE_DEFAULTS.biography,
    phone: siteSettingsFixture.phone,
    whatsappE164: siteSettingsFixture.whatsappE164,
    email: siteSettingsFixture.email,
    address: siteSettingsFixture.address,
    mapUrl: null,
    openingHours: [],
    instagramUrl: null,
    metaTitle: siteSettingsFixture.metaTitle,
    metaDescription: siteSettingsFixture.metaDescription,
    logoUrl: null,
    logoAlt: null,
    isPlaceholder: true,
    source: "fixture",
  };
}

export async function loadPublicSiteSettings(): Promise<PublicSiteSettings> {
  if (
    process.env.USE_FIXTURES_ONLY === "1" ||
    process.env.USE_FIXTURES_ONLY === "true"
  ) {
    return fixtureSiteSettings();
  }
  return withDbFallback(async () => {
    const { getSiteSettingsPublic } = await import(
      "@/server/repositories/settings-repository"
    );
    const row = await getSiteSettingsPublic();
    if (!row) return fixtureSiteSettings();
    return {
      brandName: row.brandName,
      dietitianName: row.dietitianName,
      professionalTitle: row.professionalTitle,
      heroTitle: row.heroTitle,
      heroSubtitle: row.heroSubtitle,
      biography: row.biography,
      phone: row.phone,
      whatsappE164: row.whatsappE164,
      email: row.email,
      address: row.address,
      mapUrl: row.mapUrl,
      openingHours: parseOpeningHours(row.openingHoursJson),
      instagramUrl: row.instagramUrl,
      metaTitle: row.metaTitle,
      metaDescription: row.metaDescription,
      logoUrl: row.logoMedia?.url ?? null,
      logoAlt: row.logoMedia?.alt || row.brandName,
      isPlaceholder: !row.whatsappE164 && !row.phone && !row.email,
      source: "db" as const,
    };
  }, fixtureSiteSettings);
}

/** Yayın öncesi doğrulama checklist — fiyat/ücretsiz görüşme/diploma boş tutulmalı */
export function buildPublishVerificationChecklist(settings: PublicSiteSettings) {
  return [
    {
      id: "identity",
      label: "Diyetisyen adı yer tutucu değil",
      ok: Boolean(
        settings.dietitianName &&
          !settings.dietitianName.includes("[") &&
          settings.dietitianName !== "Örnek",
      ),
    },
    {
      id: "seo",
      label: "SEO title/description yer tutucu değil",
      ok: Boolean(
        settings.metaTitle &&
          settings.metaDescription &&
          !settings.metaTitle.includes("ÖRNEK") &&
          !settings.metaDescription.includes("ÖRNEK") &&
          settings.brandName !== "Örnek Klinik",
      ),
      note: "Marka ve meta alanlarını gerçek klinik adıyla güncelleyin",
    },
    {
      id: "contact",
      label: "WhatsApp, telefon veya e-posta tanımlı",
      ok: Boolean(settings.whatsappE164 || settings.phone || settings.email),
    },
    {
      id: "address",
      label: "Adres doğrulandı veya bilinçli boş",
      ok: settings.address === null || !settings.address.includes("["),
    },
    {
      id: "no-price",
      label: "Fiyat iddiası admin metinlerinde yok (manuel kontrol)",
      ok: true,
      note: "verification required — içerikte fiyat yazmayın",
    },
    {
      id: "no-free-consult",
      label: "“Ücretsiz görüşme” vaadi yok (manuel kontrol)",
      ok: true,
      note: "verification required",
    },
    {
      id: "diploma",
      label: "Diploma/ünvan iddiası belgelenmeden yayınlanmadı",
      ok: true,
      note: "verification required — belgesiz unvan eklemeyin",
    },
  ];
}
