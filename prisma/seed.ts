/**
 * Yerel geliştirme seed'i.
 * - Örnek içerikler "ÖRNEK İÇERİK — YAYIN ÖNCESİ DEĞİŞTİR" etiketiyle
 * - Admin hesabı DEMO parola ile oluşturulMAZ
 * - Admin için Prompt 05 CLI / güvenli env kullanılacak
 */
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import {
  buildBlogContentDoc,
  launchBlogPosts,
  launchPostCategories,
} from "./blogs-launch-data";
import {
  launchRecipeCategories,
  launchRecipes,
} from "./recipes-launch-data";
import type { Prisma } from "../src/generated/prisma/client";
import {
  buildServiceDescriptionDoc,
  launchServices,
} from "./services-launch-data";
import {
  GUIDE_DEFAULT_SEO,
  SITE_DEFAULTS,
} from "../src/data/site-defaults";

function createClient() {
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST ?? "127.0.0.1",
    port: Number(process.env.DATABASE_PORT ?? "3306"),
    user: process.env.DATABASE_USER ?? "root",
    password: process.env.DATABASE_PASSWORD ?? "",
    database: process.env.DATABASE_NAME ?? "dyt_web_dev",
    connectionLimit: 5,
  });
  return new PrismaClient({ adapter });
}

