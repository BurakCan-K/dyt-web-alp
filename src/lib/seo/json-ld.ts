import { absoluteUrl, getSiteUrl } from "@/lib/seo";

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  publishedAt?: string | null;
  modifiedAt?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    mainEntityOfPage: absoluteUrl(input.path),
    datePublished: input.publishedAt || undefined,
    dateModified: input.modifiedAt || input.publishedAt || undefined,
    inLanguage: "tr-TR",
    isAccessibleForFree: true,
    publisher: {
      "@type": "Organization",
      name: "Site",
      url: getSiteUrl(),
    },
  };
}

export function recipeJsonLd(input: {
  title: string;
  description: string;
  path: string;
  prepMinutes: number;
  cookMinutes: number;
  servingCount: number;
  ingredients: Array<{ name: string; quantity: number; unit: string }>;
  steps: string[];
  imageUrl?: string | null;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.imageUrl || undefined,
    recipeYield: `${input.servingCount} porsiyon`,
    prepTime: `PT${Math.max(0, input.prepMinutes)}M`,
    cookTime: `PT${Math.max(0, input.cookMinutes)}M`,
    recipeIngredient: input.ingredients.map(
      (i) => `${i.quantity} ${i.unit} ${i.name}`.trim(),
    ),
    recipeInstructions: input.steps.map((text, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text,
    })),
    inLanguage: "tr-TR",
  };
}
