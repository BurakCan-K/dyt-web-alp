# Teknik ve Ürün Kararları (ADR özeti)

Bu dosya Prompt 00 keşfinde sabitlenen varsayımları belgeler. Onay beklenmeyen konular dokümandaki varsayımlarla ilerler; yalnızca üç kritik kontrol (tasarım / kalıcılık / admin güvenliği) raporlanır.

---

## D-01 — Tek Next.js uygulaması
**Karar:** Public site, admin ve Server Actions aynı App Router deployment’ında.  
**Gerekçe:** Hostinger tek Node process; operasyonel sadelik.  
**Sonuç:** `output: 'export'` yok; Node 22 server mode.

## D-02 — Prisma ORM v7 (MariaDB)
**Karar:** `prisma` ve `@prisma/client` major 7’de pinlenir. Prisma 8 kullanılmaz.  
**Gerekçe:** Prisma 8’de MariaDB stable desteği yok; Hostinger MySQL/MariaDB.  
**Sonuç:** `prisma.config.ts` / driver adapter Prisma 7 dokümanına göre; eski v5/v6 kopyalanmaz.

## D-03 — Stitch görsel öncelik sırası
**Karar:** (1) `screen.png` + `code.html` gerçek renk/ölçü (2) `DESIGN.md` semantik dil.  
**Gerekçe:** DESIGN.md ile HTML tokenları birebir değil.  
**Sonuç:** Tek CSS değişken / Tailwind tema seti; CDN Tailwind production’a taşınmaz.

## D-04 — Ana sayfa iletişim CTA
**Karar:** `#consultation-form` ve başarı banner kaldırılır; birincil CTA WhatsApp (`wa.me` + sabit mesaj), yedek `tel:` / `mailto:`.  
**Gerekçe:** PRD; sahte “talebiniz alındı” yasak.  
**Sonuç:** ContactCta bileşeni; Lead tablosu yok.

## D-05 — Bülten ve testimonial
**Karar:** Footer bülten formu yok. Danışan yorumları / başarı hikayeleri bölümü MVP’de varsayılan kapalı.  
**Gerekçe:** Abonelik altyapısı yok; doğrulanmamış sonuç iddiaları mevzuat riski.  
**Sonuç:** İleride ayrı onay + gerçek içerikle açılabilir; şema zorunlu değil.

## D-06 — Örnek kimlik ve metrikler
**Karar:** “Derya Kaya”, Hacettepe, 850+ danışan, 4.9/5, kontenjan, örnek Nişantaşı iletişim yayın verisi sayılmaz.  
**Gerekçe:** STITCH_AUDIT + sağlık tanıtım riski.  
**Sonuç:** Seed/fixture `ÖRNEK İÇERİK — YAYIN ÖNCESİ DEĞİŞTİR`; production checklist zorunlu.

## D-07 — Medya depolama
**Karar:** Cloudinary (tercih) veya S3 uyumlu storage; `public/` ve Hostinger `hbuilds`/`public_html` kalıcı upload hedefi değil.  
**Gerekçe:** Redeploy içeriği siler.  
**Sonuç:** `MediaAsset` satırı + sunucu tarafı imzalı/sınırlı upload.

## D-08 — Auth modeli
**Karar:** Auth.js Credentials; tek `OWNER`; public kayıt yok; admin seed/CLI + env ile ilk parola.  
**Gerekçe:** Tek diyetisyen operatörü.  
**Sonuç:** UI gizleme yeterli değil; her yazma yolunda server session + role.

## D-09 — İçerik durumu ve silme
**Karar:** DRAFT | PUBLISHED | ARCHIVED; soft-delete (`deletedAt`) tercih; public ve sitemap yalnız PUBLISHED (+ publishedAt ≤ now).  
**Gerekçe:** Yanlış silme kurtarma; SEO sızıntısı önleme.

