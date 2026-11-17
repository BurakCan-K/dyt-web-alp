/**
 * Yer tutucu site kimliği + SEO varsayılanları.
 * Gerçek ad, iletişim ve unvan yayın öncesi admin’den güncellenir.
 *
 * SEO notları (Google / diyetisyen pratikleri):
 * - Ana sayfa title: konu başta, marka sonda; ~50–60 karakter hedefi
 * - Meta description: sayfaya özgü, doğal cümle, ~120–155 karakter
 * - Alt sayfalar: `Sayfa | Marka` şablonu (buildMetadata)
 */

export const SITE_DEFAULTS = {
  brandName: "Örnek Klinik",
  dietitianName: "[Diyetisyen Adı]",
  professionalTitle: "Diyetisyen",
  heroTitle: "Yasaklar olmadan, sürdürülebilir beslenme",
  heroSubtitle:
    "Kişiye özel danışmanlık, bilgilendirici yazılar ve pratik araçlar. Görüşme WhatsApp, telefon veya e-posta ile netleştirilir; sitede randevu takvimi yoktur.",
  biography:
    "Bu biyografi alanı yayın öncesi gerçek eğitim, yaklaşım ve deneyim özetinizle güncellenmelidir. Belgesiz unvan, fiyat veya “garanti sonuç” vaadi eklemeyin.",
  /** Ana sayfa / varsayılan document title */
  metaTitle: "Diyetisyen ve Beslenme Danışmanlığı | Örnek Klinik",
  /** Ana sayfa snippet — ~155 karakter */
  metaDescription:
    "Sürdürülebilir beslenme danışmanlığı, online ve yüz yüze görüşme bilgisi, tarifler ile bilgilendirme araçları. Teşhis değildir; iletişim kanallarından yazın.",
} as const;

/** Statik sayfa SEO (title kısa; marka buildMetadata ile eklenir) */
export const PAGE_SEO = {
  home: {
    title: SITE_DEFAULTS.metaTitle,
    description: SITE_DEFAULTS.metaDescription,
  },
  hizmetler: {
    title: "Beslenme Danışmanlığı Hizmetleri",
    description:
      "Online ve yüz yüze danışmanlık, kilo yönetimi ve aktif yaşam desteği. Süreç WhatsApp, telefon veya e-posta ile planlanır.",
  },
  blog: {
    title: "Beslenme Blog Yazıları",
    description:
      "Öğün planı, tabak modeli, lif ve yaşam alışkanlıkları üzerine bilgilendirme yazıları. Teşhis veya kişiye özel tedavi değildir.",
  },
  tarifler: {
    title: "Sağlıklı Tarifler",
    description:
      "Ölçülü malzemeli tarif örnekleri: yan yemek, ana yemek ve salata. Porsiyon ölçekleme tarayıcıda yapılır.",
  },
  rehberler: {
    title: "Beslenme Rehberleri",
    description:
      "Genel örnek beslenme çerçeveleri ve öğün dağılımı. Hastalık diyeti veya kişiye özel reçete değildir.",
  },
  hesaplayicilar: {
    title: "Beslenme Hesaplayıcıları",
    description:
      "VKİ, enerji, makro ve besin araçları. Sonuçlar teşhis değildir; hesaplar tarayıcınızda kalır, kaydedilmez.",
  },
  hakkimda: {
    title: "Hakkımda",
    description:
      "Diyetisyen yaklaşımı ve kısa biyografi. Unvan ve eğitim bilgileri yayın öncesi belgelerle doğrulanmalıdır.",
  },
  iletisim: {
    title: "İletişim",
    description:
      "WhatsApp, telefon veya e-posta ile ulaşın. Online randevu takvimi ve ödeme formu yoktur.",
  },
  gizlilik: {
    title: "Gizlilik Politikası",
    description:
      "Kişisel verilerin işlenmesine ilişkin gizlilik bilgilendirmesi. Onaylı metin yayın öncesi güncellenir.",
  },
  kvkk: {
    title: "KVKK Aydınlatma Metni",
    description:
      "6698 sayılı KVKK kapsamında aydınlatma metni. Nihai metin hukuk danışmanlığıyla onaylanmalıdır.",
  },
  cerez: {
    title: "Çerez Politikası",
    description:
      "Sitede kullanılan çerezler ve tercihlerinize dair bilgilendirme. Onaylı politika yayın öncesi eklenir.",
  },
} as const;

export const GUIDE_DEFAULT_SEO = {
  slug: "ornek-gunluk-cerceve",
  title: "Örnek Günlük Beslenme Çerçevesi",
  intro:
    "Dengeli bir güne dair genel öğün dağılımı örneği. Hastalık tedavisi veya kişiye özel reçete değildir.",
  seoTitle: "Örnek Günlük Beslenme Çerçevesi | Bilgilendirme",
  seoDescription:
    "Kahvaltıdan akşama örnek öğün çerçevesi ve ilgili tarif önerileri. Genel bilgilendirmedir; tıbbi diyet yerine geçmez.",
} as const;
