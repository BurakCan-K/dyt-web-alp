/**
 * Hizmetler — yayın içeriği.
 * Hitap: net, sakin, vaat-siz; süreç ve kapsam odaklı.
 * Sitede randevu takvimi / ödeme yok; iletişim WhatsApp, telefon veya e-posta.
 */

import type { TipTapDoc, TipTapNode } from "../src/lib/richtext/types";

export type LaunchService = {
  slug: string;
  title: string;
  summary: string;
  position: number;
  isFeatured: boolean;
  tags: string[];
  highlights: string[];
  forWhom: string[];
  process: string[];
  bodyParagraphs: string[];
  disclaimer: string;
  seoTitle: string;
  seoDescription: string;
  /** Geçici stok görsel (Cloudinary kapak atanana kadar) */
  imageUrl: string;
  imageAlt: string;
};

function textNode(text: string, bold = false): TipTapNode {
  return bold
    ? { type: "text", text, marks: [{ type: "bold" }] }
    : { type: "text", text };
}

function heading(text: string, level: 2 | 3 = 2): TipTapNode {
  return {
    type: "heading",
    attrs: { level },
    content: [textNode(text)],
  };
}

function paragraph(text: string): TipTapNode {
  return { type: "paragraph", content: text ? [textNode(text)] : [] };
}

function bulletList(items: string[]): TipTapNode {
  return {
    type: "bulletList",
    content: items.map((item) => ({
      type: "listItem",
      content: [paragraph(item)],
    })),
  };
}

export function buildServiceDescriptionDoc(service: LaunchService): TipTapDoc {
  return {
    type: "doc",
    content: [
      heading("Bu hizmette neler var?"),
      bulletList(service.highlights),
      heading("Kimler için uygun?"),
      bulletList(service.forWhom),
      heading("Süreç nasıl ilerler?"),
      {
        type: "orderedList",
        content: service.process.map((item) => ({
          type: "listItem",
          content: [paragraph(item)],
        })),
      },
      ...service.bodyParagraphs.map(paragraph),
      heading("Önemli not"),
      paragraph(service.disclaimer),
    ],
  };
}

