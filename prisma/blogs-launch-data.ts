/**
 * Blog — yayın içeriği.
 * Konular yaygın diyetisyen bilgilendirme yazılarından esinlenmiştir;
 * metinler özgün yazılmıştır (telif kopyası değildir).
 * Teşhis / tedavi / kişiye özel reçete iddiası yoktur.
 */

import type { TipTapDoc, TipTapNode } from "../src/lib/richtext/types";

export type LaunchPostCategory = {
  slug: string;
  title: string;
  position: number;
};

export type LaunchBlogSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LaunchBlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  tags: string[];
  sections: LaunchBlogSection[];
  closing: string[];
  disclaimer: string;
  references: string[];
  seoTitle: string;
  seoDescription: string;
  publishedAt: string;
  coverImageUrl: string;
  coverImageAlt: string;
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

export function buildBlogContentDoc(post: LaunchBlogPost): TipTapDoc {
  const nodes: TipTapNode[] = [];
  for (const section of post.sections) {
    nodes.push(heading(section.heading));
    for (const p of section.paragraphs) nodes.push(paragraph(p));
    if (section.bullets?.length) nodes.push(bulletList(section.bullets));
  }
  for (const p of post.closing) nodes.push(paragraph(p));
  nodes.push(heading("Önemli not"));
  nodes.push(paragraph(post.disclaimer));
  return { type: "doc", content: nodes };
}

export const launchPostCategories: LaunchPostCategory[] = [
  { slug: "beslenme", title: "Beslenme", position: 0 },
  { slug: "tarif-ipuclari", title: "Tarif İpuçları", position: 1 },
  { slug: "yasam", title: "Yaşam", position: 2 },
];

