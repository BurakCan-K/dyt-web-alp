import {
  getPublishedPosts,
  getPublishedRecipes,
  postCategories,
  recipeCategories,
  type BlogPostContent,
  type RecipeContent,
} from "@/data/content";
import { scaleIngredientQuantity } from "@/lib/calculations/portion";

export function filterPosts(opts: {
  q?: string;
  kategori?: string;
}): BlogPostContent[] {
  const q = opts.q?.trim().toLowerCase() ?? "";
  const kategori = opts.kategori?.trim() ?? "";

  return getPublishedPosts().filter((post) => {
    if (kategori && post.categorySlug !== kategori) return false;
    if (!q) return true;
    const hay = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
    return hay.includes(q);
  });
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(safePage, totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
    total,
  };
}

export function filterRecipes(opts: {
  kategori?: string;
  etiket?: string;
}): RecipeContent[] {
  const kategori = opts.kategori?.trim() ?? "";
  const etiket = opts.etiket?.trim().toLowerCase() ?? "";

  return getPublishedRecipes().filter((recipe) => {
    if (kategori && recipe.categorySlug !== kategori) return false;
    if (etiket && !recipe.tags.some((t) => t.toLowerCase() === etiket)) {
      return false;
    }
    return true;
  });
}

export function categoryTitle(slug: string) {
  return postCategories.find((c) => c.slug === slug)?.title ?? slug;
}

export function recipeCategoryTitle(slug: string) {
  return recipeCategories.find((c) => c.slug === slug)?.title ?? slug;
}

export function scaleQuantity(
  quantity: number,
  fromServings: number,
  toServings: number,
): number {
  return scaleIngredientQuantity(quantity, fromServings, toServings) ?? quantity;
}
