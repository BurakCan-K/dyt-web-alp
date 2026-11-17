# CURSOR PROMPT 01 — Next.js proje iskeleti ve kalite altyapısı

`docs/IMPLEMENTATION_PLAN.md`, `.cursor/rules/project.mdc` ve `docs/ARCHITECTURE.md` dosyalarını okuyarak uygula.

Yeni Next.js App Router (TypeScript strict, Tailwind, ESLint) projesi kur. Node.js 22, npm kullan; uyumlu güncel Next.js sürümünü seç. `stitch-reference/` ve `docs/` dosyalarını koru. Gerekirse uygulamayı mevcut repo kökünde yapılandır, ayrı iç içe Next.js proje oluşturma.

İşler:
- `src/app` altında route groups `(public)` ve `admin` iskeleti.
- Ortak Header/Footer/Container/Button/SectionHeading/Card bileşenleri için temeller.
- Tailwind CSS'yi **build-time** yapılandır; `https://cdn.tailwindcss.com` production'a ekleme.
- `DESIGN.md` ve HTML'nin gerçek değerlerinden `globals.css`/theme tokenları: krem yüzey, yeşil CTA, mercan vurgu, Playfair Display, Inter, Plus Jakarta Sans, radius ve spacing.
- `next/font` ile fontları yükle; font fallbacklerini tanımla.
- `src/lib/whatsapp.ts` (henüz numara yoksa güvenli placeholder ve disabled CTA), `src/lib/seo.ts`, `src/lib/slug.ts` yardımcıları.
- Dummy fixture veri katmanı kur (`src/data/fixtures.ts`) ama örnek kimlik, adres ve sayıların gerçekmiş gibi render edilmesini engelle.
- `.env.example` oluştur; gerçek sırlar olmayacak. `.gitignore` güncelle.
- `lint`, `typecheck`, `test`, `build` scriptlerini tanımla. Test ortamını kur ama çalışmayan test sonuçlarını raporlama.
- `README.md` içinde developer quickstart ekle (mevcut kullanıcı README'sini silme; ayrı `docs/LOCAL_SETUP.md` yapabilirsin).

Kabul: `npm run lint`, `npx tsc --noEmit`, `npm run build` başarılı; `/` ve `/admin/giris` temel sayfası açılıyor. Bu fazda DB, auth ve tam CRUD yazma.

Sonunda değişen dosyaları, komut çıktılarını ve açık TODO'ları raporla.
