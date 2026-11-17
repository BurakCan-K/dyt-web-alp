import type { Metadata } from "next";
import { SITE_DEFAULTS } from "@/data/site-defaults";

export type SeoInput = {
  title?: string | null;
  description?: string | null;
  path?: string;
  ogImageUrl?: string | null;
  noIndex?: boolean;
  /** Marka adı; title şablonunda kullanılır */
  brandName?: string | null;
  /**
   * true: title’a marka eklenmez (ana sayfa metaTitle gibi tam başlıklar).
   * Varsayılan: path === "/" veya title zaten marka/ayraç içeriyorsa eklenmez.
   */
  absoluteTitle?: boolean;
};

const FALLBACK_TITLE = SITE_DEFAULTS.metaTitle;
const FALLBACK_DESCRIPTION = SITE_DEFAULTS.metaDescription;

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function absoluteUrl(path = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteUrl()}${p}`;
}

/** Sayfa başlığı + marka; çift eklemeyi önler */
export function formatPageTitle(
  pageTitle: string,
  brandName: string = SITE_DEFAULTS.brandName,
): string {
  const title = pageTitle.trim();
  const brand = brandName.trim() || SITE_DEFAULTS.brandName;
  if (!title) return brand;
  if (title === brand) return title;
  if (title.includes(`| ${brand}`) || title.endsWith(brand)) return title;
  if (/[|—–]/.test(title) && title.length >= 40) return title;
  return `${title} | ${brand}`;
}

export function buildMetadata(input: SeoInput = {}): Metadata {
  const brand =
    input.brandName?.trim() || SITE_DEFAULTS.brandName;
  const rawTitle = input.title?.trim() || FALLBACK_TITLE;
  const description = input.description?.trim() || FALLBACK_DESCRIPTION;
  const path = input.path ?? "/";
  const useAbsolute =
    input.absoluteTitle === true ||
    path === "/" ||
    rawTitle === FALLBACK_TITLE ||
    rawTitle === SITE_DEFAULTS.metaTitle;
  const title = useAbsolute
    ? rawTitle
    : formatPageTitle(rawTitle, brand);
  const url = absoluteUrl(path);

  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "tr_TR",
      siteName: brand,
      ...(input.ogImageUrl ? { images: [{ url: input.ogImageUrl }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(input.ogImageUrl ? { images: [input.ogImageUrl] } : {}),
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function buildAdminMetadata(title: string): Metadata {
  return buildMetadata({
    title: `${title} · Admin`,
    description: "Yönetim paneli — indekslenmez",
    path: "/admin",
    noIndex: true,
    absoluteTitle: true,
  });
}
