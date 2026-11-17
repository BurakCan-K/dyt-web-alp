# Diyetisyen Web Sitesi — Cursor Geliştirme Paketi

Bu paket, kullanıcının Stitch ile oluşturduğu **tek sayfalık UI prototipini** üretime uygun, içerik yönetim panelli, veritabanlı bir web sitesine dönüştürmek için hazırlandı. **Uygulamanın kendisi değil; gereksinimler, uygulama kuralları, Cursor promptları ve dağıtım rehberidir.**

## Tasarımdan gelen dosyalar
- `stitch-reference/screen.png` — orijinal tek sayfalık Stitch ekran görüntüsü.
- `stitch-reference/code.html` — Stitch HTML/Tailwind CDN prototipi.
- `stitch-reference/DESIGN.md` — tasarım dili, renkler, tipografi ve boşluklar.

## Developer quickstart (uygulama)
```bash
npm install
cp .env.example .env
npm run dev
```
- Site: `http://localhost:3000`
- Admin iskelet: `http://localhost:3000/admin/giris`
- Ayrıntılar: `docs/LOCAL_SETUP.md`
- Kalite: `npm run lint` · `npm run typecheck` · `npm run test` · `npm run build`

## Hızlı başlangıç (Cursor fazları)
1. Bu klasörü yeni bir Git deposuna kopyalayın ve Cursor ile açın. `stitch-reference/` klasörünü referans olarak **koruyun**, doğrudan production olarak yayınlamayın.
2. `docs/PRD.md`, `docs/STITCH_AUDIT.md`, `docs/ARCHITECTURE.md`, `docs/HOSTINGER_DEPLOY.md` ve `.cursor/rules/project.mdc` dosyalarını okuyun.
3. Cursor Agent'a sırasıyla `prompts/00_*` ... `prompts/11_*` içeriklerini **ayrı ayrı** gönderin. Tek seferde hepsini göndermeyin.
4. Her fazın sonunda `npm run lint`, `npx tsc --noEmit`, ilgili testler ve `npm run build` çalıştırılsın; testlerin gerçekten geçtiğinden emin olun.
5. Her başarılı fazdan sonra Git commit alın; kritik tasarım ve migration değişikliklerini gözden geçirin.
6. Gerçek diyetisyen bilgileri, logo, fotoğraflar, telefon, WhatsApp numarası, adres, mesleki unvanlar ve onaylı hukuk metinleri yayın öncesinde sağlanmalı. Prototipteki örnek isim ve metrikleri canlıya taşımayın.

## Önerilen teknoloji
- Next.js (App Router, Node.js server mode), React, TypeScript, Tailwind, shadcn/ui gerekliyse.
- MySQL/MariaDB (Hostinger), **Prisma ORM 7** (Prisma 8'de MariaDB desteği henüz yok; sürümü sabitleyin).
- Auth.js ile tek admin hesabı ve `Credentials` sağlayıcı; güçlü parola hash'i; JWT oturumu veya uyumlu doğrulanmış oturum stratejisi.
- Zod; Tiptap benzeri güvenli rich-text editör; Vitest, Testing Library, Playwright.
- Kalıcı medya: Cloudinary veya S3 uyumlu harici nesne depolama (tasarımda eski Google-hosted görselleri kalıcı kaynak kabul etmeyin).
- Hostinger Business Web Hosting > **Web App / Node.js website** üzerinden GitHub deployment; **static export kullanmayın**.

## Çalışma yöntemi
**Keşif → Tasarım portu → Modül bazlı veri modeli → Admin kimlik doğrulama → CRUD → Entegrasyon → Test → Staging → Production.**

**Duraklatma noktaları**: 1) ana sayfa görsel onayı, 2) DB şeması review, 3) admin içerik ekleme/uçtan uca test, 4) canlı dağıtım testleri.

## Kapsam sınırları
**Var:** Tanıtım, Hakkımda, Hizmetler, Blog, Tarifler, Örnek Beslenme Rehberleri, Hesaplayıcılar, SSS, İletişim, admin paneli ve MySQL.

**Yok:** Online randevu takvimi, ödeme, danışan portalı, kullanıcı üyeliği, teşhis/tedavi tavsiyesi, çalışma garantisi veya doğrulanmamış başarı iddiaları, danışan verisi toplama, henüz işlevsel olmayan bülten aboneliği.

## Kaynaklar
- Hostinger Node.js deploy: https://www.hostinger.com/support/how-to-deploy-a-nodejs-website-in-hostinger/
- Hostinger DB bağlantısı: https://www.hostinger.com/support/connecting-a-hostinger-mysql-database-to-a-node-js-application/
- Hostinger runtime limitleri: https://www.hostinger.com/support/hostinger-node-js-limits-for-web-and-cloud-plans/
- Prisma 7 MySQL/MariaDB: https://www.prisma.io/docs/orm/v7/core-concepts/supported-databases/mysql
- Prisma 8 DB desteği: https://www.prisma.io/docs/orm/supported-databases
- Sağlık tanıtım yönetmeliği: https://antalyaism.saglik.gov.tr/TR-366500/saglik-hizmetlerinde-tanitim-ve-bilgilendirme--faaliyetleri-hakkinda-yonetmelik.html
