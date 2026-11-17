/**
 * Public içerik fixture'ları — ÖRNEK İÇERİK — YAYIN ÖNCESİ DEĞİŞTİR
 * Yayınlanmamış (DRAFT/ARCHIVED) kayıtlar public listelerde görünmez.
 */

import {
  buildBlogContentDoc,
  launchBlogPosts,
  launchPostCategories,
} from "../../prisma/blogs-launch-data";
import { launchRecipes } from "../../prisma/recipes-launch-data";
import {
  buildServiceDescriptionDoc,
  launchServices,
  servicesProcessSteps,
} from "../../prisma/services-launch-data";

export { servicesProcessSteps };
import type { FixtureStatus } from "./fixtures";
import { GUIDE_DEFAULT_SEO } from "./site-defaults";
import type { TipTapDoc } from "@/lib/richtext/types";

export type SeoFields = {
  seoTitle?: string;
  seoDescription?: string;
};

export type ServiceContent = SeoFields & {
  slug: string;
  title: string;
  summary: string;
  body: string[];
  bodyDoc?: TipTapDoc;
  tags: string[];
  highlights?: string[];
  imageUrl?: string;
  imageAlt?: string;
  isFeatured: boolean;
  status: FixtureStatus;
  publishedAt: string;
};

export type PostCategory = { slug: string; title: string };

export type BlogPostContent = SeoFields & {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  categoryTitle?: string;
  body: string[];
  bodyDoc?: TipTapDoc;
  references: string[];
  tags: string[];
  coverImageUrl?: string;
  coverImageAlt?: string;
  status: FixtureStatus;
  publishedAt: string;
};

export type RecipeCategory = { slug: string; title: string };

export type RecipeIngredient = {
  name: string;
  quantity: number;
  unit: string;
  note?: string;
};

export type RecipeContent = SeoFields & {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  tags: string[];
  servingCount: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty?: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  tips?: string[];
  allergens?: string[];
  nutrientsPerServing?: {
    kcal: number;
    proteinG: number;
    carbG: number;
    fatG: number;
    source: string;
  };
  status: FixtureStatus;
  publishedAt: string;
};

export type GuideContent = SeoFields & {
  slug: string;
  title: string;
  intro: string;
  body: string[];
  meals: Array<{ name: string; items: string[] }>;
  disclaimer: string;
  relatedRecipeSlugs: string[];
  status: FixtureStatus;
  publishedAt: string;
};

export const postCategories: PostCategory[] = launchPostCategories.map((c) => ({
  slug: c.slug,
  title: c.title,
}));

export const recipeCategories: RecipeCategory[] = [
  { slug: "yan-yemek", title: "Yan Yemek" },
  { slug: "ana-yemek", title: "Ana Yemek" },
  { slug: "salata", title: "Salata" },
  { slug: "kahvalti", title: "Kahvaltı" },
  { slug: "atistirmalik", title: "Atıştırmalık" },
];

export const servicesContent: ServiceContent[] = [
  ...launchServices.map((s) => ({
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    body: s.bodyParagraphs,
    bodyDoc: buildServiceDescriptionDoc(s),
    tags: s.tags,
    highlights: s.highlights,
    imageUrl: s.imageUrl,
    imageAlt: s.imageAlt,
    isFeatured: s.isFeatured,
    status: "PUBLISHED" as const,
    publishedAt: "2026-03-17",
    seoTitle: s.seoTitle,
    seoDescription: s.seoDescription,
  })),
  {
    slug: "taslak-hizmet",
    title: "Taslak Hizmet (görünmemeli)",
    summary: "Draft fixture — public'te listelenmez.",
    body: ["Yayınlanmamış."],
    tags: [],
    isFeatured: false,
    status: "DRAFT",
    publishedAt: "2026-01-01",
  },
];

