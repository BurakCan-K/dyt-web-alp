# CURSOR PROMPT 06 — Admin blog, hizmet ve SSS CRUD + public entegrasyonu

`docs/PRD.md`, mevcut Prisma modelleri, auth ve design system'i kontrol et. Mevcut soyutlama ve bileşenleri yeniden kullan.

Yapılacaklar:
1. `/admin/yazilar`: liste, durum filtresi, arama, oluşturma, düzenleme, önizleme, taslak/yayın, arşivle/soft delete; zod validation; category, slug, SEO, kapak görseli (faz 08'e kadar URL/placeholders olabilir).
2. Editör: Tiptap gibi güvenli WYSIWYG. Kalıcı JSON belge formatı; render ederken izinli elementlerle sanitize; html/script injection engelle.
3. `/admin/hizmetler`: CRUD + sıra + featured + yayın durumu; public hizmet listesi/detayı DB'den gelsin.
4. `/admin/sss`: soru/yanıt CRUD, sıralama, yayın; public FAQ akordiyonu DB'den gelsin.
5. Public `/blog` ve `/blog/[slug]` DB verileriyle çalışsın. Yalnızca PUBLISHED ve publishedAt zamanı geçmiş olan içerikler yayınlansın; public taslak sızıntısı yok.
6. Başarılı değişiklik sonrası ilgili sayfa/cache yeniden doğrulansın; admin yeni yazıyı yazıp yayınladığında site build etmeden görünmeli.
7. 404, boş liste, load/error/success durumları. Yanlış validasyonlarda sahte başarı mesajı verme.
8. AuditLog'a ekleme/güncelleme/yayın/silme işlemleri minimal kaydedilsin.
9. Unit/service testleri ve admin yetki testleri yaz.

Kabul: Admin giriş → yazı oluştur → taslak halinde public yok → yayınla → public list/detay görün → taslağa geri al → public kaybol. Her aşamayı test et.
