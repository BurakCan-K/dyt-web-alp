import {
  getGuideBySlug,
  getPostBySlug,
  getPublishedGuides,
  getPublishedPosts,
  getPublishedRecipes,
  getPublishedServices,
  getRecipeBySlug,
  getServiceBySlug,
  recipeCategories as fixtureRecipeCategories,
  type BlogPostContent,
  type GuideContent,
  type RecipeContent,
  type ServiceContent,
} from "@/data/content";
import { publishedFaqs } from "@/data/fixtures";
import { isDbInCooldown, withDbFallback } from "@/lib/db/availability";
import {
  extractRecipeMeta,
  extractRecipeSteps,
} from "@/lib/recipe/instructions";
import {
  isTipTapDoc,
  paragraphsToDoc,
  type TipTapDoc,
} from "@/lib/richtext/types";

/** Local hızlı test: MySQL yokken .env içinde USE_FIXTURES_ONLY=1 */
function fixturesOnlyMode() {
  return (
    process.env.USE_FIXTURES_ONLY === "1" ||
    process.env.USE_FIXTURES_ONLY === "true" ||
    isDbInCooldown()
  );
}

export type PublicPost = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  categoryTitle: string;
  bodyDoc: unknown;
  references: string[];
  tags: string[];
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  publishedAt: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  source: "db" | "fixture";
};

export type PublicService = {
  slug: string;
  title: string;
  summary: string;
  bodyDoc: unknown;
  tags: string[];
  highlights: string[];
  isFeatured: boolean;
  imageUrl?: string | null;
  imageAlt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  source: "db" | "fixture";
};

export type PublicFaq = {
  id: string;
  question: string;
  answer: string;
  source: "db" | "fixture";
};

export type PublicRecipeIngredient = {
  name: string;
  quantity: number;
  unit: string;
  note?: string;
};

export type PublicRecipe = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  categoryTitle: string;
  servingCount: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty?: string;
  ingredients: PublicRecipeIngredient[];
  steps: string[];
  tips: string[];
  allergens: string[];
  coverImageUrl?: string | null;
  coverImageAlt?: string | null;
  nutrientsPerServing?: {
    kcal: number;
    proteinG: number;
    carbG: number;
    fatG: number;
    source: string;
  };
  seoTitle?: string | null;
  seoDescription?: string | null;
  source: "db" | "fixture";
};

export type PublicGuideMeal = { name: string; items: string[] };
export type PublicGuideDay = { name: string; meals: PublicGuideMeal[] };

export type PublicGuide = {
  slug: string;
  title: string;
  intro: string;
  bodyDoc: TipTapDoc | unknown;
  meals: PublicGuideMeal[];
  days: PublicGuideDay[];
  relatedRecipeSlugs: string[];
  disclaimer: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  source: "db" | "fixture";
};

const DEFAULT_GUIDE_DISCLAIMER =
  "Bu içerik genel bilgilendirmedir; tıbbi teşhis, tedavi veya kişiye özel diyet yerine geçmez.";

function mapFixtureRecipe(r: RecipeContent): PublicRecipe {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    categorySlug: r.categorySlug,
    categoryTitle:
      fixtureRecipeCategories.find((c) => c.slug === r.categorySlug)?.title ??
      r.categorySlug,
    servingCount: r.servingCount,
    prepMinutes: r.prepMinutes,
    cookMinutes: r.cookMinutes,
    difficulty: r.difficulty,
    ingredients: r.ingredients,
    steps: r.steps,
    tips: r.tips ?? [],
    allergens: r.allergens ?? [],
    coverImageUrl: null,
    coverImageAlt: null,
    nutrientsPerServing: r.nutrientsPerServing,
    seoTitle: r.seoTitle,
    seoDescription: r.seoDescription,
    source: "fixture",
  };
}

function mapFixtureGuide(g: GuideContent): PublicGuide {
  return {
    slug: g.slug,
    title: g.title,
    intro: g.intro,
    bodyDoc: paragraphsToDoc(g.body),
    meals: g.meals,
    days: [],
    relatedRecipeSlugs: g.relatedRecipeSlugs,
    disclaimer: g.disclaimer,
    seoTitle: g.seoTitle,
    seoDescription: g.seoDescription,
    source: "fixture",
  };
}

function normalizeGuideBody(contentJson: unknown): TipTapDoc | unknown {
  if (isTipTapDoc(contentJson)) return contentJson;
  if (
    contentJson &&
    typeof contentJson === "object" &&
    Array.isArray((contentJson as { paragraphs?: unknown }).paragraphs)
  ) {
    return paragraphsToDoc(
      (contentJson as { paragraphs: string[] }).paragraphs,
    );
  }
  return contentJson;
}

