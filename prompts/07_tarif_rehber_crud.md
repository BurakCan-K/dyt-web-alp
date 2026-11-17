# CURSOR PROMPT 07 — Tarifler ve Örnek Beslenme Rehberleri CRUD

Mevcut CRUD pattern, Prisma modelleri, auth ve görsel sistemi ile uyumlu ilerle.

Tarif modülü:
- `/admin/tarifler`: başlık, slug, kategori, açıklama, kapak, porsiyon sayısı, hazırlık/pişirme süresi, sıralı malzemeler (miktar, birim, not), sıralı adımlar, kaynak, yayın/SEO alanları.
- Malzeme için tamsayı zorunluluğu olmasın (örn. `0.5`, `125.5`); decimal miktar, ölçü birimi yönetimi ve yuvarlama kuralı.
- `kalori, protein, karbonhidrat, yağ` manuel/doğrulanmış veri varsa girilebilir. Besin değeri tabanı olmadan 'otomatik doğru kalori' üretme.
- Tarifi yayınla → `/tarifler/[slug]` görünür; listede kategori filtre, detayda porsiyon ölçekleme ve yazdırma.
- Porsiyon değişimi yalnızca görüntüde hesaplanır, DB'ye kullanıcı verisi kaydetmez.

Rehber modülü:
- `/admin/rehberler`: genel beslenme rehberi CRUD, gün/öğün hiyerarşisi ve ilgili tarifleri bağlama.
- Rehber metinleri tıbbi tavsiye gibi sunulmaz; bilgilendirme uyarısı ve kaynak alanı bulunur.
- Public `/beslenme-rehberleri` liste/detay ile bağlantı.

Her iki modülde auth, Zod, cache invalidation, SEO, draft/published, audit trail, empty/error/loading durumları. Unit + E2E testleri yaz; gerçek olmayan besin bilgisi üretilmediğini doğrula.
