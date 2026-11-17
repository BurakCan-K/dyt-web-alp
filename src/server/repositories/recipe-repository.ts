import type { ContentStatus, Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/db";
import { slugify, uniqueSlug } from "@/lib/slug";
import { recipeUpsertSchema } from "@/lib/validators/content";

export async function listRecipesForAdmin(opts?: {
  status?: ContentStatus | "ALL";
  q?: string;
  categoryId?: string;
}) {
  const where: Prisma.RecipeWhereInput = { deletedAt: null };
  if (opts?.status && opts.status !== "ALL") {
    where.status = opts.status;
  }
  if (opts?.categoryId) {
    where.categoryId = opts.categoryId;
  }
  if (opts?.q?.trim()) {
    where.OR = [
      { title: { contains: opts.q.trim() } },
      { excerpt: { contains: opts.q.trim() } },
      { slug: { contains: opts.q.trim() } },
    ];
  }
  return prisma.recipe.findMany({
    where,
    include: { category: true, ingredients: { orderBy: { position: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getRecipeForAdmin(id: string) {
  return prisma.recipe.findFirst({
    where: { id, deletedAt: null },
    include: { category: true, ingredients: { orderBy: { position: "asc" } } },
  });
}

export async function listRecipeCategories() {
  return prisma.recipeCategory.findMany({ orderBy: { position: "asc" } });
}

export async function ensureRecipeCategory(title: string) {
  const base = slugify(title);
  const existing = await prisma.recipeCategory.findMany({
    select: { slug: true },
  });
  const found = await prisma.recipeCategory.findFirst({
    where: { OR: [{ title }, { slug: base }] },
  });
  if (found) return found;
  const slug = uniqueSlug(
    base,
    existing.map((e) => e.slug),
  );
  return prisma.recipeCategory.create({
    data: { title, slug, position: existing.length },
  });
}

export async function upsertRecipe(id: string | null, raw: unknown) {
  const data = recipeUpsertSchema.parse(raw);
  // tips / allergens / difficulty steps ile birlikte korunur
  const instructionsJson = data.instructionsJson as Prisma.InputJsonValue;

  const payload = {
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    instructionsJson,
    servingCount: data.servingCount,
    prepMinutes: data.prepMinutes,
    cookMinutes: data.cookMinutes,
    nutrientsPerServingJson: (data.nutrientsPerServingJson ??
      null) as Prisma.InputJsonValue,
    nutrientSource: data.nutrientSource ?? null,
    categoryId: data.categoryId ?? null,
    coverMediaId: data.coverMediaId ?? null,
    status: data.status,
    publishedAt:
      data.status === "PUBLISHED"
        ? (data.publishedAt ?? new Date())
        : (data.publishedAt ?? null),
    seoTitle: data.seoTitle ?? null,
    seoDescription: data.seoDescription ?? null,
  };

  const ingredientRows = data.ingredients.map((ing, index) => ({
    position: ing.position ?? index,
    name: ing.name,
    quantityDecimal: ing.quantityDecimal,
    unit: ing.unit,
    note: ing.note ?? null,
  }));

  if (id) {
    await prisma.recipeIngredient.deleteMany({ where: { recipeId: id } });
    return prisma.recipe.update({
      where: { id },
      data: {
        ...payload,
        ingredients: { create: ingredientRows },
      },
      include: { category: true, ingredients: true },
    });
  }

  return prisma.recipe.create({
    data: {
      ...payload,
      ingredients: { create: ingredientRows },
    },
    include: { category: true, ingredients: true },
  });
}

export async function softDeleteRecipe(id: string) {
  return prisma.recipe.update({
    where: { id },
    data: { deletedAt: new Date(), status: "ARCHIVED" },
  });
}

export async function updateRecipeStatus(id: string, status: ContentStatus) {
  return prisma.recipe.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });
}

export async function findPublishedRecipesFromDb(opts?: {
  categorySlug?: string;
}) {
  const where: Prisma.RecipeWhereInput = {
    status: "PUBLISHED",
    deletedAt: null,
    publishedAt: { lte: new Date() },
  };
  if (opts?.categorySlug) {
    where.category = { slug: opts.categorySlug };
  }
  return prisma.recipe.findMany({
    where,
    include: {
      category: true,
      coverMedia: true,
      ingredients: { orderBy: { position: "asc" } },
    },
    orderBy: { publishedAt: "desc" },
  });
}

export async function findPublishedRecipeBySlugFromDb(slug: string) {
  return prisma.recipe.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      deletedAt: null,
      publishedAt: { lte: new Date() },
    },
    include: {
      category: true,
      coverMedia: true,
      ingredients: { orderBy: { position: "asc" } },
    },
  });
}

export async function findPublishedRecipeCategoriesFromDb() {
  return prisma.recipeCategory.findMany({
    where: {
      recipes: {
        some: {
          status: "PUBLISHED",
          deletedAt: null,
          publishedAt: { lte: new Date() },
        },
      },
    },
    orderBy: { position: "asc" },
  });
}