function parseMealPlan(mealPlanJson: unknown): {
  meals: PublicGuideMeal[];
  days: PublicGuideDay[];
} {
  if (!mealPlanJson || typeof mealPlanJson !== "object") {
    return { meals: [], days: [] };
  }
  const plan = mealPlanJson as {
    meals?: PublicGuideMeal[];
    days?: PublicGuideDay[];
  };
  return {
    meals: Array.isArray(plan.meals) ? plan.meals : [],
    days: Array.isArray(plan.days) ? plan.days : [],
  };
}

function mapFixturePost(p: BlogPostContent): PublicPost {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    categorySlug: p.categorySlug,
    categoryTitle: p.categoryTitle ?? p.categorySlug,
    bodyDoc: p.bodyDoc ?? paragraphsToDoc(p.body),
    references: p.references,
    tags: p.tags,
    coverImageUrl: p.coverImageUrl ?? null,
    coverImageAlt: p.coverImageAlt ?? p.title,
    publishedAt: p.publishedAt,
    seoTitle: p.seoTitle,
    seoDescription: p.seoDescription,
    source: "fixture",
  };
}

function mapFixtureService(s: ServiceContent): PublicService {
  return {
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    bodyDoc: s.bodyDoc ?? paragraphsToDoc(s.body),
    tags: s.tags,
    highlights: s.highlights ?? s.tags.slice(0, 4),
    isFeatured: s.isFeatured,
    imageUrl: s.imageUrl ?? null,
    imageAlt: s.imageAlt ?? s.title,
    seoTitle: s.seoTitle,
    seoDescription: s.seoDescription,
    source: "fixture",
  };
}

function mapDbService(s: {
  slug: string;
  title: string;
  summary: string;
  descriptionJson: unknown;
  isFeatured: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  image?: { url: string; alt: string } | null;
}): PublicService {
  const highlights = extractHighlightsFromDoc(s.descriptionJson);
  return {
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    bodyDoc: s.descriptionJson,
    tags: [],
    highlights,
    isFeatured: s.isFeatured,
    imageUrl: s.image?.url ?? null,
    imageAlt: s.image?.alt?.trim() || s.title,
    seoTitle: s.seoTitle,
    seoDescription: s.seoDescription,
    source: "db",
  };
}

/** TipTap gövdesindeki ilk bulletList maddelerini kart özeti için çıkarır */
function extractHighlightsFromDoc(doc: unknown): string[] {
  if (!doc || typeof doc !== "object") return [];
  const content = (doc as { content?: unknown }).content;
  if (!Array.isArray(content)) return [];
  for (const node of content) {
    if (!node || typeof node !== "object") continue;
    const n = node as { type?: string; content?: unknown[] };
    if (n.type !== "bulletList" || !Array.isArray(n.content)) continue;
    const items: string[] = [];
    for (const li of n.content) {
      if (!li || typeof li !== "object") continue;
      const text = flattenTipTapText(li).trim();
      if (text) items.push(text);
      if (items.length >= 4) break;
    }
    if (items.length) return items;
  }
  return [];
}

function flattenTipTapText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: string; content?: unknown[] };
  if (typeof n.text === "string") return n.text;
  if (!Array.isArray(n.content)) return "";
  return n.content.map(flattenTipTapText).join(" ");
}

export async function loadPublicPosts(): Promise<PublicPost[]> {
  if (fixturesOnlyMode()) return getPublishedPosts().map(mapFixturePost);
  return withDbFallback(async () => {
    const { findPublishedBlogPosts } = await import(
      "@/server/repositories/blog-repository"
    );
    const rows = await findPublishedBlogPosts();
    if (rows.length === 0) return getPublishedPosts().map(mapFixturePost);
    return rows.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      categorySlug: p.category?.slug ?? "genel",
      categoryTitle: p.category?.title ?? "Genel",
      bodyDoc: p.contentJson,
      references: (p.referencesJson as string[] | null) ?? [],
      tags: (p.tagsJson as string[] | null) ?? [],
      coverImageUrl: p.coverMedia?.url ?? null,
      coverImageAlt: p.coverMedia?.alt?.trim() || p.title,
      publishedAt: p.publishedAt?.toISOString().slice(0, 10) ?? "",
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      source: "db" as const,
    }));
  }, () => getPublishedPosts().map(mapFixturePost));
}

