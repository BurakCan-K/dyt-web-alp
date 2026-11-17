import { z } from "zod";

export const contentStatusSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Geçersiz slug");

export const serviceUpsertSchema = z.object({
  slug: slugSchema,
  title: z.string().min(2).max(160),
  summary: z.string().min(2).max(2000),
  descriptionJson: z.unknown(),
  position: z.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  status: contentStatusSchema.default("DRAFT"),
  publishedAt: z.coerce.date().nullable().optional(),
  seoTitle: z.string().max(160).nullable().optional(),
  seoDescription: z.string().max(320).nullable().optional(),
  imageId: z.string().cuid().nullable().optional(),
});

export const blogPostUpsertSchema = z.object({
  slug: slugSchema,
  title: z.string().min(2).max(200),
  excerpt: z.string().min(2).max(2000),
  contentJson: z.unknown(),
  categoryId: z.string().cuid().nullable().optional(),
  coverMediaId: z.string().cuid().nullable().optional(),
  tagsJson: z.array(z.string()).optional(),
  referencesJson: z.array(z.string()).optional(),
  status: contentStatusSchema.default("DRAFT"),
  publishedAt: z.coerce.date().nullable().optional(),
  seoTitle: z.string().max(160).nullable().optional(),
  seoDescription: z.string().max(320).nullable().optional(),
});

export const recipeIngredientSchema = z.object({
  position: z.number().int().min(0),
  name: z.string().min(1).max(160),
  /** Decimal miktar — tamsayı zorunlu değil (örn. 0.5, 125.5) */
  quantityDecimal: z.number().positive().max(100000),
  unit: z.string().min(1).max(40),
  note: z.string().max(200).nullable().optional(),
});

export const nutrientsPerServingSchema = z.object({
  kcal: z.number().nonnegative(),
  proteinG: z.number().nonnegative(),
  carbG: z.number().nonnegative(),
  fatG: z.number().nonnegative(),
});

export const recipeUpsertSchema = z
  .object({
    slug: slugSchema,
    title: z.string().min(2).max(200),
    excerpt: z.string().min(2).max(2000),
    instructionsJson: z.unknown(),
    servingCount: z.number().int().min(1).max(50),
    prepMinutes: z.number().int().min(0).max(24 * 60),
    cookMinutes: z.number().int().min(0).max(24 * 60),
    nutrientsPerServingJson: nutrientsPerServingSchema.nullable().optional(),
    nutrientSource: z.string().max(300).nullable().optional(),
    categoryId: z.string().cuid().nullable().optional(),
    coverMediaId: z.string().cuid().nullable().optional(),
    status: contentStatusSchema.default("DRAFT"),
    publishedAt: z.coerce.date().nullable().optional(),
    seoTitle: z.string().max(160).nullable().optional(),
    seoDescription: z.string().max(320).nullable().optional(),
    ingredients: z.array(recipeIngredientSchema).default([]),
  })
  .superRefine((data, ctx) => {
    if (data.nutrientsPerServingJson && !data.nutrientSource?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Besin değeri girildiyse kaynak/yöntem notu zorunludur (otomatik kalori üretilmez).",
        path: ["nutrientSource"],
      });
    }
  });

export const guideMealSchema = z.object({
  name: z.string().min(1).max(120),
  items: z.array(z.string().min(1).max(300)).min(1).max(40),
});

export const guideDaySchema = z.object({
  name: z.string().min(1).max(120),
  meals: z.array(guideMealSchema).min(1).max(20),
});

export const guideMealPlanSchema = z
  .object({
    meals: z.array(guideMealSchema).max(20).optional(),
    days: z.array(guideDaySchema).max(14).optional(),
  })
  .optional()
  .nullable();

export const guideUpsertSchema = z.object({
  slug: slugSchema,
  title: z.string().min(2).max(200),
  intro: z.string().min(2).max(4000),
  contentJson: z.unknown(),
  mealPlanJson: guideMealPlanSchema,
  relatedRecipeSlugsJson: z.array(z.string().min(1).max(120)).max(30).optional(),
  coverMediaId: z.string().cuid().nullable().optional(),
  status: contentStatusSchema.default("DRAFT"),
  publishedAt: z.coerce.date().nullable().optional(),
  seoTitle: z.string().max(160).nullable().optional(),
  seoDescription: z.string().max(320).nullable().optional(),
});

export const siteSettingsUpdateSchema = z.object({
  brandName: z.string().min(1).max(120),
  dietitianName: z.string().min(1).max(120),
  professionalTitle: z.string().min(1).max(120),
  heroTitle: z.string().min(1).max(300),
  heroSubtitle: z.string().min(1).max(1000),
  biography: z.string().max(10000).nullable().optional(),
  phone: z.string().max(40).nullable().optional(),
  whatsappE164: z
    .string()
    .regex(/^\+?[0-9\s-]{10,20}$/)
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
  email: z.string().email().nullable().optional().or(z.literal("").transform(() => null)),
  address: z.string().max(500).nullable().optional(),
  mapUrl: z.string().url().nullable().optional().or(z.literal("").transform(() => null)),
  openingHoursJson: z.unknown().optional(),
  instagramUrl: z.string().url().nullable().optional().or(z.literal("").transform(() => null)),
  metaTitle: z.string().min(1).max(160),
  metaDescription: z.string().min(1).max(320),
  logoMediaId: z
    .string()
    .cuid()
    .nullable()
    .optional()
    .or(z.literal("").transform(() => null)),
});

export const faqUpsertSchema = z.object({
  question: z.string().min(2).max(500),
  answerText: z.string().min(2).max(10000),
  position: z.number().int().min(0).default(0),
  published: z.boolean().default(false),
});
