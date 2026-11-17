# Release Blockers — Yayın öncesi engeller

Prompt 10 çıktısı. Bunlar çözülmeden production “tamamlandı” sayılmamalı.

## Bloklayıcı (must)

1. **MySQL production + migrate deploy** — Admin CRUD ve SiteSettings canlı DB olmadan tam çalışmaz.
2. **İlk admin provisioning** — `admin:create` ile güçlü parola; demo hesap yok.
3. **AUTH_SECRET / AUTH_URL / NEXT_PUBLIC_SITE_URL** — Hostinger env doğru domain ile.
4. **Cloudinary (veya kalıcı object storage)** — Hostinger `public_html` redeploy’da silinir; logo/kapak için zorunlu.
5. **Gerçek iletişim bilgileri** — WhatsApp E.164, telefon, e-posta site ayarlarında doldurulmalı; yer tutucu CTA disable kalmamalı.
6. **KVKK / gizlilik / çerez metinleri** — Hukuk onayı olmadan gerçek metin uydurulmadı; onay sonrası içerik + noindex kaldırma.
7. **Kimlik / unvan / diploma iddiaları** — Doğrulanmadan yayınlanmamalı (PublishChecklist).
8. **Fiyat, ücretsiz görüşme, sonuç garantisi, hasta yorumu, önce/sonra** — Bilinçli olarak yok; eklenmemeli.

## Yüksek öncelik (should)

9. Staging smoke: login, yayın, medya yükle → redeploy → görsel duruyor.
10. Lighthouse (mobil/desktop) + 360/768/1440 görsel kontrol.
11. CSP sıkılaştırma (nonce) — şu an Next uyumu için unsafe-inline.
12. Türkiye sağlık tanıtım mevzuatı hukuk incelemesi (tanıtım iddiaları).

## Bilinçli olarak kapsam dışı
- Randevu takvimi, ödeme, lead formu, bülten
- Analytics / tracking script
- Otomatik “8 haftalık program” / “bağırsak onarımı” üretimi

## Prompt 11’e devir
Hostinger deploy, E2E, staging checklist: `prompts/11_test_staging_hostinger.md`