export async function loadPublicPost(
  slug: string,
): Promise<PublicPost | null> {
  if (!fixturesOnlyMode()) {
    const fromDb = await withDbFallback(async () => {
      const { findPublishedBlogPostBySlug } = await import(
        "@/server/repositories/blog-repository"
      );
      const p = await findPublishedBlogPostBySlug(slug);
      if (!p) return null;
      return {
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        categorySlug: p.category?.slug ?? "genel",
        categoryTitle: p.category?.title ?? "Genel",
        bodyDoc: p.contentJson,
        references: (p.referencesJson as string[] | null) ?? [],
        tags: (p.tagsJson as string[] | null) ?? [],
        coverImageUrl: p.coverMedia?.url ?? null,
        coverImageAlt: p.coverMedia?.alt?.trim() || p.title,
        publishedAt: p.publishedAt?.toISOString().slice(0, 10) ?? "",
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        source: "db" as const,
      };
    }, () => null);
    if (fromDb) return fromDb;
  }
  const fixture = getPostBySlug(slug);
  return fixture ? mapFixturePost(fixture) : null;
}

export async function loadPublicServices(): Promise<PublicService[]> {
  if (fixturesOnlyMode()) return getPublishedServices().map(mapFixtureService);
  return withDbFallback(async () => {
    const { findPublishedServicesFromDb } = await import(
      "@/server/repositories/service-repository"
    );
    const rows = await findPublishedServicesFromDb();
    if (rows.length === 0) return getPublishedServices().map(mapFixtureService);
    return rows.map((s) => mapDbService(s));
  }, () => getPublishedServices().map(mapFixtureService));
}

export async function loadPublicService(
  slug: string,
): Promise<PublicService | null> {
  if (!fixturesOnlyMode()) {
    const fromDb = await withDbFallback(async () => {
      const { findPublishedServiceBySlugFromDb } = await import(
        "@/server/repositories/service-repository"
      );
      const s = await findPublishedServiceBySlugFromDb(slug);
      if (!s) return null;
      return mapDbService(s);
    }, () => null);
    if (fromDb) return fromDb;
  }
  const fixture = getServiceBySlug(slug);
  return fixture ? mapFixtureService(fixture) : null;
}

export async function loadPublicFaqs(): Promise<PublicFaq[]> {
  const fixtures = () =>
    publishedFaqs().map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      source: "fixture" as const,
    }));
  if (fixturesOnlyMode()) return fixtures();
  return withDbFallback(async () => {
    const { findPublishedFaqs } = await import(
      "@/server/repositories/faq-repository"
    );
    const rows = await findPublishedFaqs();
    if (rows.length === 0) return fixtures();
    return rows.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answerText,
      source: "db" as const,
    }));
  }, fixtures);
}

export async function loadPublicRecipeCategories(): Promise<
  Array<{ slug: string; title: string }>
> {
  if (fixturesOnlyMode()) return fixtureRecipeCategories;
  return withDbFallback(async () => {
    const { findPublishedRecipeCategoriesFromDb } = await import(
      "@/server/repositories/recipe-repository"
    );
    const rows = await findPublishedRecipeCategoriesFromDb();
    if (rows.length === 0) return fixtureRecipeCategories;
    return rows.map((c) => ({ slug: c.slug, title: c.title }));
  }, () => fixtureRecipeCategories);
}

export async function loadPublicRecipes(opts?: {
  kategori?: string;
}): Promise<PublicRecipe[]> {
  const fixtures = () =>
    getPublishedRecipes()
      .filter((r) => !opts?.kategori || r.categorySlug === opts.kategori)
      .map(mapFixtureRecipe);
  if (fixturesOnlyMode()) return fixtures();
  return withDbFallback(async () => {
    const { findPublishedRecipesFromDb } = await import(
      "@/server/repositories/recipe-repository"
    );
    const rows = await findPublishedRecipesFromDb({
      categorySlug: opts?.kategori || undefined,
    });
    if (rows.length === 0) return fixtures();
    return rows.map((r) => mapDbRecipe(r));
  }, fixtures);
}

