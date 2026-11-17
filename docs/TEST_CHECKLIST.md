# Test & Kabul Kontrol Listesi

## Güvenlik
- [ ] `/admin` ve tüm alt yollar anonim kullanıcı için kapalı.
- [ ] Anonim / expired session ile CRUD, upload, ayarlar API/server action işlemleri reddediliyor.
- [ ] Şifre yanlış / brute force sınırı; başarılı çıkış sonrası oturum iptal.
- [ ] CSRF, Stored XSS (blog editörüne script/iframe), IDOR, yetkisiz upload, 10MB+ upload denemeleri.
- [ ] Stack trace, DB credential, upload API secret response/loglarda yok.

## CRUD
- [ ] Blog draft→published→draft→deleted, kategori/slug/SEO/cover doğru.
- [ ] Tarif ingredient/step/serving düzenle ve yeniden açınca veriler aynı.
- [ ] Hizmet kartı sırası ve öne çıkarma çalışıyor.
- [ ] Site ayarlarındaki telefon/WhatsApp değişimi tüm butonlarda güncel.
- [ ] SSS aç/kapat, klavye etkileşimi, sıralama ve yayın kontrolü.
- [ ] 404/boş liste görünümleri; failed API ve validation mesajları.

## Matematiksel hesaplama
- [ ] VKİ 70kg, 170cm → ~24.22; sıfır boy reddedilir.
- [ ] RMR 70kg, 170cm, 30 yaş, erkek → 1617.5 kcal; kadın → 1451.5 kcal.
- [ ] TDEE uygun enerji çarpanı sonucu; çarpan listesi dokümanla eşleşir.
- [ ] 2000kcal, %20 P/%50 K/%30 Y → 100g P, 250g K, 66.67g Y.
- [ ] Yüzdeler toplamı 100 değilse hata.
- [ ] 2 porsiyon 150g malzeme → 3 porsiyon 225g.
- [ ] Hesaplama girişleri backend'e gönderilmiyor.

## UI/UX & SEO
- [ ] 360/390/768/1024/1440 ekranlarda yatay taşma yok; butonlar parmakla kullanılabilir.
- [ ] Header menüsü, FAQ, linkler, tüm CTA'lar işlevli.
- [ ] `screen.png` ile desktop layout karşılaştırması; sapmalar belgeli.
- [ ] Alt metin, etiket, görünür focus, skip-to-content, kontrast, motion preferences.
- [ ] Blog/tarif SSR, meta/OG, sitemap, robots, canonical; admin/draft noindex.
- [ ] İletişim numarası gerçek ve onaylı; örnek 'Derya Kaya' bilgisi kaldırıldı.
- [ ] Sahte yorum/istatistik/ücretsiz seans/sonuç vaadi bulunmuyor.
- [ ] KVKK, gizlilik, çerez metinleri onaylandı; gerçek dışı çerez consent banner'ı yok.

## Hosting
- [ ] Build, deploy, login, migration, DB connection, public yayın, medya yükleme tamam.
- [ ] Redeploy sonrası admin yüklediği medya korunuyor.
- [ ] DB ve medya yedekleme/geri dönme işlemi belgeli.
