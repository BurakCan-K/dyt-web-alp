# CURSOR PROMPT 09 — Bilimsel açıklamalı hesaplama araçları

`docs/PRD.md`'deki formülleri oku. UI'da Stitch'teki BMI sekmesini geliştir ancak tıbbi tavsiye sunma. Hesaplamalar `src/lib/calculations` altında **pure, birim testli TypeScript fonksiyonları**, formlar client components olmalı.

Araçlar:
1. `BMI`: boy cm→m; kilo kg; sonuç 1 ondalık, yetişkin sınıfları; yaş doğrudan formülde kullanılmıyor. Sınıflandırmayı tanı/ideal kilo garantisi gibi sunma.
2. `Mifflin St Jeor`: kilo, boy, yaş, formüldeki cinsiyet parametresi. Erkek `+5`, kadın `-161`. Gebelik, emzirme, 18 yaş altı ve özel durumlarda genel hesaplayıcının uygun olmadığını belirt.
3. `TDEE`: `RMR × activityFactor`; çarpan seçeneklerini açık tanımla, kaynak ve tahmini sonuç ibaresi göster.
4. `Makro`: kullanıcı toplam kcal ve % protein/% karbonhidrat/% yağ belirlesin; toplam tam %100; gram `kcal×oran/(100×4)` protein/karb, `/(100×9)` yağ.
5. `Tarif porsiyon`: ingredient quantities × hedef porsiyon / orijinal porsiyon; mutfak birimi gösteriminde 0.5 gibi ondalık girdileri koru.

Girdilerin min/max, negatif, 0, NaN, boş değer validasyonu, erişilebilir hata mesajı, keyboard/mobile input ergonomisi ve reset.
**Girdi değerleri backend'e gönderilmeyecek, veritabanına/analytics'e kaydedilmeyecek.**
Doğrulanmamış 'sana özel 8 haftalık program', 'bağırsak onarımı', 'ömür boyu başarı' gibi otomatik tavsiyeleri prototipten kaldır.

Vitest örnekleri: BMI(70,170) ≈24.22; RMR(70,170,30,erkek)=1617.5; kadın=1451.5; 2000kcal/%20-50-30 → P100g K250g Y≈66.67g; 150g iki porsiyon→225g üç porsiyon. Edge cases ekle.

Bu fazı testler başarısızsa tamamlandı olarak işaretleme.
