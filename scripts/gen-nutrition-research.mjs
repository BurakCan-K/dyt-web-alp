import fs from "node:fs";
import path from "node:path";

const dir = "docs/nutrition-tools/research";
fs.mkdirSync(dir, { recursive: true });

const tools = [
  ["A01", "vki", "VKİ (BMI)", "BMI = kg/m²", "WHO yetişkin sınıfları", "Yetişkin bilgilendirme; çocuk/gebelikte kullanma"],
  ["A02", "bel-boy-orani", "Bel/Boy Oranı (WHtR)", "WHtR = bel/boy", "NICE rehber eşikleri", "Yetişkin; doğru bel ölçümü"],
  ["A03", "bel-kalca-orani", "Bel/Kalça Oranı (WHR)", "WHR = bel/kalça", "WHO bel çevresi bağlamı", "Cinsiyet eşikleri popülasyona göre değişir"],
  ["A04", "referans-agirlik", "Boya Göre Referans Ağırlık", "BMI 18.5–24.9 → kg aralığı", "WHO BMI", "Tek ideal kilo yok; aralık göster"],
  ["A05", "agirlik-degisim", "Ağırlık Değişim Yüzdesi", "(güncel-başlangıç)/başlangıç×100", "Klinik pratik", "İstemsiz kayıp için klinik uyarı"],
  ["A06", "vucut-kompozisyonu", "Vücut Kompozisyonu", "FM/FFM/FFMI; ölçülen ≠ tahmin", "Çeşitli modeller", "Ölçümsüz gerçek yağ % iddiası yok"],
  ["B01", "rmr", "Bazal/Dinlenme Metabolizma", "Mifflin–St Jeor", "Mifflin 1990", "BMR≠RMR; 18+"],
  ["B02", "tdee", "TDEE", "RMR×PAL", "Yaygın PAL tablosu", "Çift sayım yok; tahmin"],
  ["B03", "hedef-kilo-planlayici", "Hedef Kilo Planlayıcı", "NIH BWP veya sınırlı yardımcı", "NIDDK", "Doğrusal 7700 kcal kuralı tek başına yok"],
  ["B04", "makro", "Makro Dağılımı", "4/4/9 kcal/g", "Atwater", "% toplam 100"],
  ["B05", "protein-ihtiyaci", "Protein İhtiyacı", "g/kg×ağırlık", "NASEM/EFSA", "Klinik özel durumda otomatik yüksek hedef yok"],
  ["B06", "su-referansi", "Su/Sıvı Referansı", "EFSA AI + bağlam", "EFSA", "Sadece kg×mL kesin değil"],
  ["B07", "lif-referansi", "Lif Referansı", "g/gün", "EFSA/NASEM", "Yaş/enerji bağlamı"],
  ["B08", "dri-referans", "Vitamin/Mineral DRI", "RDA/AI/UL tabloları", "NASEM DRI", "Takviye dozu değil"],
  ["C01", "tarif-besin-degeri", "Tarif Besin Değeri", "Σ(gıda×g)/porsiyon", "USDA FDC alt küme", "Çiğ/pişmiş farkı notu"],
  ["C02", "porsiyon", "Porsiyon Ölçekleme", "qty×(hedef/baz)", "—", "Baharat/süre doğrusal olmayabilir"],
  ["C03", "besin-arama", "Besin Arama", "100g / porsiyon", "Statik FDC alt küme", "API anahtarı frontendde yok"],
  ["C04", "besin-etiketi", "Besin Etiketi", "kcal↔kJ; 100g↔porsiyon", "Etiket matematiği", "Eksik alan uydurma yok"],
  ["C05", "karbonhidrat-sayimi", "Karbonhidrat Sayımı", "Σ CHO g", "ADA eğitim bağlamı", "İnsülin dozu YOK"],
  ["C06", "glisemik-yuk", "Glisemik Yük", "GL=(GI×availCHO)/100", "ISO GI", "Bilinmeyen GI tahmin edilmez"],
  ["C07", "sodyum-tuz", "Sodyum/Tuz", "tuz(g)≈Na(g)×2.5", "Yaygın dönüşüm", "mg/g birimleri"],
  ["C08", "tabak-planlama", "Tabak / Değişim", "Bilgilendirme şablonu", "MyPlate vb.", "Tedavi planı değil"],
  ["D01", "cocuk-bmi", "Çocuk BMI Persentil", "LMS z/persentil", "WHO/CDC", "Yetişkin BMI yok; LMS yoksa Blocked"],
  ["D02", "gebelik-kilo", "Gebelik Ağırlık Kazanımı", "IOM bantları", "IOM/ACOG", "Gebelikte zayıflama önerisi yok"],
  ["D03", "must", "MUST", "—", "BAPEN", "BLOCKED — izin yok"],
  ["D04", "nrs-2002", "NRS-2002", "Eğitimsel checklist", "ESPEN/Kondrup", "Otomatik tanı yok"],
  ["D05", "mna-sf", "MNA-SF", "—", "MNA telif", "BLOCKED"],
  ["D06", "glim", "GLIM Destek", "Fenotip/etyoloji checklist", "GLIM konsensüs", "Karar desteği; tanı değil"],
];

for (const [id, slug, name, formula, source, limit] of tools) {
  const body = `# ${id} — ${name}

## Amaç
${name} bilgilendirme aracı.

## Formül / yöntem
${formula}

## Kaynak
${source}

## Girdiler / birimler
Araç sayfasında ve şemada tanımlanır (SI birimleri tercih).

## Geçerlilik ve sınırlar
${limit}

## Örnek
Unit test vektörleri: \`src/lib/calculations/\`.

## UI
\`docs/nutrition-tools/UI_UX_PLAN.md\`.

## Tıbbi uyarı
Teşhis/tedavi değildir. Uygun olmayan kitlelerde gate uygulanır.
`;
  fs.writeFileSync(path.join(dir, `${id}-${slug}.md`), body, "utf8");
}
console.log("wrote", tools.length);
