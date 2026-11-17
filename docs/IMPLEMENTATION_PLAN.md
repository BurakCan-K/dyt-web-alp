# Uygulama Planı — Diyetisyen Web Sitesi

> Kaynak: Prompt 00 keşif çıktısı. **Uygulama sırası ve görevler `prompts/01`–`11` dosyalarındadır**; bu belge keşif özeti ve kabul çerçevesidir.
> Stitch HTML/analiz yalnızca görsel referans örneğidir — faz görevlerini yeniden tanımlamaz.
> Temel referanslar: `PRD.md`, `ARCHITECTURE.md`, `STITCH_AUDIT.md`, `stitch-reference/*`

---

## 1. Stitch HTML — Bölüm ağacı, etkileşimler, kırık öğeler

| # | Bölüm / Öğe | DOM / id | Etkileşim (prototip) | Durum | Üretim kararı |
|---|---|---|---|---|---|
| 0 | Fixed Header | `<header>` | Nav linkleri, tel, CTA, profil avatar | Nav/CTA çoğunlukla `href="#"`; tel örnek | Gerçek rotalar + WhatsApp/tel; avatar kaldır veya gerçek foto |
| 1 | Ambient glow + Hero | — | CTA → `#assessment-section`, `#hizmetler` | Çalışır (anchor) | Koru; birincil CTA → WhatsApp; örnek kimlik/istatistik temizle |
| 1a | Trust badges | — | Statik | Sahte metrikler | Placeholder veya doğrulanmış metin; aksi halde nötr güven sinyalleri |
| 1b | Floating “Bu Hafta 4 Kontenjan” | — | CSS bounce | Doğrulanmamış kıtlık | Kaldır |
| 2 | Hızlı ölçüm / VKİ | `#assessment-section` | Boy/kilo → BMI; hedef kartları; yaş alanı | Yaş kullanılmıyor; hedef metinleri klinik protokol dili | VKİ teaser (boy/kilo); yaş → enerji sayfası; dil bilgilendirme seviyesine |
| 2a | “Bu Plana Göre Ön Görüşme” | `#open-appointment-trigger` | Scroll → `#appointment-modal` | Form fake | WhatsApp CTA |
| 3 | Hizmetler grid | `#hizmetler` | Kart linkleri → `#appointment-modal` | Detay sayfası yok | `/hizmetler/[slug]` + WhatsApp |
| 4 | Felsefe / yaklaşım | — | Statik | OK görsel | Koru; içerik SiteSettings/fixture |
| 5 | Danışan hikayeleri | — | Statik kartlar | Sahte yorum + sonuç iddiaları | **MVP dışı / varsayılan kapalı** |
| 6 | 4 adımlı süreç | — | Statik | OK | Koru; metin admin veya fixture |
| 7 | SSS accordion | `#faq-accordion` | Aç/kapa (tek açık) | JS çalışır; a11y eksik | DB CRUD; klavye/ARIA |
| 7b | Randevu formu | `#consultation-form`, `#appointment-modal` | `onsubmit=false` + başarı banner | **Sahte başarı** | **Kaldır**; WhatsApp/tel/mail paneli |
| 8 | Footer | — | Sosyal `#`, bülten `return false`, hukuk `#` | Kırık + fake bülten | Gerçek linkler; bülten yok; hukuk sayfaları onaylıysa |
| — | Görseller | `lh3.googleusercontent.com/aida-public/...` | — | Kalıcı değil | Cloudinary/S3 + gerçek varlıklar |
| — | Tailwind | CDN + inline config | — | Prod değil | Local Tailwind + tokenlar |
| — | Scriptler | Inline `<script>` | BMI, goal, FAQ, form | React’e taşınacak | Client components |

---

## 2. Korunacak tasarım dili

### Tipografi
- Başlık: **Playfair Display** (display / headline-lg/md; italik vurgu)
- Gövde: **Inter**
- UI / label / buton: **Plus Jakarta Sans**
- Ölçek: DESIGN.md + HTML `fontSize` tokenları (display 56/38, headline-lg 40/30, …)

### Renk (HTML token öncelikli; tek CSS değişken seti)
- Surface/bg: `#fcf9f2` ve surface-container* katmanları
- Primary: `#0d631b` / primary-container `#2e7d32`
- Secondary (CTA vurgu): `#ac3509` / container `#fe6f42`
- Tertiary / metin derinliği: `#3c5c4a` vb.
- Soft yeşil gölgeler: `rgba(27,59,43,0.06)` sınıfı; sert siyah gölge yok

