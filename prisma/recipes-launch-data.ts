/**
 * İlk yayın tarif koleksiyonu — ölçülü malzemeler + tahmini porsiyon besin değerleri.
 * Besin değerleri USDA FoodData Central benzeri ortalama bileşime göre yaklaşık hesaplanmıştır;
 * laboratuvar analizi değildir. Hastaya özel kilo verme / tedavi iddiası içermez.
 */

export type LaunchIngredient = {
  position: number;
  name: string;
  quantityDecimal: number;
  unit: string;
  note?: string | null;
};

export type LaunchRecipe = {
  slug: string;
  title: string;
  excerpt: string;
  categorySlug: string;
  categoryTitle: string;
  categoryPosition: number;
  servingCount: number;
  prepMinutes: number;
  cookMinutes: number;
  difficulty: string;
  ingredients: LaunchIngredient[];
  steps: string[];
  tips: string[];
  allergens: string[];
  nutrientsPerServing: {
    kcal: number;
    proteinG: number;
    carbG: number;
    fatG: number;
  };
  nutrientSource: string;
  seoTitle: string;
  seoDescription: string;
};

const NUTRIENT_NOTE =
  "Tahmini (USDA ortalama bileşimi + gram/ml ölçüler). Lab analizi değil; tedavi/kişisel diyet yerine geçmez.";

export const launchRecipeCategories = [
  { slug: "yan-yemek", title: "Yan Yemek", position: 0 },
  { slug: "ana-yemek", title: "Ana Yemek", position: 1 },
  { slug: "salata", title: "Salata", position: 2 },
] as const;

