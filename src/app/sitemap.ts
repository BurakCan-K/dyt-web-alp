import type { MetadataRoute } from "next";
import {
  loadPublicGuides,
  loadPublicPosts,
  loadPublicRecipes,
  loadPublicServices,
} from "@/lib/content/public-source";
import { getPublicTools } from "@/lib/nutrition-tools/registry";
import { getSiteUrl } from "@/lib/seo";

const STATIC_PATHS = [
  "/",
  "/hakkimda",
  "/hizmetler",
  "/tarifler",
  "/blog",
  "/beslenme-rehberleri",
  "/hesaplayicilar",
  "/iletisim",
];

/** Hukuki yer tutucular ve admin sitemap'e girmez */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const now = new Date();

  const [posts, recipes, services, guides] = await Promise.all([
    loadPublicPosts(),
    loadPublicRecipes(),
    loadPublicServices(),
    loadPublicGuides(),
  ]);

  const calculatorPaths = getPublicTools().map((t) => `/hesaplayicilar/${t.slug}`);

  const staticEntries: MetadataRoute.Sitemap = [
    ...STATIC_PATHS,
    ...calculatorPaths,
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/hesaplayicilar") ? 0.75 : 0.7,
  }));

  const dynamicEntries: MetadataRoute.Sitemap = [
    ...posts.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...recipes.map((r) => ({
      url: `${base}/tarifler/${r.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...services.map((s) => ({
      url: `${base}/hizmetler/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    })),
    ...guides.map((g) => ({
      url: `${base}/beslenme-rehberleri/${g.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  return [...staticEntries, ...dynamicEntries];
}
