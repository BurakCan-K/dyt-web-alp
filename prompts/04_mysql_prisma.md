# CURSOR PROMPT 04 — MySQL/MariaDB veritabanı ve Prisma 7 şeması

`docs/ARCHITECTURE.md`, `docs/PRD.md` oku. Veritabanı ve ORM'nin **kullanıcının Hostinger Business ortamıyla** uyumlu olmasına dikkat et.

1. Prisma ORM **7.x** ve uyumlu `@prisma/client` sürümlerini **major pinle**. Prisma 8 MariaDB desteği stable değil. Uyumlu driver adapter gerekiyorsa Prisma 7 resmi dokümanına göre ayarla.
2. `datasource db { provider = "mysql" }`, Prisma 7 güncel `prisma.config.ts` ve Node runtime adapter bağlantısını düzgün kur. `DATABASE_URL` sadece server env.
3. `AdminUser`, `SiteSettings`, `Service`, `PostCategory`, `BlogPost`, `RecipeCategory`, `Recipe`, `RecipeIngredient`, `NutritionGuide`, `Faq`, `MediaAsset`, `AuditLog` modellerini PRD'de belirtilen asgari alanlarla oluştur. Durumları `DRAFT/PUBLISHED/ARCHIVED`, `slug` unique, tarih alanları, ilişkiler ve doğru index'lerle tasarla.
4. `nutrition` değerlerinin tahmini olduğu metadatasını tut; otomatik bilimsel içerik üretme.
5. Şema ve migration dosyalarını oluştur; geliştirme DB bağlantısı **yoksa** production'a bağlanmaya çalışma. Bunun yerine gerekli komutları ve `.env.example` örneklerini hazırla, bağlantı gelene kadar migration çalıştırılmadı diye raporla.
6. DB varsa `prisma migrate dev`, `prisma generate`, seed çalıştır; production DB'ye `migrate dev` uygulama.
7. `src/lib/db` singleton, repository layer, zod schema, transaction sınırları kur.
8. Seed yalnızca yerel geliştirme için güvenli örnek veriler oluştursun; admin hesabı **bilinen/demo parola** ile otomatik oluşturulmasın.
9. Model kararlarını `docs/DATA_MODEL.md`, migration prosedürünü `docs/MIGRATIONS.md` dosyalarında belgele.

Kabul: DB varsa migration ve CRUD testleri geçer; DB yoksa şema validation, generation ve typecheck ilerler ve engel net raporlanır. Admin UI henüz yazma.