### Düzen & şekil
- `max-w-7xl`, margin `3rem` / mobile `1.25rem`, cömert `space-xl` dikey ritim
- Kartlar `rounded-2xl` / `rounded-3xl`; butonlar **pill** (`rounded-full`)
- Organik görsel çerçeveler; tonal kart katmanları
- Header: blur + yarı saydam surface

### Mikro etkileşim (koru / uyarla)
- Buton hover: hafif `-translate-y` + renk doygunluğu
- FAQ accordion (erişilebilir hale getir)
- VKİ anlık güncelleme (client-only)
- Hedef seçici görsel state (klinik protokol vaadi olmadan)
- `prefers-reduced-motion` saygısı

### Responsive
- Desktop doğrulama: `screen.png`
- Breakpoints: ~360 / 768 / 1440; mobilde hero tek kolon, hizmet 1→2→4, FAQ+CTA alt alta

---

## 3. MVP kapsamı (kesin)

### Var
- Public: `/`, `/hakkimda`, `/hizmetler[+slug]`, `/blog[+slug]`, `/tarifler[+slug]`, `/beslenme-rehberleri[+slug]`, `/hesaplayicilar` (+ vki/enerji/makro), `/iletisim`, hukuk sayfaları (onaylı metin varsa)
- Admin: giriş, özet, yazılar, tarifler, hizmetler, rehberler, SSS, medya, site ayarları, hesap
- İletişim: WhatsApp (`wa.me`), `tel:`, `mailto:` — ayarlardan
- İçerik durumları: DRAFT / PUBLISHED / ARCHIVED; soft-delete; SEO alanları
- Medya: harici object storage
- Hostinger Node.js + MySQL/MariaDB + Prisma **7**

### Yok (eklenmeyecek)
- Online randevu takvimi / rezervasyon
- Ödeme
- Danışan üyeliği / portal / Lead tablosu
- Sahte “talebiniz alındı” formu
- Çalışmayan bülten aboneliği
- Varsayılan danışan yorumları / önce-sonra / doğrulanmamış başarı iddiaları
- Hesaplayıcı verisini DB/analitiğe yazma

---

## 4. Mimari özet

| Konu | Karar |
|---|---|
| App | Tek Next.js App Router (public + admin + server actions) |
| Runtime | Node.js 22, **static export yok** |
| UI | Tailwind (local), gerektiğinde shadcn/ui; Stitch tokenları |
| DB | Hostinger MySQL/MariaDB |
| ORM | Prisma **7** (Prisma 8 MariaDB yok) |
| Auth | Auth.js Credentials; tek OWNER; seed/CLI; Argon2id/bcrypt |
| Validasyon | Zod (server + client form) |
| Rich text | Tiptap + XSS allowlist sanitization |
| Medya | Cloudinary (veya S3); deploy klasörüne yazma yok |
| Hesaplayıcılar | Client-only pure functions |
| Deploy | Hostinger Web App / Node.js + GitHub |

Dizin iskeleti: `docs/ARCHITECTURE.md` ile aynı (`src/app/(public)`, `src/app/admin`, `components/{ui,site,admin,calculators}`, `lib/*`, `server/*`, `prisma/`).

---

## 5. Rota ağacı

### Public `(public)`
```
/                              Ana sayfa (Stitch port + DB bağları)
/hakkimda
/hizmetler
/hizmetler/[slug]
/blog
/blog/[slug]
/tarifler
/tarifler/[slug]
/beslenme-rehberleri
/beslenme-rehberleri/[slug]
/hesaplayicilar
/hesaplayicilar/vki
/hesaplayicilar/enerji
/hesaplayicilar/makro
/iletisim
/kvkk-aydinlatma               (onaylı metin yoksa yayınlama)
/gizlilik
/cerez-politikasi
```

### Admin
```
/admin/giris
/admin                         (protected) özet
/admin/yazilar ...
/admin/tarifler ...
/admin/hizmetler ...
/admin/rehberler ...
/admin/sss ...
/admin/medya ...
/admin/site-ayarlari ...
/admin/hesap ...
```

### Meta
- `sitemap.ts`, `robots.ts` — yalnızca PUBLISHED; admin noindex

---

## 6. Component breakdown