function mapDbRecipe(r: {
  slug: string;
  title: string;
  excerpt: string;
  servingCount: number;
  prepMinutes: number;
  cookMinutes: number;
  instructionsJson: unknown;
  nutrientsPerServingJson: unknown;
  nutrientSource: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  category: { slug: string; title: string } | null;
  coverMedia?: { url: string; alt: string } | null;
  ingredients: Array<{
    name: string;
    quantityDecimal: { toString(): string } | number;
    unit: string;
    note: string | null;
  }>;
}): PublicRecipe {
  const nutrients = r.nutrientsPerServingJson as {
    kcal?: number;
    proteinG?: number;
    carbG?: number;
    fatG?: number;
  } | null;
  const meta = extractRecipeMeta(r.instructionsJson);
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    categorySlug: r.category?.slug ?? "genel",
    categoryTitle: r.category?.title ?? "Genel",
    servingCount: r.servingCount,
    prepMinutes: r.prepMinutes,
    cookMinutes: r.cookMinutes,
    difficulty: meta.difficulty,
    ingredients: r.ingredients.map((ing) => ({
      name: ing.name,
      quantity: Number(ing.quantityDecimal),
      unit: ing.unit,
      note: ing.note ?? undefined,
    })),
    steps: extractRecipeSteps(r.instructionsJson),
    tips: meta.tips,
    allergens: meta.allergens,
    coverImageUrl: r.coverMedia?.url ?? null,
    coverImageAlt: r.coverMedia?.alt?.trim() || r.title,
    nutrientsPerServing:
      nutrients &&
      typeof nutrients.kcal === "number" &&
      r.nutrientSource
        ? {
            kcal: nutrients.kcal,
            proteinG: Number(nutrients.proteinG ?? 0),
            carbG: Number(nutrients.carbG ?? 0),
            fatG: Number(nutrients.fatG ?? 0),
            source: r.nutrientSource,
          }
        : undefined,
    seoTitle: r.seoTitle,
    seoDescription: r.seoDescription,
    source: "db",
  };
}

export async function loadPublicRecipe(
  slug: string,
): Promise<PublicRecipe | null> {
  if (!fixturesOnlyMode()) {
    const fromDb = await withDbFallback(async () => {
      const { findPublishedRecipeBySlugFromDb } = await import(
        "@/server/repositories/recipe-repository"
      );
      const r = await findPublishedRecipeBySlugFromDb(slug);
      if (!r) return null;
      return mapDbRecipe(r);
    }, () => null);
    if (fromDb) return fromDb;
  }
  const fixture = getRecipeBySlug(slug);
  return fixture ? mapFixtureRecipe(fixture) : null;
}

export async function loadPublicGuides(): Promise<PublicGuide[]> {
  if (fixturesOnlyMode()) return getPublishedGuides().map(mapFixtureGuide);
  return withDbFallback(async () => {
    const { findPublishedGuidesFromDb } = await import(
      "@/server/repositories/guide-repository"
    );
    const rows = await findPublishedGuidesFromDb();
    if (rows.length === 0) return getPublishedGuides().map(mapFixtureGuide);
    return rows.map((g) => {
      const plan = parseMealPlan(g.mealPlanJson);
      return {
        slug: g.slug,
        title: g.title,
        intro: g.intro,
        bodyDoc: normalizeGuideBody(g.contentJson),
        meals: plan.meals,
        days: plan.days,
        relatedRecipeSlugs:
          (g.relatedRecipeSlugsJson as string[] | null) ?? [],
        disclaimer: DEFAULT_GUIDE_DISCLAIMER,
        seoTitle: g.seoTitle,
        seoDescription: g.seoDescription,
        source: "db" as const,
      };
    });
  }, () => getPublishedGuides().map(mapFixtureGuide));
}

export async function loadPublicGuide(
  slug: string,
): Promise<PublicGuide | null> {
  if (!fixturesOnlyMode()) {
    const fromDb = await withDbFallback(async () => {
      const { findPublishedGuideBySlugFromDb } = await import(
        "@/server/repositories/guide-repository"
      );
      const g = await findPublishedGuideBySlugFromDb(slug);
      if (!g) return null;
      const plan = parseMealPlan(g.mealPlanJson);
      return {
        slug: g.slug,
        title: g.title,
        intro: g.intro,
        bodyDoc: normalizeGuideBody(g.contentJson),
        meals: plan.meals,
        days: plan.days,
        relatedRecipeSlugs:
          (g.relatedRecipeSlugsJson as string[] | null) ?? [],
        disclaimer: DEFAULT_GUIDE_DISCLAIMER,
        seoTitle: g.seoTitle,
        seoDescription: g.seoDescription,
        source: "db" as const,
      };
    }, () => null);
    if (fromDb) return fromDb;
  }
  const fixture = getGuideBySlug(slug);
  return fixture ? mapFixtureGuide(fixture) : null;
}