export const launchServices: LaunchService[] = [
  {
    slug: "online-beslenme-danismanligi",
    title: "Online Beslenme Danışmanlığı",
    summary:
      "Görüntülü veya sesli görüşmelerle, yaşam tarzınıza uygun beslenme planı ve haftalık takip. Şehir fark etmeksizin WhatsApp üzerinden sürdürülebilir destek.",
    position: 0,
    isFeatured: true,
    tags: ["Online", "WhatsApp takip", "Haftalık plan"],
    highlights: [
      "İlk görüşmede sağlık öyküsü, hedefler ve günlük rutin değerlendirmesi",
      "Kişiye özel beslenme planı ve haftalık güncellemeler",
      "Haftalık görüntülü veya sesli kontrol görüşmesi",
      "Hafta içi çalışma saatlerinde WhatsApp üzerinden soru ve öğün desteği",
      "Ölçü / tartı takibi için pratik rehber (online)",
    ],
    forWhom: [
      "Yoğun tempo veya farklı şehirde olup düzenli takip isteyenler",
      "Yüz yüze gelmeden sürdürülebilir alışkanlık kurmak isteyenler",
      "Haftalık geri bildirimle ilerlemeyi sevenler",
    ],
    process: [
      "WhatsApp, telefon veya e-posta ile kısa ön bilgi paylaşımı",
      "İlk görüşme (yaklaşık 45–60 dk): hedefler, alışkanlıklar, kısıtlar",
      "Size özel planın iletilmesi ve uygulama başlangıcı",
      "Haftalık kontrollerle planın güncellenmesi",
    ],
    bodyParagraphs: [
      "Online danışmanlık, klinik teşhis veya ilaç tedavisi yerine geçmez. Kronik hastalık, gebelik veya özel tıbbi durumda hekim yönlendirmesi önceliklidir.",
      "Sitede otomatik randevu takvimi veya online ödeme yoktur; uygun görüşme zamanı iletişim kanallarından birlikte netleştirilir.",
    ],
    disclaimer:
      "Sonuç garantisi verilmez. Bu sayfa genel bilgilendirmedir; kişiye özel plan yalnızca danışmanlık sürecinde oluşturulur.",
    seoTitle: "Online Beslenme Danışmanlığı | WhatsApp Destekli Takip",
    seoDescription:
      "Online beslenme danışmanlığı: kişiye özel plan, haftalık görüşme ve WhatsApp desteği. Randevu için WhatsApp veya telefon.",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Online görüşme için dizüstü bilgisayar ve not defteri",
  },
  {
    slug: "yuz-yuze-beslenme-danismanligi",
    title: "Yüz Yüze Beslenme Danışmanlığı",
    summary:
      "Klinik ortamında bire bir görüşme, antropometrik değerlendirme ve kişiye özel plan. Takip sürecinde WhatsApp desteği devam eder.",
    position: 1,
    isFeatured: true,
    tags: ["Yüz yüze", "Ölçüm", "Klinik"],
    highlights: [
      "Yüz yüze ilk değerlendirme ve hedef belirleme",
      "Antropometrik ölçümler (klinik imkânlarına göre)",
      "Kişiye özel beslenme planı ve kontrol seansları",
      "Hafta içi WhatsApp üzerinden takip desteği",
      "Günlük hayata uyarlanabilir öğün önerileri",
    ],
    forWhom: [
      "Yüz yüze görüşmeyi ve ölçümle ilerlemeyi tercih edenler",
      "Ofis / klinik bölgesinde düzenli gelebilenler",
      "Motivasyonunu bire bir seanslarla güçlendirmek isteyenler",
    ],
    process: [
      "İletişim kanallarından ön bilgi ve uygun günün netleştirilmesi",
      "Klinik görüşme: ölçüm, öykü ve hedeflerin konuşulması",
      "Planın hazırlanması ve uygulama başlangıcı",
      "Kontrol seanslarıyla planın gözden geçirilmesi",
    ],
    bodyParagraphs: [
      "Yüz yüze danışmanlıkta da tıbbi teşhis konulmaz; gerekli görülen durumlarda hekim veya ilgili uzmana yönlendirme yapılır.",
      "Görüşme sıklığı ihtiyaca göre planlanır; sitede takvim rezervasyonu yoktur.",
    ],
    disclaimer:
      "Ölçüm sonuçları bilgilendirme amaçlıdır. Tedavi veya laboratuvar sonucunun yerine geçmez.",
    seoTitle: "Yüz Yüze Beslenme Danışmanlığı | Klinik Görüşme",
    seoDescription:
      "Yüz yüze beslenme danışmanlığı: ölçüm, kişiye özel plan ve WhatsApp takip. Görüşme için iletişime geçin.",
    imageUrl:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Sağlıklı besinlerle hazırlanmış dengeli bir öğün",
  },
  {
    slug: "surdurulebilir-kilo-yonetimi",
    title: "Sürdürülebilir Kilo Yönetimi",
    summary:
      "Yasaklar yerine denge: aç kalmadan, sosyal hayata uyumlu alışkanlıklarla kilo yönetimine odaklanan danışmanlık çerçevesi.",
    position: 2,
    isFeatured: false,
    tags: ["Kilo yönetimi", "Alışkanlık", "Denge"],
    highlights: [
      "Gerçekçi hedef belirleme (hızlı mucize vaadi yok)",
      "Öğün düzeni, porsiyon farkındalığı ve alışveriş pratikleri",
      "Sosyal yemek, tatil ve yoğun dönemlere uyarlanabilir stratejiler",
      "Haftalık takip ile planın ince ayarı",
      "İsteğe bağlı tarif ve pratik alternatif önerileri",
    ],
    forWhom: [
      "Kalıcı alışkanlık arayan, ekstrem diyetlerden uzak durmak isteyenler",
      "Kilo verme veya koruma sürecinde düzenli rehberlik isteyenler",
      "Yeme düzenini yaşam tarzına uydurmak isteyenler",
    ],
    process: [
      "Mevcut düzenin ve engellerin birlikte haritalanması",
      "Uygulanabilir ilk planın oluşturulması",
      "Haftalık geri bildirimlerle ilerleme ve tıkanıklıkların çözülmesi",
      "Koruma dönemine yumuşak geçiş planı",
    ],
    bodyParagraphs: [
      "Kilo yönetimi bireyseldir; “X günde Y kilo” gibi garanti veya baskı içeren bir dil kullanılmaz.",
      "Yeme bozukluğu şüphesi veya tıbbi durum varsa süreç hekim / ruh sağlığı uzmanı ile koordineli yürütülmelidir.",
    ],
    disclaimer:
      "Bu hizmet kilo kaybı veya sağlık sonucu garantisi vermez. Bilgilendirme ve alışkanlık desteği sunar.",
    seoTitle: "Sürdürülebilir Kilo Yönetimi | Dengeli Beslenme Danışmanlığı",
    seoDescription:
      "Yasaklamayan, sürdürülebilir kilo yönetimi danışmanlığı. Haftalık takip ve kişiye özel plan için iletişime geçin.",
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Taze sebze ve yeşilliklerden oluşan sağlıklı tabak",
  },
  {
    slug: "sporcu-ve-aktif-yasam-beslenmesi",
    title: "Sporcu ve Aktif Yaşam Beslenmesi",
    summary:
      "Antrenman temposuna göre enerji ve toparlanma odaklı beslenme düzeni. Performans hedefleri bireyseldir; genel çerçeve sunulur.",
    position: 3,
    isFeatured: false,
    tags: ["Performans", "Toparlanma", "Aktif yaşam"],
    highlights: [
      "Antrenman günü / dinlenme günü öğün dağılımı",
      "Karbonhidrat, protein ve sıvı ihtiyacına pratik yaklaşımlar",
      "Müsabaka veya yoğun dönemlere özel ince ayar (gerektiğinde)",
      "Takviye önerisi yerine gıda öncelikli yaklaşım",
      "Online veya yüz yüze takip seçenekleri",
    ],
    forWhom: [
      "Düzenli antrenman yapan amatör veya yarı profesyonel sporcular",
      "Aktif yaşam süren, enerji dengesini oturtmak isteyenler",
      "Antrenman saatlerine göre öğün planı arayanlar",
    ],
    process: [
      "Antrenman programı, hedefler ve mevcut beslenmenin değerlendirilmesi",
      "Haftalık menü iskeleti ve pratik alternatiflerin netleştirilmesi",
      "Antrenman yüküne göre planın güncellenmesi",
      "İlerleme ve toparlanma geri bildirimleri",
    ],
    bodyParagraphs: [
      "Performans artışı kişiye, uykuya, antrenman kalitesine ve genel sağlığa bağlıdır; tek başına beslenme mucize sonuç üretmez.",
      "Sakatlık, klinik tanı veya doping kuralları söz konusuysa ilgili uzman / federasyon kuralları esas alınır.",
    ],
    disclaimer:
      "Sporcu beslenmesi bilgilendirme amaçlıdır; doping, ilaç veya tedavi protokolü sunulmaz.",
    seoTitle: "Sporcu ve Aktif Yaşam Beslenmesi | Performans Destekli Plan",
    seoDescription:
      "Antrenmana uyumlu beslenme danışmanlığı: öğün zamanlaması, toparlanma ve sürdürülebilir plan. WhatsApp ile bilgi alın.",
    imageUrl:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Antrenman yapan kişi ve sağlıklı yaşam teması",
  },
  {
    slug: "ozel-donem-beslenme-destegi",
    title: "Özel Dönem Beslenme Desteği",
    summary:
      "Gebelik, emzirme veya hekim takibindeki özel dönemlerde genel beslenme bilgilendirmesi ve alışkanlık desteği. Tedavi yerine geçmez.",
    position: 4,
    isFeatured: false,
    tags: ["Özel dönem", "Kadın sağlığı", "Bilgilendirme"],
    highlights: [
      "Döneme uygun öğün düzeni ve pratik alternatifler",
      "Yeterli çeşitlilik ve sürdürülebilir alışkanlık önerileri",
      "Hekim / ebe önerileriyle çelişmeyen destekleyici yaklaşım",
      "WhatsApp üzerinden soru ve plan güncelleme desteği",
      "Gerekirse ilgili uzmana yönlendirme",
    ],
    forWhom: [
      "Gebelik veya emzirme döneminde beslenme düzenini netleştirmek isteyenler",
      "Hekim takibinde olup beslenme alışkanlığı desteği arayanlar",
      "Özel dönemde güvenli ve sakin bir rehberlik bekleyenler",
    ],
    process: [
      "Mevcut dönem, hekim notları ve günlük düzenin dinlenmesi",
      "Uygulanabilir beslenme çerçevesinin birlikte oluşturulması",
      "Düzenli geri bildirimle planın yumuşak güncellenmesi",
      "İhtiyaç halinde hekim ile koordinasyon önerisi",
    ],
    bodyParagraphs: [
      "Bu hizmet tıbbi takip, reçete veya laboratuvar yorumu değildir. Gebelik ve emzirmede nihai karar hekimindedir.",
      "Riskli gebelik, yeme güçlüğü veya klinik belirti varsa öncelik sağlık kuruluşudur.",
    ],
    disclaimer:
      "Özel dönem desteği genel bilgilendirmedir; teşhis, tedavi veya ilaç yerine geçmez.",
    seoTitle: "Özel Dönem Beslenme Desteği | Gebelik ve Emzirme Bilgilendirme",
    seoDescription:
      "Gebelik ve emzirme döneminde beslenme bilgilendirmesi. Hekim takibine ek alışkanlık desteği için iletişime geçin.",
    imageUrl:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Renkli sebze ve meyvelerle dengeli beslenme masası",
  },
];

/** Liste sayfasındaki sabit süreç adımları */
export const servicesProcessSteps = [
  {
    step: "01",
    title: "Kısa ön görüşme",
    text: "WhatsApp, telefon veya e-posta ile ihtiyacınızı dinliyoruz; uygun hizmeti birlikte netleştiriyoruz.",
  },
  {
    step: "02",
    title: "Değerlendirme",
    text: "Online veya yüz yüze ilk görüşmede hedefler, alışkanlıklar ve kısıtlar konuşulur.",
  },
  {
    step: "03",
    title: "Kişiye özel plan",
    text: "Uygulanabilir bir beslenme çerçevesi hazırlanır; yasak listesi değil, denge odaklıdır.",
  },
  {
    step: "04",
    title: "Düzenli takip",
    text: "Haftalık kontroller ve çalışma saatlerinde WhatsApp desteğiyle plan güncellenir.",
  },
] as const;