export const launchBlogPosts: LaunchBlogPost[] = [
  {
    slug: "haftalik-ogun-plani-nasil-kurulur",
    title: "Haftalık öğün planı nasıl kurulur?",
    excerpt:
      "Yoğun haftada alışverişi ve yemek hazırlığını sadeleştirmek için pratik bir çerçeve: evde/dışarıda öğünler, tekrarlayan malzemeler ve gerçekçi alternatifler.",
    categorySlug: "beslenme",
    tags: ["öğün planı", "alışveriş", "sürdürülebilirlik"],
    sections: [
      {
        heading: "Neden plan yapmak işe yarar?",
        paragraphs: [
          "Haftalık bir çerçeve, her gün sıfırdan karar vermeyi azaltır. Amaç mükemmel bir menü değil; sizin temposunuza uyan, tekrarlanabilir bir düzen kurmaktır.",
          "Plan, kişiye özel diyet reçetesi değildir. Enerji ihtiyacı, sağlık durumu ve tercihler bireyler arasında değişir.",
        ],
      },
      {
        heading: "4 adımlı basit kurulum",
        paragraphs: [
          "Kağıt veya not uygulamasında haftayı bir tabloya dökmek yeterlidir. Aşağıdaki sıra çoğu kişi için uygulanabilirdir:",
        ],
        bullets: [
          "Takvimde evde ve dışarıda yenilecek öğünleri işaretleyin.",
          "2–3 protein (yumurta, baklagil, kümes/balık veya bitkisel alternatif), birkaç tahıl–baklagil ve mevsim sebzesi seçin.",
          "Yoğun günler için “hızlı alternatif” (ör. yoğurt + meyve + ceviz) tanımlayın.",
          "Menüye göre alışveriş listesini yazın; aynı malzemeyi iki öğünde kullanmak israfı azaltır.",
        ],
      },
      {
        heading: "Tekrar etmek sorun değil",
        paragraphs: [
          "Her günün tamamen farklı olması gerekmez. Aynı çorbayı iki öğünde kullanmak, sebzeleri önceden doğramak veya porsiyonlayıp saklamak zaman kazandırır.",
          "Dışarıda yiyecekseniz menüde protein + sebze + tahıl bileşenlerini birlikte aramak seçimi kolaylaştırır. Porsiyonu günün aktivitesine ve açlığa göre ayarlayın.",
        ],
      },
    ],
    closing: [
      "Planı denedikten sonra hangi öğünün işe yaradığını not edin. Bir sonraki hafta yalnızca zorlanan günleri güncellemek çoğu zaman yeterlidir.",
    ],
    disclaimer:
      "Bu yazı genel bilgilendirmedir; teşhis, tedavi veya kişiye özel beslenme programı değildir. Kronik hastalık, gebelik veya özel tıbbi durumda hekim ve diyetisyen yönlendirmesi önceliklidir.",
    references: [
      "WHO — Healthy diet (genel ilkeler)",
      "T.C. Sağlık Bakanlığı — Türkiye Beslenme Rehberi (TÜBER) genel çerçeve",
    ],
    seoTitle: "Haftalık Öğün Planı Nasıl Kurulur? | Pratik Çerçeve",
    seoDescription:
      "Evde ve dışarıda öğünleri ayırarak, tekrarlayan malzemelerle haftalık beslenme planı kurmaya dair genel bilgilendirme.",
    publishedAt: "2026-03-01",
    coverImageUrl:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Kesme tahtasında sebze ve yemek hazırlığı",
  },
  {
    slug: "tabak-yontemiyle-dengeli-ogun",
    title: "Tabak yöntemiyle dengeli öğüne bakış",
    excerpt:
      "Yarım tabak sebze–meyve, çeyrek tahıl, çeyrek protein: görsel bir başlangıç modeli. Kalori hesabı değildir; miktarlar kişiye göre değişir.",
    categorySlug: "beslenme",
    tags: ["tabak modeli", "dengeli beslenme", "öğün"],
    sections: [
      {
        heading: "Model ne işe yarar?",
        paragraphs: [
          "Dengeli beslenme, tek bir “süper gıdaya” veya herkese aynı kalori sayısına dayanmaz. Yeterlilik, çeşitlilik ve miktar birlikte düşünülür.",
          "Tabak yöntemi, öğüne bakarken eksik kalan grubu hızlıca fark etmeye yardımcı olan görsel bir çerçevedir.",
        ],
      },
      {
        heading: "Basit oranlar",
        paragraphs: ["Başlangıç için şu dağılımı deneyebilirsiniz:"],
        bullets: [
          "Yaklaşık yarım tabak: sebze ve/veya meyve (salata, fırın sebze, mevsim yeşillikleri).",
          "Çeyrek tabak: tahıl veya nişastalı yan (bulgur, tam tahıllı ekmek, makarna, patates — patatesi “tüm sebze” yerine nişasta grubunda düşünün).",
          "Çeyrek tabak: protein (baklagil, yumurta, balık, kümes, yoğurt veya uygun bitkisel alternatif).",
          "Ölçülü yağ ekleyin; içecek olarak su tercih edin.",
        ],
      },
      {
        heading: "Örnek kombinasyonlar (şablon)",
        paragraphs: [
          "Bunlar kişiye özel program değildir; açlık, aktivite ve sağlık durumuna göre miktarlar değişir.",
        ],
        bullets: [
          "Kahvaltı: yumurta + tam tahıllı ekmek + domates–salatalık veya yoğurt + yulaf + meyve.",
          "Öğle: nohut yemeği + bulgur + mevsim salata.",
          "Akşam: fırın balık + sebze + az miktarda ekmek veya patates.",
          "Gerekirse ara öğün: meyve + sade yoğurt veya az miktarda tuzsuz kuruyemiş.",
        ],
      },
    ],
    closing: [
      "Şekerli içecekler, sık tüketilen tuzlu atıştırmalıklar ve doymuş yağı yüksek ürünleri gözden geçirmek; ekmek veya meyveyi tek başına “dengesizlik” saymaktan daha pratiktir. Tür, miktar ve günün geri kalanı birlikte değerlendirilir.",
    ],
    disclaimer:
      "Teşhis veya tedavi değildir. Sıvı kısıtı, alerji veya tıbbi diyet varsa hekim önerisi geçerlidir.",
    references: [
      "USDA MyPlate / benzeri tabak modelleri (görsel oran fikri)",
      "WHO — Healthy diet",
    ],
    seoTitle: "Tabak Yöntemiyle Dengeli Öğün | Bilgilendirme",
    seoDescription:
      "Sebze, tahıl ve protein oranlarıyla tabak modeline genel bakış. Kişiye özel reçete değildir.",
    publishedAt: "2026-03-05",
    coverImageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Renkli sebze salatası tabağı",
  },
  {
    slug: "mutfakta-pratrik-hazirlik",
    title: "Mutfakta pratik hazırlık: zaman kazandıran alışkanlıklar",
    excerpt:
      "Hafta içi yemek stresini azaltmak için sebze doğrama, baklagil haşlama ve porsiyonlama gibi düşük eforlu mutfak rutinleri.",
    categorySlug: "tarif-ipuclari",
    tags: ["mutfak", "meal prep", "zaman"],
    sections: [
      {
        heading: "Kısa bir hazırlık penceresi",
        paragraphs: [
          "30–60 dakikalık bir “hazırlık turu”, sonraki günlerde karar yorgunluğunu azaltır. Amaç restoran kalitesinde üretmek değil; temiz malzemeyi kullanıma hazır hale getirmektir.",
        ],
      },
      {
        heading: "Ne hazırlanabilir?",
        paragraphs: [],
        bullets: [
          "Yıkanmış ve doğranmış sebzeler (hava almayan kapta).",
          "Haşlanmış baklagil veya önceden pişmiş tahıl (bulgur, esmer pirinç).",
          "Porsiyonlanmış yoğurt / süzme yoğurt kapları.",
          "Basit sos veya limon–zeytinyağı karışımı (tuzu ölçülü tutun).",
        ],
      },
      {
        heading: "Güvenli saklama notları",
        paragraphs: [
          "Piçmiş yemekleri hızlı soğutup buzdolabında saklayın; şüpheli görünen veya kokan ürünleri tüketmeyin.",
          "Et ve çiğ sebze tahtalarını ayırmak çapraz bulaşmayı azaltır. Bu yazı gıda güvenliği kursunun yerini tutmaz.",
        ],
      },
    ],
    closing: [
      "Hazırlığı kendi temposunuza göre ölçekleyin. İlk hafta yalnızca iki sebze ve bir baklagil hazırlamak bile fark yaratabilir.",
    ],
    disclaimer:
      "Genel mutfak bilgilendirmesidir. Gıda zehirlenmesi şüphesinde sağlık kuruluşuna başvurun.",
    references: [
      "WHO — Five keys to safer food (genel gıda hijyeni ilkeleri)",
    ],
    seoTitle: "Mutfakta Pratik Hazırlık | Meal Prep İpuçları",
    seoDescription:
      "Sebze, baklagil ve porsiyonlama ile hafta içi yemek hazırlığını sadeleştirme önerileri.",
    publishedAt: "2026-03-08",
    coverImageUrl:
      "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Mutfakta yemek hazırlayan kişi",
  },
  {
    slug: "lif-tuketimini-artirmak",
    title: "Lif tüketimini artırmak: günlük hedefe yaklaşmak",
    excerpt:
      "Yetişkinlerde sık anılan lif aralıklarına genel bakış; baklagil, tam tahıl, sebze ve meyveyle pratik adımlar. Takviye önerisi değildir.",
    categorySlug: "beslenme",
    tags: ["lif", "baklagil", "tam tahıl"],
    sections: [
      {
        heading: "Neden konuşuyoruz?",
        paragraphs: [
          "Besinsel lif; sebze, meyve, baklagil, tam tahıl ve bazı tohumlarda bulunur. Tokluk hissi, bağırsak düzeni ve öğünün glisemik yükünü yumuşatma açısından sık vurgulanır.",
          "Uluslararası rehberlerde yetişkinler için yaklaşık 25 g/gün (kadın) ile 38 g/gün (erkek) gibi hedefler anılır; bireysel ihtiyaç ve tolerans değişir.",
        ],
      },
      {
        heading: "Pratik artırma yolları",
        paragraphs: [
          "Ani ve büyük artış bazı kişilerde şişkinlik yapabilir. Sıvı alımını da gözeterek kademeli ilerlemek daha iyi tolere edilir.",
        ],
        bullets: [
          "Beyaz ekmek yerine tam tahıllı seçenekleri denemek.",
          "Haftada birkaç öğüne mercimek, nohut veya kuru fasulye eklemek.",
          "Ara öğüne meyve koymak; salatayı ana öğünün yanına almak.",
          "Kabuklu yenilebilen meyvelerde kabuğu yıkayıp tüketmek (kişisel tercihe göre).",
        ],
      },
      {
        heading: "Ne değildir?",
        paragraphs: [
          "Bu yazı detoks, temizlenme kürü veya hastalık tedavisi vaat etmez. Lif takviyesi kullanmadan önce özellikle ilaç kullanan veya sindirim hastalığı olan kişiler hekime danışmalıdır.",
        ],
      },
    ],
    closing: [
      "Küçük değişiklikleri bir hafta deneyip hangi öğünün sürdürülebilir olduğunu not etmek, “hemen 30 g” dayatmaktan daha gerçekçidir.",
    ],
    disclaimer:
      "Bilgilendirme amaçlıdır; teşhis/tedavi değildir. Tıbbi diyet veya bağırsak hastalığında uzman görüşü önceliklidir.",
    references: [
      "EFSA / ABD DRI — yetişkinler için diyet lifi referans aralıkları (genel)",
      "WHO — Healthy diet (meyve, sebze, tam tahıl vurgusu)",
    ],
    seoTitle: "Lif Tüketimini Artırmak | Pratik Adımlar",
    seoDescription:
      "Baklagil, tam tahıl ve sebze–meyve ile lif alımını kademeli artırmaya dair genel bilgilendirme.",
    publishedAt: "2026-03-12",
    coverImageUrl:
      "https://images.unsplash.com/photo-1464226184884-fa280b87cbae?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Taze sebze ve baklagiller",
  },
  {
    slug: "uyku-ritim-ve-beslenme",
    title: "Uyku düzeni ve beslenme alışkanlıkları",
    excerpt:
      "Düzenli uyku ile öğün saatleri arasındaki ilişkiyi abartmadan anlatan genel bir bakış. Uyku bozukluğu tedavisi değildir.",
    categorySlug: "yasam",
    tags: ["uyku", "alışkanlık", "rutin"],
    sections: [
      {
        heading: "Birlikte düşünen iki alışkanlık",
        paragraphs: [
          "Düzensiz uyku; ertesi gün açlık, yorgunluk ve hazır gıdaya yönelimi etkileyebilir. Tersine, çok geç ve ağır öğünler bazı kişilerde uykuya dalmayı zorlaştırabilir.",
          "Bu ilişki herkes için aynı şekilde işlemez. Amaç korkutmak değil; rutini gözlemlemek için bir çerçeve sunmaktır.",
        ],
      },
      {
        heading: "Denenebilecek sakin adımlar",
        paragraphs: [],
        bullets: [
          "Mümkünse yatış ve uyanış saatlerini hafta içi–hafta sonu birbirine yaklaştırmak.",
          "Yatma saatine yakın çok yağlı veya aşırı büyük öğünleri gözden geçirmek.",
          "Kafein içeren içeceklerin saatini kendi toleransınıza göre sınırlamak.",
          "Ekran ve yatak odası ışığını azaltmak (uyku hijyeni genel ilkesi).",
        ],
      },
      {
        heading: "Ne zaman destek alınmalı?",
        paragraphs: [
          "Kronik uykusuzluk, horlama veya gündüz aşırı uyuklama gibi durumlarda hekime başvurmak uygundur. Beslenme yazısı uyku laboratuvarı veya ilaç tedavisinin yerini tutmaz.",
        ],
      },
    ],
    closing: [
      "Bir hafta boyunca uyku saatlerinizi ve ana öğün saatlerinizi not etmek, hangi günlerin zorlandığını görmenize yardımcı olabilir.",
    ],
    disclaimer:
      "Tıbbi teşhis veya tedavi değildir. Uyku bozukluğu şüphesinde sağlık kuruluşuna başvurun.",
    references: [
      "CDC / uyku hijyeni genel önerileri (özet düzeyinde)",
      "WHO — sağlıklı yaşam alışkanlıkları çerçevesi",
    ],
    seoTitle: "Uyku Düzeni ve Beslenme Alışkanlıkları",
    seoDescription:
      "Uyku ritmi ile öğün düzeni arasındaki genel ilişkiye dair bilgilendirme. Tedavi iddiası yoktur.",
    publishedAt: "2026-03-15",
    coverImageUrl:
      "https://images.unsplash.com/photo-1541781774529-668a11382d11?auto=format&fit=crop&w=1200&q=80",
    coverImageAlt: "Sakin yatak odası ve sabah ışığı",
  },
];
