# CURSOR PROMPT 08 — Medya yönetimi, site ayarları ve iletişim bağlantıları

Hostinger Node.js build klasörünün redeploy'da yeniden yazılabileceğini unutma. `docs/HOSTINGER_DEPLOY.md`'yi oku.

1. `MediaAsset` modeliyle Cloudinary veya S3 uyumlu object storage entegrasyonu tasarla. Env eksikse güvenli hata ver; demo sahte upload success yapma.
2. `/admin/medya`: yükle, listele, seç, alt text, boyut/süreç bilgileri, yalnızca kullanılmayan medyayı güvenli silme; uzantı/MIME/size güvenliği, id/path temizliği.
3. Blog, hizmet, tarif, site hero, logo kapak seçiciyle medya sistemine bağlansın. Remote Google aida-public demo görselleri production'da referans olmasın.
4. `/admin/site-ayarlari`: diyetisyen adı, gerçek mesleki unvan, açıklama, marka, hero, WhatsApp ülke kodlu numarası, telefon, e-posta, adres, çalışma saatleri, sosyal linkler, SEO varsayılanları. Basit ve doğrulanabilir validation.
5. Her CTA gerçek WhatsApp/tel/mailto linkine bağlı. Tüm site `SiteSettings` kaynağından beslensin. Whatsapp mesajı `encodeURIComponent` ile kodlansın; hizmet özel mesajı isteğe bağlı.
6. İletişim CTA alanı Stitch görsel dilini korusun ama web formu / randevu talebi / takvim OLMASIN.
7. İzin verilmemiş fiyat, ücretsiz görüşme ve diploması doğrulanmamış iddiaları admin kaynağında boş tut; 'verification required' yayın checklist'i ekle.
8. Değişiklik sonrası public cache yenile; yeni deployment gerekmeksizin logo, hero, telefon değişsin.
9. Admin upload API'si ve sayfa ayarı yazma işlemleri server-side requireAdmin ile korunmalı.

Kabul: Admin logo yükle → yayınla → başka tarayıcıda logo gör → redeploy sonrası görsel kaybolmasın (gerçek ortamda test); telefon değiştir → tüm butonlar doğru iletişim kanalını kullansın.
