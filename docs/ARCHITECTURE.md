# Önerilen Teknik Mimari

## Uygulama kararı
- Tek repo, tek Next.js App Router uygulaması. API/Server Actions, public site ve admin aynı deployment'ta.
- Node.js 22 LTS, TypeScript strict, Tailwind CSS, gerektiğinde shadcn/ui, Zod.
- Hostinger Business managed Node.js server; `output: 'export'` kullanılmaz, server-side auth/DB aktif.
- MySQL/MariaDB `DATABASE_URL`, Prisma **v7** (`prisma` ve `@prisma/client` aynı major) kullan. Prisma 8 MySQL/MariaDB desteği yayımlanmış sürüme göre farklı: MariaDB için stable Prisma 7.
- Prisma 7 kurulum / driver adapter / `prisma.config.ts` dokümanları doğrulanmalı; eski Prisma 5/6 kurulum kodlarını kopyalama.

## Dosya dizini önerisi
```text
src/
  app/
    (public)/
      page.tsx
      hakkimda/page.tsx
      hizmetler/page.tsx
      hizmetler/[slug]/page.tsx
      blog/page.tsx
      blog/[slug]/page.tsx
      tarifler/page.tsx
      tarifler/[slug]/page.tsx
      beslenme-rehberleri/page.tsx
      beslenme-rehberleri/[slug]/page.tsx
      hesaplayicilar/page.tsx
      hesaplayicilar/vki/page.tsx
      hesaplayicilar/enerji/page.tsx
      hesaplayicilar/makro/page.tsx
      iletisim/page.tsx
    admin/
      giris/page.tsx
      (protected)/
        layout.tsx
        page.tsx
        yazilar/...
        tarifler/...
        hizmetler/...
        rehberler/...
        sss/...
        medya/...
        site-ayarlari/...
        hesap/...
    api/...
    layout.tsx
    sitemap.ts
    robots.ts
  components/
    ui/ site/ admin/ calculators/
  lib/
    auth/ db/ validators/ calculations/ media/ seo/ whatsapp/
  server/
    actions/ services/ repositories/
prisma/
  schema.prisma
  migrations/
  seed.ts
public/
  assets/  # yalnızca SÜRÜM İLE gelen değişmez görseller
stitch-reference/
  code.html screen.png DESIGN.md
.cursor/rules/project.mdc
```

## Veri modeli (öneri)
- `AdminUser`: id, email(unique), passwordHash, role=`OWNER`, lastLoginAt, createdAt.
- `SiteSettings`: id(singleton), brandName, dietitianName, professionalTitle, heroTitle, heroSubtitle, biography, phone, whatsappE164, email, address, mapUrl, openingHoursJson, instagramUrl, metaTitle, metaDescription, logoMediaId.
- `Service`: id, slug(unique), title, summary, descriptionJson, imageId?, position, isFeatured, status, publishedAt, seoTitle?, seoDescription?, createdAt, updatedAt.
- `PostCategory`: id, slug, title, position.
- `BlogPost`: id, slug(unique), title, excerpt, contentJson, coverMediaId?, categoryId?, tagsJson?, referencesJson?, status, publishedAt, seo*, createdAt, updatedAt, deletedAt?.
- `RecipeCategory`: id, slug, title.
- `Recipe`: id, slug, title, excerpt, instructionsJson, servingCount, prepMinutes, cookMinutes, nutrientsPerServingJson?, nutrientSource?, categoryId?, coverMediaId?, status, publishedAt, seo*, createdAt, updatedAt.
- `RecipeIngredient`: id, recipeId, position, name, quantityDecimal, unit, note?, nutritionRefId? (MVP'de besin değerini otomatik hesaplamak zorunda değil).
- `NutritionGuide`: id, slug, title, intro, contentJson, mealPlanJson?, coverMediaId?, status, publishedAt, seo*, createdAt, updatedAt.
- `Faq`: id, question, answerJson/text, position, published.
- `MediaAsset`: id, provider, providerPublicId, url, alt, mimeType, bytes, width, height, createdAt.
- `AuditLog`: id, actorId, action, entityType, entityId, createdAt, minimal güvenli metadata (asla parola/hassas veri içermez).

Sadeleştirme serbest; ancak silinen içerik türlerini JSON içerisine kontrolsüz gömmek yerine karar gerekçesini `docs/DECISIONS.md` içinde belgele.

## Kimlik doğrulama
- Tek admin için kayıt sayfası yok. Admin `seed/CLI` ile üretilir. İlk şifre yalnızca güvenli ortam değişkeninden alınır, varsayılan demo parolası olmaz.
- Auth.js `Credentials` veya eşdeğer bakımı yapılan auth framework; parola hash'i Argon2id/bcrypt, cookie `Secure`, `HttpOnly`, `SameSite`, hesap kilidi / deneme oran limiti.
- Protected layout UX kontrolüdür; tüm server actions ve yazma API'larında **ayrı server-side session + role check** olmalı.
- Client tarafından gelen `role`, `id`, `publishedAt` vb. değerler körü körüne kabul edilmemeli; Zod ile doğrula, whitelist update.
- CSRF koruması ve XSS sanitizasyonu; editor çıktısı HTML olarak sunulacaksa güvenli allowlist.

## Medya
- Admin tarafından yüklenen görseller `public/`, `.next`, `hbuilds/current` ya da `public_html` içine kalıcı olarak kaydedilmez; Hostinger deployment bunları değiştirebilir.
- Tercihen Cloudinary ya da S3 uyumlu nesne depolama. Dosyalar sunucu tarafında imzalanmış/sınırlandırılmış yüklemeyle saklanır.
- JPEG/PNG/WebP/AVIF allowlist, MIME/signature doğrulama, maks boyut, boyut/ağırlık optimizasyonu, SVG upload varsayılan kapalı, rastgele public ID, yetkili silme.
- Veritabanına dosyanın `secure_url`, `publicId`, boyut, MIME ve alt metni yazılır.

## İçerik doğrulama ve cache
- Public içeriği Server Components ile DB'den oku.
- Yalnızca PUBLISHED içerikleri ve tarihi gelmiş olanları göster.
- Admin CRUD sonrasında path/tag revalidation; gerekirse basit dynamic rendering ile ilk sürümde tutarlı görünürlük.
- Seed yalnızca kurgusal 'ÖRNEK İÇERİK — YAYIN ÖNCESİ DEĞİŞTİR' etiketiyle; gerçekte yayınlanacak sahte onay/sahte sayılar yok.

## Dış bağlantılar
- Admin panelinden gelen `phone`, `whatsapp` değerlerini doğrula.
- WhatsApp URL oluşturucusu `https://wa.me/${e164digits}?text=${encodeURIComponent(message)}`.
- `mailto:` ve `tel:` linklerini sadece gerekli karakterlerle oluştur.

## Karar dışı
- Danışan kaydı, tıbbi anamnez, randevu takvimi, ödeme, API token ile kişisel sağlık dosyası paylaşımı, bülten kaydı ve hasta yorumları MVP kapsamı dışı.