### Site (public)
- `Header`, `Footer`, `MobileNav`
- `Hero`, `TrustStrip` (doğrulanmış/placeholder)
- `CalculatorTeaser` (VKİ + hedef seçici, güvenli dil)
- `ServiceGrid` / `ServiceCard`
- `Approach` (felsefe)
- `ProcessSteps`
- `FaqAccordion`
- `ContactCta` / `WhatsAppButton` (form yerine)
- `PostCard`, `RecipeCard`, `GuideCard`
- `Seo` helpers / JSON-LD (ihtiyatlı)

### Calculators
- `BmiCalculator`, `EnergyCalculator`, `MacroCalculator`
- `lib/calculations/*` + unit testler

### Admin
- `AdminShell`, `DataTable`, `StatusBadge`
- `SlugField`, `SeoFields`, `MediaPicker`
- `RichTextEditor`, `SortableList`
- Formlar: Post, Recipe (+ ingredients), Service, Guide, Faq, Settings

### UI
- Button, Input, Textarea, Select, Dialog, Accordion (Stitch tokenlarına uyumlu)

---

## 7. Veritabanı şeması taslağı

| Model | Ana alanlar |
|---|---|
| `AdminUser` | email unique, passwordHash, role=OWNER, lastLoginAt |
| `SiteSettings` | singleton: brand, isim, unvan, hero, bio, phone, whatsappE164, email, address, mapUrl, openingHoursJson, sosyal, SEO, logoMediaId |
| `MediaAsset` | provider, publicId, url, alt, mime, bytes, w/h |
| `Service` | slug, title, summary, descriptionJson, imageId?, position, isFeatured, status, publishedAt, seo* |
| `PostCategory` | slug, title, position |
| `BlogPost` | slug, title, excerpt, contentJson, cover?, category?, tags/references Json, status, publishedAt, seo*, deletedAt? |
| `RecipeCategory` | slug, title |
| `Recipe` | slug, title, excerpt, instructionsJson, servings, prep/cook, nutrients Json + source, category?, cover?, status, seo* |
| `RecipeIngredient` | recipeId, position, name, quantityDecimal, unit, note? |
| `NutritionGuide` | slug, title, intro, contentJson, mealPlanJson?, cover?, status, seo* |
| `Faq` | question, answer, position, published |
| `AuditLog` | actorId, action, entityType, entityId, metadata (hassas veri yok) |

Enums: `ContentStatus = DRAFT | PUBLISHED | ARCHIVED`.

---

## 8. Güvenlik kontrol listesi

- [ ] Kayıt sayfası yok; admin yalnızca seed/CLI
- [ ] Güçlü hash; `AUTH_SECRET`; Secure / HttpOnly / SameSite cookie
- [ ] Login rate limit / kilit
- [ ] Protected layout + **her** mutation’da server session + role check
- [ ] Zod whitelist update; client `role`/`id` kör kabul yok
- [ ] CSRF (Auth.js/Next uyumu); rich-text XSS sanitization
- [ ] Upload: MIME/signature, boyut limiti, SVG kapalı, yetkili silme
- [ ] `DATABASE_URL` ve cloud secret yalnızca server env
- [ ] Draft/archived public + sitemap’te yok
- [ ] Hesaplayıcı PII backend’e gitmez
- [ ] Hata yanıtlarında stack/credential sızıntısı yok
- [ ] AuditLog’da parola yok

---

## 9. Riskler (örnek / uydurma iddialar dahil)

| Risk | Etki | Azaltma |
|---|---|---|
| “Uzman Diyetisyen Derya Kaya”, Hacettepe, 10+ yıl, 850+ danışan, 4.9/5 | Yanıltıcı kimlik | Placeholder; yayın öncesi gerçek veri |
| “Bu hafta 4 kontenjan”, ücretsiz seans vaadi | Sahte kıtlık/teşvik | Kaldır |
| Danışan yorumları + kilo/insülin sonuçları | Mevzuat / etik | MVP kapalı |
| Fake randevu formu + başarı banner | Güven kırılması | WhatsApp/tel/mail |
| Footer bülten | Çalışmayan özellik | Kaldır |
| Nişantaşı adres / örnek tel / mail | Yanlış iletişim | SiteSettings + checklist |
| Google aida-public görseller | Lisans + kalıcılık | Kalıcı storage + yetkili görseller |
| “Online görüntülü danışmanlık” kesin dil | Mevzuat | Onaysız iddia yok; genel bilgilendirme |
| KVKK “kesinlikle paylaşılmaz” kesinliği | Hukuki | Onaylı metin yoksa yayınlama |
| Prisma 8 + MariaDB | Deploy kırılması | Prisma 7 pin |
| Medya `public/` veya Hostinger build klasörü | Redeploy kaybı | Cloudinary/S3 |
| DESIGN.md vs HTML renk farkı | Görsel sapma | HTML + screen.png öncelik; tek token seti |