## D-10 — Rich text
**Karar:** Tiptap (veya eşdeğer) + sunucu/client sanitization allowlist. Ham HTML kör render yok.  
**Gerekçe:** Stored XSS riski (blog/tarif/hizmet).

## D-11 — Hesaplayıcılar
**Karar:** Tüm hesaplar client-side; PII DB/analitiğe yazılmaz. Ana sayfa teaser = VKİ (boy/kilo); yaş alanı enerji aracına. Hedef seçici bilgilendirme metni; klinik protokol/reçete dili yok.  
**Gerekçe:** PRD hesaplayıcı güvenliği + STITCH_AUDIT.

## D-12 — Navigasyon bilgi mimarisi
**Karar:** Stitch’teki “Başarı Hikayeleri” / “Randevu Takvimi” menü öğeleri kaldırılır veya güvenli eşdeğerlere map edilir: Hakkımda, Hizmetler, Tarifler/Blog/Rehberler, Hesaplayıcılar, İletişim.  
**Gerekçe:** MVP kapsamı; kırık `#` link yasağı.

## D-13 — Hukuk sayfaları
**Karar:** KVKK / gizlilik / çerez yalnızca onaylı metinle production’da. Yoksa route placeholder veya noindex + yayına alma engeli.  
**Gerekçe:** Kesin KVKK iddiaları hukuki risk.

## D-14 — shadcn/ui
**Karar:** Admin ve form primitives için shadcn kullanılabilir; public hero/kartlar Stitch’e özel bileşen kalır.  
**Gerekçe:** Hız vs görsel sadakat dengesi.

## D-15 — Cache / revalidation
**Karar:** Public Server Components + CRUD sonrası `revalidatePath` / tag; ilk sürümde agresif ISR karmaşıklığı yok.  
**Gerekçe:** Admin değişikliğinin deploy’suz görünmesi.

## D-16 — Repo yerleşimi
**Karar:** Uygulama kodu paket kökünde (`diyetisyen_cursor_gelistirme_paketi/` veya repo root’a taşındığında orada) gelişir; `stitch-reference/` production deploy artifact’ı değildir, referans olarak kalır.  
**Not:** Şu an GitHub `dyt-web` kökünde yalnızca paket zip/klasör var; Prompt 01’de Next.js iskeleti paket köküne veya kullanıcı tercih ettiği root’a kurulacak.

## D-17 — Test stratejisi
**Karar:** Vitest (hesaplama + slug/validation), Testing Library (kritik UI), Playwright (admin giriş + publish smoke). “Test geçti” yalnızca gerçekten koşturulunca.  
**Gerekçe:** project.mdc.

## D-18 — Kapsam dışı netleştirme
**Karar:** Randevu takvimi, ödeme, danışan portalı, teşhis/tedavi vaadi, garanti dili, otomatik kişisel diyet reçetesi yok.  
**Gerekçe:** PRD / README sınırları.

## D-19 — Prisma 7 + MariaDB adapter
**Karar:** `prisma@7` + `@prisma/client@7` + `@prisma/adapter-mariadb`; client çıktısı `src/generated/prisma`.  
**Gerekçe:** Prisma 8 MariaDB stable değil; Hostinger MySQL/MariaDB.  
**Sonuç:** CLI URL `prisma.config.ts`; runtime ayrı host/user/password/database env.

## D-20 — Seed admin parolası yok
**Karar:** `prisma/seed.ts` AdminUser oluşturmaz; demo/bilinen parola yok.  
**Gerekçe:** Güvenlik; admin Prompt 05’te güvenli provisioning.

## D-21 — Auth.js Credentials + bcrypt
**Karar:** `next-auth@5` (beta) Credentials, JWT oturum (8s), bcryptjs cost 12, bellek içi login rate limit.  
**Gerekçe:** Tek OWNER; Hostinger’da Redis yok.  
**Sonuç:** `requireAdmin()` tüm mutation’larda; middleware `/admin` korur; `npm run admin:create` ile provisioning.