async function main() {
  const prisma = createClient();
  const now = new Date();

  const existingSettings = await prisma.siteSettings.findUnique({
    where: { id: "default" },
  });
  const placeholderIdentity =
    !existingSettings ||
    existingSettings.brandName === "Örnek Klinik" ||
    existingSettings.dietitianName.includes("[") ||
    existingSettings.metaTitle.includes("ÖRNEK") ||
    existingSettings.metaDescription.includes("ÖRNEK");

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: placeholderIdentity
      ? {
          brandName: SITE_DEFAULTS.brandName,
          dietitianName: SITE_DEFAULTS.dietitianName,
          professionalTitle: SITE_DEFAULTS.professionalTitle,
          heroTitle: SITE_DEFAULTS.heroTitle,
          heroSubtitle: SITE_DEFAULTS.heroSubtitle,
          biography: SITE_DEFAULTS.biography,
          metaTitle: SITE_DEFAULTS.metaTitle,
          metaDescription: SITE_DEFAULTS.metaDescription,
        }
      : {},
    create: {
      id: "default",
      brandName: SITE_DEFAULTS.brandName,
      dietitianName: SITE_DEFAULTS.dietitianName,
      professionalTitle: SITE_DEFAULTS.professionalTitle,
      heroTitle: SITE_DEFAULTS.heroTitle,
      heroSubtitle: SITE_DEFAULTS.heroSubtitle,
      biography: SITE_DEFAULTS.biography,
      phone: null,
      whatsappE164: null,
      email: null,
      address: null,
      metaTitle: SITE_DEFAULTS.metaTitle,
      metaDescription: SITE_DEFAULTS.metaDescription,
    },
  });

  const postCategoryIds = new Map<string, string>();
  for (const cat of launchPostCategories) {
    const row = await prisma.postCategory.upsert({
      where: { slug: cat.slug },
      update: { title: cat.title, position: cat.position },
      create: {
        slug: cat.slug,
        title: cat.title,
        position: cat.position,
      },
    });
    postCategoryIds.set(cat.slug, row.id);
  }

  const keepPostSlugs = launchBlogPosts.map((p) => p.slug);
  for (const item of launchBlogPosts) {
    const mediaId = `blogimg_${item.slug}`;
    const media = await prisma.mediaAsset.upsert({
      where: { id: mediaId },
      update: {
        url: item.coverImageUrl,
        alt: item.coverImageAlt,
        mimeType: "image/jpeg",
      },
      create: {
        id: mediaId,
        provider: "LOCAL_PLACEHOLDER",
        providerPublicId: `blog/${item.slug}`,
        url: item.coverImageUrl,
        alt: item.coverImageAlt,
        mimeType: "image/jpeg",
        bytes: 0,
        width: 1200,
        height: 800,
      },
    });

    const contentJson = buildBlogContentDoc(item) as Prisma.InputJsonValue;
    const publishedAt = new Date(`${item.publishedAt}T10:00:00.000Z`);

    await prisma.blogPost.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        contentJson,
        categoryId: postCategoryIds.get(item.categorySlug) ?? null,
        coverMediaId: media.id,
        tagsJson: item.tags,
        referencesJson: item.references,
        status: "PUBLISHED",
        publishedAt,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        deletedAt: null,
      },
      create: {
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        contentJson,
        categoryId: postCategoryIds.get(item.categorySlug) ?? null,
        coverMediaId: media.id,
        tagsJson: item.tags,
        referencesJson: item.references,
        status: "PUBLISHED",
        publishedAt,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
      },
    });
  }

  await prisma.blogPost.updateMany({
    where: {
      deletedAt: null,
      slug: { notIn: keepPostSlugs },
    },
    data: { status: "ARCHIVED", deletedAt: now },
  });

  const keepServiceSlugs = launchServices.map((s) => s.slug);
  for (const item of launchServices) {
    const mediaId = `svcimg_${item.slug}`;
    const media = await prisma.mediaAsset.upsert({
      where: { id: mediaId },
      update: {
        url: item.imageUrl,
        alt: item.imageAlt,
        mimeType: "image/jpeg",
      },
      create: {
        id: mediaId,
        provider: "LOCAL_PLACEHOLDER",
        providerPublicId: `service/${item.slug}`,
        url: item.imageUrl,
        alt: item.imageAlt,
        mimeType: "image/jpeg",
        bytes: 0,
        width: 1200,
        height: 800,
      },
    });

    const descriptionJson = buildServiceDescriptionDoc(
      item,
    ) as Prisma.InputJsonValue;

    await prisma.service.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        summary: item.summary,
        descriptionJson,
        position: item.position,
        isFeatured: item.isFeatured,
        status: "PUBLISHED",
        publishedAt: now,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        imageId: media.id,
        deletedAt: null,
      },
      create: {
        slug: item.slug,
        title: item.title,
        summary: item.summary,
        descriptionJson,
        position: item.position,
        isFeatured: item.isFeatured,
        status: "PUBLISHED",
        publishedAt: now,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        imageId: media.id,
      },
    });
  }

  await prisma.service.updateMany({
    where: {
      deletedAt: null,
      slug: { notIn: keepServiceSlugs },
    },
    data: { status: "ARCHIVED", deletedAt: now },
  });

  const categoryIds = new Map<string, string>();
  for (const cat of launchRecipeCategories) {
    const row = await prisma.recipeCategory.upsert({
      where: { slug: cat.slug },
      update: { title: cat.title, position: cat.position },
      create: {
        slug: cat.slug,
        title: cat.title,
        position: cat.position,
      },
    });
    categoryIds.set(cat.slug, row.id);
  }

  for (const item of launchRecipes) {
    const instructionsJson = {
      steps: item.steps,
      difficulty: item.difficulty,
      tips: item.tips,
      allergens: item.allergens,
    };
    const recipe = await prisma.recipe.upsert({
      where: { slug: item.slug },
      update: {
        title: item.title,
        excerpt: item.excerpt,
        instructionsJson,
        servingCount: item.servingCount,
        prepMinutes: item.prepMinutes,
        cookMinutes: item.cookMinutes,
        nutrientsPerServingJson: item.nutrientsPerServing,
        nutrientSource: item.nutrientSource,
        categoryId: categoryIds.get(item.categorySlug) ?? null,
        status: "PUBLISHED",
        publishedAt: now,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
        deletedAt: null,
      },
      create: {
        slug: item.slug,
        title: item.title,
        excerpt: item.excerpt,
        instructionsJson,
        servingCount: item.servingCount,
        prepMinutes: item.prepMinutes,
        cookMinutes: item.cookMinutes,
        nutrientsPerServingJson: item.nutrientsPerServing,
        nutrientSource: item.nutrientSource,
        categoryId: categoryIds.get(item.categorySlug) ?? null,
        status: "PUBLISHED",
        publishedAt: now,
        seoTitle: item.seoTitle,
        seoDescription: item.seoDescription,
      },
    });

    await prisma.recipeIngredient.deleteMany({ where: { recipeId: recipe.id } });
    await prisma.recipeIngredient.createMany({
      data: item.ingredients.map((ing) => ({
        recipeId: recipe.id,
        position: ing.position,
        name: ing.name,
        quantityDecimal: ing.quantityDecimal,
        unit: ing.unit,
        note: ing.note ?? null,
      })),
    });
  }

  // Eski demo tarif — listede kalmasın
  await prisma.recipe.updateMany({
    where: { slug: "yogurtlu-yulaf", deletedAt: null },
    data: { status: "ARCHIVED", deletedAt: now },
  });

  const guideRelated = [
    "zerdecalli-zeytinyagli-pilav",
    "sarimsakli-firinda-tavuk",
    "nar-eksili-kasik-salatasi",
    "ton-balikli-sebzeli-firin-makarna",
  ];
  const guideMealPlan = {
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
  };
  const guideContentJson = {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Bu rehber, dengeli bir güne dair örnek öğün dağılımı sunar. Porsiyonlar kişiye, aktiviteye ve sağlık durumuna göre değişir.",
          },
        ],
      },
      {
        type: "paragraph",
        content: [
          {
            type: "text",
            text: "Kronik hastalık, gebelik, çocukluk veya özel diyet gereksinimlerinde hekim ve diyetisyen görüşü alın.",
          },
        ],
      },
    ],
  } as Prisma.InputJsonValue;

  await prisma.nutritionGuide.upsert({
    where: { slug: GUIDE_DEFAULT_SEO.slug },
    update: {
      title: GUIDE_DEFAULT_SEO.title,
      intro: GUIDE_DEFAULT_SEO.intro,
      contentJson: guideContentJson,
      mealPlanJson: guideMealPlan,
      relatedRecipeSlugsJson: guideRelated,
      seoTitle: GUIDE_DEFAULT_SEO.seoTitle,
      seoDescription: GUIDE_DEFAULT_SEO.seoDescription,
      status: "PUBLISHED",
      publishedAt: now,
      deletedAt: null,
    },
    create: {
      slug: GUIDE_DEFAULT_SEO.slug,
      title: GUIDE_DEFAULT_SEO.title,
      intro: GUIDE_DEFAULT_SEO.intro,
      contentJson: guideContentJson,
      mealPlanJson: guideMealPlan,
      relatedRecipeSlugsJson: guideRelated,
      seoTitle: GUIDE_DEFAULT_SEO.seoTitle,
      seoDescription: GUIDE_DEFAULT_SEO.seoDescription,
      status: "PUBLISHED",
      publishedAt: now,
    },
  });

  const faqCount = await prisma.faq.count();
  if (faqCount === 0) {
    await prisma.faq.createMany({
      data: [
        {
          question: "Nasıl iletişime geçebilirim?",
          answerText:
            "WhatsApp, telefon veya e-posta. Online randevu takvimi yoktur.",
          position: 0,
          published: true,
        },
        {
          question: "Hesaplayıcılar teşhis koyar mı?",
          answerText:
            "Hayır. Yalnızca bilgilendirme amaçlıdır; kişisel tıbbi tavsiye değildir.",
          position: 1,
          published: true,
        },
      ],
    });
  }

  console.log("Seed tamam: örnek içerikler yazıldı.");
  console.log(
    "AdminUser oluşturulmadı (demo parola yok). Prompt 05 güvenli provisioning kullanın.",
  );

  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  process.exit(1);
});
