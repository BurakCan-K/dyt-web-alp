# CURSOR PROMPT 10 — SEO, performans, erişilebilirlik, uyum ve güvenlik hardening

`docs/PRD.md`, `docs/TEST_CHECKLIST.md` ve Türkiye sağlık tanıtım mevzuatı risklerini gözden geçir.

1. `generateMetadata`, canonical, Open Graph, robots, sitemap: yalnızca public PUBLISHED içerik; admin ve taslak sayfalar noindex. Türkçe slug ve meta açıklamaları; gerekiyorsa Article/Recipe JSON-LD yalnızca gerçek verilere dayalı.
2. Görseller için `alt`, responsive `sizes`, lazy loading, boyut alanları, LCP hero optimizasyonu; `next/image` uzak kaynak izinleri kalıcı media provider'a göre.
3. Header/mobile menu/FAQ/rich text için klavye/focus/ARIA; WCAG AA hedefi; reduced-motion ve renk kontrastı.
4. Tüm linkleri tarayıp `href="#"`, sahte iletişim, kırık rotaları ve dead end butonları kaldır.
5. HTML rich-text XSS, SQL injection (ORM), route authorization, cookies, file upload, stored XSS, rate limiting, error handling, security headers, log hygiene için güvenlik denetimi yap. İdeal olarak otomatik test ekle.
6. Doğrulanmamış hasta memnuniyeti, hasta yorumları, önce/sonra görselleri, uzmanlık/mezuniyet, sonuç vaadi, ücretsiz görüşme/indirim iddialarını kaldır veya gerçek bilgiler ile mevzuat incelemesi olmadan yayına kapat.
7. KVKK/gizlilik/çerez sayfalarına 'örnek gerçek metin' uydurma; gerekli hukuk onayı bekleyen alanları yayın öncesi eksik listesinde belirt. Kullanılmayan takip scripti/bülten formu ekleme.
8. İletişim için WhatsApp dış sağlayıcı linkinin kullanıcı tarafından açıldığını açık göster; içerde 'randevu oluşturuldu' uydurma.
9. Lighthouse'a hazırlan; HTML meta ve içerik SSR; 360/768/1440 px kontrol et.

Çıktı: `docs/SECURITY_REVIEW.md`, `docs/SEO_REVIEW.md`, `docs/RELEASE_BLOCKERS.md`, çalıştırılan komutlar ve gerçek test sonuçları.
