/**
 * Geliştirme fixture'ları.
 * Yer tutucu kimlik / SEO: `site-defaults.ts`
 * Gerçek kimlik, adres, diploma, memnuniyet sayısı gibi iddialar içermez.
 * İçerik listeleri için `data/content.ts` kullanın.
 */

import { getPublishedServices } from "./content";
import { SITE_DEFAULTS } from "./site-defaults";

export const EXAMPLE_BANNER = "ÖRNEK İÇERİK — YAYIN ÖNCESİ DEĞİŞTİR";

export type FixtureStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type SiteSettingsFixture = {
  brandName: string;
  dietitianName: string;
  professionalTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  phone: string | null;
  whatsappE164: string | null;
  email: string | null;
  address: string | null;
  metaTitle: string;
  metaDescription: string;
  isPlaceholder: true;
};

export type ServiceFixture = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  isFeatured: boolean;
  status: FixtureStatus;
};

export type PostFixture = {
  slug: string;
  title: string;
  excerpt: string;
  status: FixtureStatus;
};

export type FaqFixture = {
  id: string;
  question: string;
  answer: string;
  published: boolean;
};

export type ApproachPillar = {
  id: string;
  title: string;
  description: string;
};

export type ProcessStep = {
  id: string;
  title: string;
  description: string;
};

export type ContentPreview = {
  href: string;
  title: string;
  excerpt: string;
  kind: "blog" | "tarif" | "rehber" | "hesaplayici";
};

export const siteSettingsFixture: SiteSettingsFixture = {
  brandName: SITE_DEFAULTS.brandName,
  dietitianName: SITE_DEFAULTS.dietitianName,
  professionalTitle: SITE_DEFAULTS.professionalTitle,
  heroTitle: SITE_DEFAULTS.heroTitle,
  heroSubtitle: SITE_DEFAULTS.heroSubtitle,
  phone: null,
  whatsappE164: null,
  email: null,
  address: null,
  metaTitle: SITE_DEFAULTS.metaTitle,
  metaDescription: SITE_DEFAULTS.metaDescription,
  isPlaceholder: true,
};

/** @deprecated Ana kaynak: `data/content.ts` — geriye uyumluluk */
export const servicesFixture: ServiceFixture[] = [];

export const approachPillarsFixture: ApproachPillar[] = [
  {
    id: "1",
    title: "Katı Diyet Listeleri Yok",
    description:
      "Menüler günlük rutininize ve tercihlerinize göre birlikte planlanır; yasak listesi dayatılmaz.",
  },
  {
    id: "2",
    title: "Bilimsel ve Kanıta Dayalı Yaklaşım",
    description:
      "Genel bilgilendirme ve ölçülebilir hedeflerle ilerlenir. Teşhis veya tedavi vaadi sunulmaz.",
  },
  {
    id: "3",
    title: "Açık İletişim",
    description:
      "Görüşme süreci WhatsApp, telefon veya e-posta ile netleştirilir. Online takvim veya ödeme sistemi yoktur.",
  },
];

export const processStepsFixture: ProcessStep[] = [
  {
    id: "1",
    title: "Ön Tanışma",
    description:
      "Hedefleriniz ve yaşam düzeniniz dinlenir; uygun iletişim kanalı belirlenir.",
  },
  {
    id: "2",
    title: "Beslenme Planı",
    description:
      "Tercihlerinize uygun, uygulanabilir bir beslenme çerçevesi oluşturulur.",
  },
  {
    id: "3",
    title: "Düzenli Takip",
    description:
      "İlerleme birlikte gözden geçirilir; gerekirse plan güncellenir.",
  },
  {
    id: "4",
    title: "Sürdürülebilirlik",
    description:
      "Kazanılan alışkanlıkların korunmasına odaklanılır; kısa vadeli şok diyet önerilmez.",
  },
];

/** Testimonials yerine içerik önizlemesi — doğrulanmamış yorum yok */
export const contentPreviewFixture: ContentPreview[] = [
  {
    href: "/blog",
    title: "Blog yazıları",
    excerpt:
      "Öğün planı, tabak modeli ve yaşam alışkanlıkları üzerine bilgilendirme yazıları.",
    kind: "blog",
  },
  {
    href: "/tarifler",
    title: "Sağlıklı tarifler",
    excerpt: "Ölçülü malzemeli yan yemek, ana yemek ve salata tarifleri.",
    kind: "tarif",
  },
  {
    href: "/hesaplayicilar",
    title: "Hesaplayıcılar",
    excerpt: "VKİ, enerji ve makro araçları yalnızca bilgilendirme amaçlıdır.",
    kind: "hesaplayici",
  },
];

/** @deprecated Liste kaynağı: `getPublishedPosts()` / launch blog data */
export const postsFixture: PostFixture[] = [
  {
    slug: "haftalik-ogun-plani-nasil-kurulur",
    title: "Haftalık öğün planı nasıl kurulur?",
    excerpt:
      "Yoğun haftada alışveriş ve hazırlığı sadeleştirmek için pratik bir çerçeve.",
    status: "PUBLISHED",
  },
];

export const faqsFixture: FaqFixture[] = [
  {
    id: "1",
    question: "Nasıl iletişime geçebilirim?",
    answer:
      "WhatsApp, telefon veya e-posta üzerinden. Site ayarlarında tanımlı kanallar kullanılacaktır. Online randevu takvimi yoktur.",
    published: true,
  },
  {
    id: "2",
    question: "Hesaplayıcılar tıbbi teşhis koyar mı?",
    answer:
      "Hayır. VKİ ve enerji araçları yalnızca bilgilendirme amaçlıdır; kişisel tıbbi tavsiye yerine geçmez.",
    published: true,
  },
  {
    id: "3",
    question: "Online görüşme mümkün mü?",
    answer:
      "İletişim kanalları üzerinden süreç konuşulabilir. Bu sitede otomatik randevu veya ödeme alınmaz.",
    published: true,
  },
  {
    id: "4",
    question: "İçerikler kim tarafından yönetilir?",
    answer:
      "Blog, tarif, hizmet ve SSS kayıtları korumalı admin panelinden yayınlanır.",
    published: true,
  },
];

export function publishedServices(): ServiceFixture[] {
  return getPublishedServices().map((s) => ({
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    tags: s.tags,
    isFeatured: s.isFeatured,
    status: s.status,
  }));
}

export function publishedPosts() {
  return postsFixture.filter((p) => p.status === "PUBLISHED");
}

export function publishedFaqs() {
  return faqsFixture.filter((f) => f.published);
}