export const blogPostsContent: BlogPostContent[] = [
  ...launchBlogPosts.map((p) => {
    const cat = launchPostCategories.find((c) => c.slug === p.categorySlug);
    const bodyDoc = buildBlogContentDoc(p);
    const body = p.sections.flatMap((s) => [
      s.heading,
      ...s.paragraphs,
      ...(s.bullets ?? []),
    ]);
    return {
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      categorySlug: p.categorySlug,
      categoryTitle: cat?.title ?? p.categorySlug,
      body,
      bodyDoc,
      references: p.references,
      tags: p.tags,
      coverImageUrl: p.coverImageUrl,
      coverImageAlt: p.coverImageAlt,
      status: "PUBLISHED" as const,
      publishedAt: p.publishedAt,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
    };
  }),
  {
    slug: "taslak-yazi",
    title: "Taslak Yazı",
    excerpt: "Draft — görünmemeli",
    categorySlug: "beslenme",
    categoryTitle: "Beslenme",
    body: ["Yok"],
    references: [],
    tags: [],
    status: "DRAFT",
    publishedAt: "2026-01-01",
  },
];

export const recipesContent: RecipeContent[] = launchRecipes.map((r) => ({
  slug: r.slug,
  title: r.title,
  excerpt: r.excerpt,
  categorySlug: r.categorySlug,
  tags: [r.difficulty, r.categoryTitle],
  servingCount: r.servingCount,
  prepMinutes: r.prepMinutes,
  cookMinutes: r.cookMinutes,
  difficulty: r.difficulty,
  ingredients: r.ingredients.map((ing) => ({
    name: ing.name,
    quantity: ing.quantityDecimal,
    unit: ing.unit,
    note: ing.note ?? undefined,
  })),
  steps: r.steps,
  tips: r.tips,
  allergens: r.allergens,
  nutrientsPerServing: {
    ...r.nutrientsPerServing,
    source: r.nutrientSource,
  },
  seoTitle: r.seoTitle,
  seoDescription: r.seoDescription,
  status: "PUBLISHED" as const,
  publishedAt: "2026-03-13",
}));

export const guidesContent: GuideContent[] = [
  {
    slug: GUIDE_DEFAULT_SEO.slug,
    title: GUIDE_DEFAULT_SEO.title,
    intro: GUIDE_DEFAULT_SEO.intro,
    body: [
      "Bu rehber, dengeli bir güne dair örnek öğün dağılımı sunar.",
      "Kronik hastalık, gebelik, çocukluk veya özel diyet gereksinimlerinde uzman görüşü alın.",
    ],
    meals: [
      { name: "Kahvaltı", items: ["Yoğurtlu yulaf", "Mevsim meyvesi"] },
      {
        name: "Öğle",
        items: ["Sarımsaklı fırında tavuk", "Nar ekşili kaşık salatası"],
      },
      { name: "Ara öğün", items: ["Nohut ezmesi + sebze çubukları"] },
      {
        name: "Akşam",
        items: ["Ton balıklı sebzeli fırın makarna"],
      },
    ],
    disclaimer:
      "Bu içerik genel bilgilendirmedir; tıbbi teşhis, tedavi veya kişiye özel diyet yerine geçmez.",
    relatedRecipeSlugs: [
      "zerdecalli-zeytinyagli-pilav",
      "sarimsakli-firinda-tavuk",
      "nar-eksili-kasik-salatasi",
      "ton-balikli-sebzeli-firin-makarna",
    ],
    seoTitle: GUIDE_DEFAULT_SEO.seoTitle,
    seoDescription: GUIDE_DEFAULT_SEO.seoDescription,
    status: "PUBLISHED",
    publishedAt: "2026-02-20",
  },
];

function isPublic(status: FixtureStatus, publishedAt: string) {
  if (status !== "PUBLISHED") return false;
  return new Date(publishedAt) <= new Date();
}

export function getPublishedServices() {
  return servicesContent.filter((s) => isPublic(s.status, s.publishedAt));
}

export function getServiceBySlug(slug: string) {
  return getPublishedServices().find((s) => s.slug === slug);
}

export function getPublishedPosts() {
  return blogPostsContent
    .filter((p) => isPublic(p.status, p.publishedAt))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPostBySlug(slug: string) {
  return getPublishedPosts().find((p) => p.slug === slug);
}

export function getPublishedRecipes() {
  return recipesContent
    .filter((r) => isPublic(r.status, r.publishedAt))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getRecipeBySlug(slug: string) {
  return getPublishedRecipes().find((r) => r.slug === slug);
}

export function getPublishedGuides() {
  return guidesContent
    .filter((g) => isPublic(g.status, g.publishedAt))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getGuideBySlug(slug: string) {
  return getPublishedGuides().find((g) => g.slug === slug);
}