---

## 10. Fazlar ve tamamlanma kriterleri

| Faz | Prompt | Tamamlanma |
|---|---|---|
| 0 | Keşif (bu belge) | `IMPLEMENTATION_PLAN.md` + `DECISIONS.md`; kod yok |
| 1 | Temel kurulum | Next.js+TS+Tailwind+lint; tokenlar; boş layout; build geçer |
| 2 | Stitch anasayfa | Bileşen portu; screen.png uyumu; fake form/bülten/yorum yok; WhatsApp CTA |
| 3 | Public sayfalar | Tüm public rotalar fixture ile; responsive; gerçek linkler |
| 4 | MySQL + Prisma 7 | Schema, migrate, seed (ÖRNEK etiketli), client generate |
| 5 | Auth + admin iskelet | Giriş, korumalı layout, server-side auth, rate limit iskeleti |
| 6 | Blog / hizmet / SSS CRUD | Draft/publish, slug, SEO, revalidation |
| 7 | Tarif / rehber CRUD | Malzemeler, porsiyon, öğünler |
| 8 | Medya / ayarlar / iletişim | Cloud upload, SiteSettings, wa.me üretim |
| 9 | Hesaplayıcılar | VKİ/enerji/makro unit testleri; client-only |
| 10 | SEO / a11y / güvenlik | sitemap, robots, a11y, güvenlik tarama maddeleri |
| 11 | Test / staging / Hostinger | lint, tsc, unit, E2E, build, smoke deploy |

**Duraklatma noktaları:** (1) ana sayfa görsel onayı (2) DB şema review (3) admin E2E (4) canlı smoke.

---

## 11. Uygulama checklist

### Keşif / doküman
- [x] Referans dokümanlar okundu
- [x] Stitch bölüm/etkileşim tablosu
- [x] MVP sınırları
- [x] `IMPLEMENTATION_PLAN.md`
- [x] `DECISIONS.md`

### Kurulum & tasarım
- [ ] Next.js App Router + TS strict + Tailwind
- [ ] Design tokens (renk, tipografi, spacing, radius)
- [ ] Fontlar (Playfair, Inter, Plus Jakarta)
- [ ] Stitch ana sayfa bileşen portu
- [ ] Fake form / bülten / testimonial / kontenjan kaldırıldı
- [ ] Public sayfa iskeletleri

### Veri & admin
- [ ] Prisma 7 + MySQL schema + migrations
- [ ] Seed (ÖRNEK İÇERİK etiketi)
- [ ] Auth.js tek admin
- [ ] Admin shell + tüm CRUD modülleri
- [ ] Cloudinary/S3 medya
- [ ] SiteSettings → WhatsApp/tel/mail

### Kalite & yayın
- [ ] Hesaplayıcı unit testleri
- [ ] SEO + a11y + güvenlik maddeleri
- [ ] lint / tsc / build / E2E yeşil
- [ ] Hostinger staging smoke
- [ ] Gerçek kimlik/iletişim/hukuk metinleri production checklist’te

---

## 12. Üç kritik kontrol (Prompt 00 zorunlu özeti)

1. **Tasarım birebir hangi kısımlarda korunacak?**  
   Renk tokenları, tipografi üçlüsü, spacing/radius, header blur, hero kompozisyonu, VKİ teaser düzeni, hizmet kart grid’i, felsefe bölümü, 4 adım, SSS accordion görsel dili, pill CTA’lar ve soft yeşil gölgeler. Kaldırılacaklar: fake form, bülten, testimonial bloğu (MVP), sahte metrik/kontenjan, kırık `#` linkler.

2. **Veri ve medya kalıcılığı nasıl sağlanacak?**  
   İçerik MySQL/MariaDB + Prisma 7 migration’larında; medya Cloudinary/S3’te (`MediaAsset`); Hostinger deploy klasörüne kalıcı yazma yok; admin sonrası path/tag revalidation.

3. **Admin güvenliği nasıl sağlanacak?**  
   Tek OWNER (seed/CLI), Credentials + güçlü hash, korumalı cookie, rate limit, her server action’da session/role, Zod whitelist, XSS sanitization, güvenli upload, draft’ların public’ten gizlenmesi.