export const launchRecipes: LaunchRecipe[] = [
  {
    slug: "zerdecalli-zeytinyagli-pilav",
    title: "Zerdeçallı Zeytinyağlı Pilav",
    excerpt:
      "Ölçülü zeytinyağı ve baharatlarla hazırlanan, ana yemeklerin yanına uyum sağlayan aromatik pilav.",
    categorySlug: "yan-yemek",
    categoryTitle: "Yan Yemek",
    categoryPosition: 0,
    servingCount: 4,
    prepMinutes: 10,
    cookMinutes: 20,
    difficulty: "kolay",
    ingredients: [
      { position: 0, name: "Pirinç (çiğ, yıkanmış)", quantityDecimal: 200, unit: "g" },
      { position: 1, name: "Su", quantityDecimal: 400, unit: "ml" },
      { position: 2, name: "Zeytinyağı", quantityDecimal: 24, unit: "ml", note: "yaklaşık 2 yemek kaşığı" },
      { position: 3, name: "Soğan", quantityDecimal: 80, unit: "g", note: "ince doğranmış" },
      { position: 4, name: "Zerdeçal", quantityDecimal: 3, unit: "g", note: "yaklaşık 1 tatlı kaşığı" },
      { position: 5, name: "Tuz", quantityDecimal: 3, unit: "g" },
      { position: 6, name: "Karabiber", quantityDecimal: 1, unit: "g", note: "isteğe bağlı" },
    ],
    steps: [
      "Pirinci soğuk suda 2–3 kez yıkayıp süzün; 10 dakika suda bekletebilirsiniz.",
      "Geniş bir tencerede zeytinyağını orta ateşte ısıtın. Soğanı ekleyip 3–4 dakika şeffaflaşana kadar soteleyin.",
      "Zerdeçalı ekleyip 20–30 saniye karıştırın; ardından süzülmüş pirinci ekleyip 1 dakika kavurun.",
      "Suyu, tuzu ve karabiberi ekleyin. Kaynayınca ateşi kısın, kapağı kapatın.",
      "Yaklaşık 15–18 dakika suyu çekene kadar pişirin. Altını kapatıp 5 dakika demlendirin, çatal ile hafifçe kabartın.",
    ],
    tips: [
      "Zerdeçalı yağda kısa süre ısıtmak aromayı açar; yakmamaya dikkat edin.",
      "Porsiyon kontrolü için pirinci çiğ gram üzerinden ölçün.",
      "Daha hafif bir sonuç için zeytinyağını 16 ml’ye düşürebilirsiniz (besin değerleri de değişir).",
    ],
    allergens: ["Yok (tarifte bilinen majör alerjen yok; çapraz bulaşmaya dikkat)"],
    nutrientsPerServing: { kcal: 245, proteinG: 4, carbG: 42, fatG: 7 },
    nutrientSource: NUTRIENT_NOTE,
    seoTitle: "Zerdeçallı Zeytinyağlı Pilav Tarifi | Ölçülü Yan Yemek",
    seoDescription:
      "4 porsiyonluk zerdeçallı zeytinyağlı pilav: ölçülü malzemeler, adım adım yapılış ve porsiyon başına tahmini besin değerleri.",
  },
  {
    slug: "sarimsakli-firinda-tavuk",
    title: "Sarımsaklı Fırında Tavuk",
    excerpt:
      "Zeytinyağı, sarımsak ve baharatlarla fırında pişirilen protein ağırlıklı ana yemek.",
    categorySlug: "ana-yemek",
    categoryTitle: "Ana Yemek",
    categoryPosition: 1,
    servingCount: 4,
    prepMinutes: 15,
    cookMinutes: 30,
    difficulty: "kolay",
    ingredients: [
      { position: 0, name: "Tavuk göğsü (çiğ, kemiksiz)", quantityDecimal: 600, unit: "g" },
      { position: 1, name: "Süzme yoğurt", quantityDecimal: 80, unit: "g", note: "marine için" },
      { position: 2, name: "Zeytinyağı", quantityDecimal: 20, unit: "ml" },
      { position: 3, name: "Sarımsak", quantityDecimal: 20, unit: "g", note: "ezilmiş, yaklaşık 4 diş" },
      { position: 4, name: "Limon suyu", quantityDecimal: 15, unit: "ml" },
      { position: 5, name: "Kekik (kuru)", quantityDecimal: 2, unit: "g" },
      { position: 6, name: "Pul biber", quantityDecimal: 2, unit: "g", note: "isteğe bağlı" },
      { position: 7, name: "Tuz", quantityDecimal: 4, unit: "g" },
      { position: 8, name: "Karabiber", quantityDecimal: 1, unit: "g" },
    ],
    steps: [
      "Fırını 190°C’ye ısıtın. Tavuk göğüslerini eşit kalınlıkta dilimleyin veya hafifçe dövün.",
      "Yoğurt, zeytinyağı, sarımsak, limon suyu, kekik, pul biber, tuz ve karabiberi karıştırıp marine sosunu hazırlayın.",
      "Tavukları sosla kaplayın; en az 10 dakika (mümkünse 30 dakika) bekletin.",
      "Fırın tepsisine dizin. 28–32 dakika veya iç sıcaklık ~74°C olana kadar pişirin.",
      "5 dakika dinlendirip dilimleyerek servis edin. Yanında salata veya sebze ile dengeleyebilirsiniz.",
    ],
    tips: [
      "Kurumasın diye pişirme sonunda 5 dakika dinlendirin.",
      "Yoğurtsuz versiyonda marine için yalnızca zeytinyağı + limon + baharat kullanın (alerjen notunu güncelleyin).",
      "Porsiyon başına yaklaşık 150 g çiğ tavuk hesabıyla ölçülmüştür.",
    ],
    allergens: ["Süt ve süt ürünleri (yoğurt)"],
    nutrientsPerServing: { kcal: 235, proteinG: 34, carbG: 2, fatG: 9 },
    nutrientSource: NUTRIENT_NOTE,
    seoTitle: "Sarımsaklı Fırında Tavuk Tarifi | Protein Ağırlıklı Ana Yemek",
    seoDescription:
      "4 porsiyon sarımsaklı fırın tavuk: gramajlı malzemeler, kolay yapılış ve tahmini porsiyon besin değerleri.",
  },
  {
    slug: "nar-eksili-kasik-salatasi",
    title: "Nar Ekşili Kaşık Salatası",
    excerpt:
      "Domates, salatalık ve taze yeşilliklerle hazırlanan, ana öğünlere eşlik edebilecek ferah salata.",
    categorySlug: "salata",
    categoryTitle: "Salata",
    categoryPosition: 2,
    servingCount: 2,
    prepMinutes: 10,
    cookMinutes: 0,
    difficulty: "çok kolay",
    ingredients: [
      { position: 0, name: "Domates", quantityDecimal: 200, unit: "g", note: "küp doğranmış" },
      { position: 1, name: "Salatalık", quantityDecimal: 200, unit: "g", note: "küp doğranmış" },
      { position: 2, name: "Marul veya roka", quantityDecimal: 60, unit: "g" },
      { position: 3, name: "Maydanoz", quantityDecimal: 20, unit: "g", note: "ince kıyılmış" },
      { position: 4, name: "Nar ekşisi", quantityDecimal: 20, unit: "ml" },
      { position: 5, name: "Zeytinyağı", quantityDecimal: 15, unit: "ml" },
      { position: 6, name: "Tuz", quantityDecimal: 2, unit: "g" },
      { position: 7, name: "Sumak", quantityDecimal: 1, unit: "g", note: "isteğe bağlı" },
    ],
    steps: [
      "Domates, salatalık ve yeşillikleri yıkayıp süzün; uygun boyutta doğrayın.",
      "Geniş bir kapta sebzeleri ve maydanozu birleştirin.",
      "Nar ekşisi, zeytinyağı, tuz ve sumağı çırpıp sos olarak ekleyin.",
      "Hafifçe karıştırıp hemen servis edin; bekletirseniz yeşillikler solar.",
    ],
    tips: [
      "Nar ekşisinin şeker oranına göre sos miktarını azaltıp artırabilirsiniz.",
      "Daha doyurucu bir öğün için 1 porsiyon yanında proteinli bir ana yemek tercih edin.",
      "Kaşık salatası kıvamı için sebzeleri küçük doğrayın.",
    ],
    allergens: ["Yok (tarifte bilinen majör alerjen yok; hazır nar ekşisi etiketini kontrol edin)"],
    nutrientsPerServing: { kcal: 95, proteinG: 2, carbG: 9, fatG: 6 },
    nutrientSource: NUTRIENT_NOTE,
    seoTitle: "Nar Ekşili Kaşık Salatası Tarifi | Hızlı Yan Salata",
    seoDescription:
      "10 dakikada nar ekşili kaşık salatası: ölçülü sebzeler, kolay sos ve porsiyon başına tahmini kalori bilgisi.",
  },
  {
    slug: "ton-balikli-sebzeli-firin-makarna",
    title: "Ton Balıklı ve Sebzeli Fırın Makarna",
    excerpt:
      "Makarna, ton balığı ve sebzeleri bir araya getiren, pratik ve doyurucu bir ana yemek.",
    categorySlug: "ana-yemek",
    categoryTitle: "Ana Yemek",
    categoryPosition: 1,
    servingCount: 3,
    prepMinutes: 15,
    cookMinutes: 20,
    difficulty: "kolay",
    ingredients: [
      { position: 0, name: "Makarna (çiğ)", quantityDecimal: 225, unit: "g", note: "penne veya fusilli" },
      { position: 1, name: "Ton balığı (suda, süzülmüş)", quantityDecimal: 160, unit: "g", note: "yaklaşık 1 kutu" },
      { position: 2, name: "Domates", quantityDecimal: 200, unit: "g", note: "küp" },
      { position: 3, name: "Yeşil veya kırmızı biber", quantityDecimal: 100, unit: "g" },
      { position: 4, name: "Soğan", quantityDecimal: 80, unit: "g" },
      { position: 5, name: "Sarımsak", quantityDecimal: 10, unit: "g" },
      { position: 6, name: "Zeytinyağı", quantityDecimal: 15, unit: "ml" },
      { position: 7, name: "Domates salçası", quantityDecimal: 15, unit: "g", note: "isteğe bağlı" },
      { position: 8, name: "Kekik", quantityDecimal: 1, unit: "g" },
      { position: 9, name: "Tuz", quantityDecimal: 3, unit: "g" },
      { position: 10, name: "Karabiber", quantityDecimal: 1, unit: "g" },
    ],
    steps: [
      "Fırını 190°C’ye ısıtın. Makarnayı paket talimatına göre 2 dakika eksik haşlayıp süzün.",
      "Tavada zeytinyağında soğan ve sarımsağı 3–4 dakika soteleyin; biber ve domatesi ekleyip 4–5 dakika pişirin.",
      "Salça, kekik, tuz ve karabiberi karıştırın. Süzülmüş ton balığını ekleyip 1 dakika karıştırın.",
      "Haşlanmış makarna ile sebze-ton karışımını harmanlayın; fırın kabına alın.",
      "Üstü kızarana kadar 12–15 dakika fırınlayın. 3 eşit porsiyona bölerek servis edin.",
    ],
    tips: [
      "Makarnayı al dente bırakın; fırında yumuşamaya devam eder.",
      "Süzme oranı düşük ton balığı seçerseniz yağ miktarı artabilir — etiketi kontrol edin.",
      "Peynir eklemeden hazırlanmıştır; eklemek isterseniz besin değerlerini güncelleyin.",
    ],
    allergens: ["Balık (ton balığı)", "Gluten (buğday makarnası)"],
    nutrientsPerServing: { kcal: 390, proteinG: 24, carbG: 52, fatG: 9 },
    nutrientSource: NUTRIENT_NOTE,
    seoTitle: "Ton Balıklı Sebzeli Fırın Makarna Tarifi | Pratik Ana Yemek",
    seoDescription:
      "3 porsiyon ton balıklı sebzeli fırın makarna: gramajlı malzemeler, adım adım tarif ve tahmini porsiyon besin değerleri.",
  },
];
