# CURSOR PROMPT 02 — Stitch ana sayfa tasarımını React'a taşı

Kaynak: `stitch-reference/code.html`, `stitch-reference/screen.png`, `stitch-reference/DESIGN.md`, `docs/STITCH_AUDIT.md`.

Hedef: Görseldeki **tek sayfalık tasarım dilini** koruyarak sürdürülebilir, responsive React bileşenlerine ayırmak. Renk, font, kart oranları, boşluklar, hero düzeni, doğal görsel kullanımı, round-pill CTA, hizmet kartları ve SSS düzeni korunacak; yalnızca işlevsellik, mevzuat, erişilebilirlik ve tutarlılık için değişiklik yapılabilir.

Şu bölümleri oluştur:
`SiteHeader`, `Hero`, `QuickBmiWidget`, `ServicesPreview`, `ApproachSection`, `HowItWorksSteps`, `FaqPreview`, `ContactCta`, `SiteFooter`.

Aşağıdaki değişiklikler **zorunlu**:
1. Hero 'Ücretsiz Ön Görüşme Randevusu Al' yerine `WhatsApp ile İletişime Geç` olarak güncellensin. Ücretsiz hizmet vaadi doğrulanmadan kullanılmasın.
2. 'Randevu talebi gönder' formu ve hiç veri göndermeyen başarı banner'ı tamamen kaldırılıp WhatsApp/telefon/e-posta CTA oluşturulsun.
3. Sahte '4.9/5, 850+, X mezunu, 10+ yıl, bu hafta kontenjan' rozetlerini kaldır veya `not verified => hidden` davranışına geçir; yerine gerçek veri gerektirmeyen yaklaşım/iletişim anlatımı koy.
4. Danışan yorumları ve 'önce-sonra' kartlarını yayın dışı bırak; tasarımı bozmadan bilimsel yaklaşım/yayın/SSS alanıyla değiştir.
5. Demo bülten formunu kaldır; boş abonelik endpoint'i yok.
6. Google `aida-public` görsellerini geçici tasarım referansı olarak ele al; hakları verilmiş görsel yoksa tasarımı local neutral placeholder ile göster. Üçüncü taraf hotlink'e güvenme.
7. Menü linklerini gerçek sayfa rotalarına bağla; ölü `href="#"` yok.
8. Mobil menü, SSS accordion, butonlar, focus, aria-expanded, klavye erişimi, reduced motion, responsive grid doğru çalışsın.
9. `screen.png` ana sayfa masaüstü referansıdır. Benzerliği değerlendir; kritik ayrımları `docs/DESIGN_DIFF.md` içinde listele.

Şimdilik fixture data ile çalıştır; DB yok. Her bölümü test et. Faz sonunda ekran ölçümleri (360, 768, 1440) ve build sonuçlarını raporla; tasarımı faz 03'e geçmeden kararlı hale getir.
