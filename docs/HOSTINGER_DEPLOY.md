# Hostinger canlıya alma planı — dyt-web

Bu belge, **alan adı + Hostinger Kurumsal (Business / Unlimited / Sınırsız) Web Hosting** ile bu projenin nasıl yayına alınacağını özetler. Gerçek DNS/deploy işlemi kullanıcı onayı olmadan yapılmaz.

Son araştırma tarihi: 2026-11-17  
Kaynaklar: [Hostinger Next.js](https://docs.hostinger.com/node.js/overview-1/next), [Node.js plan limitleri](https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/), [Prisma on Hostinger](https://www.hostinger.com/support/how-to-deploy-prisma-apps-on-hostinger-node-js-hosting/), `docs/RELEASE_BLOCKERS.md`

---

## 1. Proje ihtiyaçları (özet)

| İhtiyaç | Bu proje | Hostinger Business/Unlimited |
| --- | --- | --- |
| Runtime | Next.js 15 App Router (SSR, Server Actions, Auth) | Node.js Web App + `standalone` (Hostinger otomatik) |
| Node | `>=22` (`package.json` engines) | 18 / 20 / 22 / 24 destekli → **22 LTS seç** |
| Veritabanı | MySQL/MariaDB + Prisma 7 (`@prisma/adapter-mariadb`) | hPanel MySQL; host genelde `127.0.0.1` |
| Medya | Cloudinary (kalıcı) | Uygun; dosyaları `public_html`’e yazma |
| Auth | Auth.js (`AUTH_SECRET`, `AUTH_URL`) | Env değişkenleri ile |
| E-posta / randevu / ödeme | Yok | Gerekmez |
| WebSocket / Redis / Docker | Yok | Desteklenmiyor — sorun değil |
| Build bellek | Orta boy Next + Prisma | Business ~3 GB RAM; bu site için genelde yeter |

**Sonuç:** Plan gerçekten **Business / Unlimited (TR: Sınırsız / Kurumsal üst paket)** ve hPanel’de **Web App / Node.js** açıksa, bu proje Hostinger’da **doğrudan** canlıya alınabilir. VPS şart değil.

---

## 2. Kritik uyumluluk kontrolü (şimdi yap)

hPanel → **Hosting → Plan / Kaynaklar** ekranında şunu doğrula:

1. Plan adı **Business**, **Unlimited** veya TR’de **Sınırsız** mı?
2. **Websites → Create site → Web App (Node.js)** seçeneği görünüyor mu?

| Durum | Ne yapmalı |
| --- | --- |
| Web App / Node.js var | Aşağıdaki “Önerilen yol” ile devam |
| Sadece WordPress / PHP / static | Plan **Business/Unlimited**’a yükselt; Premium/Starter Node.js Web App vermez |
| Çok yüksek trafik / özel worker ileride | Sonra Cloud Startup veya VPS düşün; MVP için erken |

> Not: TR panellerde “Kurumsal” etiketi bazen farklı paketleri kapsar. Karar kriteri isim değil, **Node.js Web App** özelliğidir.

---

## 3. Mimari (önerilen)

```text
[Alan adı] ──DNS──► Hostinger
                      │
                      ├─ Next.js Web App (Node 22, SSR)
                      │     AUTH_URL = https://alanadin.com
                      │     Cloudinary API
                      │
                      └─ MySQL (aynı hesap, 127.0.0.1:3306)
                            Prisma migrate deploy
```

**Neden hepsi Hostinger’da?**  
Hostinger MySQL çoğu shared planda dışarıdan (Vercel vb.) güvenilir şekilde açılmaz; uygulama ile DB’yi aynı hesapta tutmak en sorunsuz yoldur.

**Alternatifler (şimdilik ikinci tercih):**

- **Vercel + harici MySQL:** Domain Hostinger’da kalır, app Vercel’de. Hostinger MySQL remote kapalıysa çalışmaz; PlanetScale/TiDB Cloud vb. ek maliyet.
- **Hostinger VPS:** Tam kontrol; Node/PM2/Nginx sen yönetirsin. Bu proje için MVP’de gereksiz karmaşa.

---

## 4. Adım adım canlıya alma

### Faz A — Hazırlık (kod / hesap, deploy yok)

1. **GitHub private repo** — Hostinger Git deploy için; `.env` asla commit edilmez.
2. **Cloudinary prod** — Ayrı klasör/preset; `CLOUDINARY_*` prod değerleri.
3. **Yeni `AUTH_SECRET`** — `openssl rand -base64 32` (local secret’ı prod’a kopyalama).
4. **Release blockers** — `docs/RELEASE_BLOCKERS.md` must maddeleri:
   - Gerçek marka / diyetisyen adı / unvan
   - WhatsApp E.164 + telefon veya e-posta
   - Hukuk metinleri (KVKK/gizlilik) onayı veya noindex’te bırakma bilinci
5. **Local build doğrula:** `npm ci && npm run build` (Node 22).

### Faz B — Hostinger altyapı

1. Alan adını Hostinger’a bağla (nameserver veya A kaydı; SSL otomatik).
2. **MySQL oluştur** (hPanel → Databases):
   - DB adı, kullanıcı, şifre not et
   - Host: **`127.0.0.1`** (IPv6 `localhost` sorun çıkarabilir)
3. **Web App oluştur:**
   - Framework: **Next.js**
   - Node: **22**
   - Root: proje kökü (`diyetisyen_cursor_gelistirme_paketi` monorepo ise o klasör)
   - Branch: `main` (veya `production`)
   - Build: `npm run build` (içinde `prebuild` → `prisma generate`)
   - Start: Hostinger Next standalone’ı kendisi ayağa kaldırır

### Faz C — Ortam değişkenleri (Web App → Environment)

```env
NEXT_PUBLIC_SITE_URL=https://ALANADIN.com
AUTH_URL=https://ALANADIN.com
AUTH_SECRET=<yeni-uzun-secret>

DATABASE_URL=mysql://USER:PASSWORD@127.0.0.1:3306/DBNAME?connection_limit=5
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_USER=USER
DATABASE_PASSWORD=PASSWORD
DATABASE_NAME=DBNAME

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

- `USE_FIXTURES_ONLY` **tanımlama** (prod’da fixture’a düşmesin).
- Build sırasında `DATABASE_URL` gerekir eğer migrate build’e eklenirse; en azından `prisma generate` için schema yeterli, migrate’i genelde **ayrı adım** yap.

### Faz D — Şema + admin

1. İlk deploy başarılı olduktan sonra (veya build komutuna kontrollü ekleyerek):
   - `npx prisma migrate deploy`  
   - Shared hosting’de **`prisma migrate dev` kullanma** (shadow DB yaratamaz).
2. Admin oluştur (SSH/terminal varsa Hostinger CLI veya local’den prod DB’ye **bilinçli** bağlanarak):
   - `ADMIN_EMAIL=... ADMIN_PASSWORD=... npm run admin:create`
3. `/admin` → Site ayarları: marka, iletişim, SEO, logo (Cloudinary).
4. Seed **opsiyonel** — prod’a örnek içerik istemiyorsan çalıştırma; elle yayınla.

### Faz E — Smoke test

- [ ] `https://alanadin.com/` SSL yeşil
- [ ] `/hizmetler`, `/blog`, `/tarifler`, `/hesaplayicilar`, `/iletisim`
- [ ] `/admin/giris` → giriş
- [ ] Yazı/tarif yayınla → public’te görünsün
- [ ] Medya yükle → **yeniden deploy** sonrası görsel duruyor (Cloudinary)
- [ ] WhatsApp linki doğru numaraya gidiyor
- [ ] `/sitemap.xml`

---

## 5. Bilinen riskler ve önlemler

| Risk | Önlem |
| --- | --- |
| Plan Node.js Web App vermiyor | Business/Unlimited’a yükselt |
| Build’de `prisma: not found` | `postinstall: prisma generate` zaten var; gerekirse `prisma` paketini `dependencies`’e taşı |
| Prisma engine runtime hatası | Hostinger log’una göre `binaryTargets` / adapter sürümü; Prisma 7 driver adapter kullanıyoruz — klasik `rhel-openssl` notu her zaman geçerli olmayabilir; hata gelirse log ile netleştir |
| MySQL bağlantı tükenmesi | `connection_limit=5` (veya 3–10) |
| Redeploy medya siler | Sadece Cloudinary URL’leri DB’de |
| 503 / process limit | Tek site + www yönlendirmesi; gereksiz ikinci Web App açma |
| Build OOM | Build log; gerekirse Cloud Startup’a geç |
| Secret sızıntısı | Chat’e / Git’e `.env` koyma; Hostinger env kullan |

---

## 6. Önerilen yayın sırası (gerçekçi)

1. **Bu hafta:** Plan doğrulama (Node Web App var mı?) + domain DNS + MySQL + boş Next Web App “hello” veya bu repo staging branch.
2. **Sonra:** Env + migrate + admin + Cloudinary smoke.
3. **İçerik:** Site ayarları, 1–2 hizmet, iletişim; hukuk metinleri hazır değilse noindex bırak.
4. **Soft launch:** Sadece WhatsApp ile duyur; Analytics yok (bilinçli).
5. **Stabil olunca:** Full içerik + SEO noindex kaldırma (hukuk OK ise).

---

## 7. Senin hPanel’de kontrol listesi

- [ ] Plan: Business / Unlimited / Sınırsız (Node.js Web App görünüyor)
- [ ] Domain Hostinger’a bağlı, SSL aktif
- [ ] MySQL DB + user oluşturuldu
- [ ] GitHub repo bağlandı
- [ ] Env değişkenleri girildi
- [ ] İlk deploy yeşil
- [ ] `migrate deploy` + `admin:create`
- [ ] Smoke test tamam

---

## 8. Bu sohbette yapılmayanlar

- Gerçek DNS değişikliği
- Prod secret üretimi / chat’e yazma
- Otomatik Hostinger deploy

Hazırsan bir sonraki adım: hPanel’de **Web App** menüsünün ekran görüntüsü veya plan adını netleştir → birlikte env şablonunu prod domain’e göre doldururuz (secret’ları sen panelde girersin).
