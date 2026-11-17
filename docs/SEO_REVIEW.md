# SEO Review — Prompt 10

Tarih: 2026-11-13

## Uygulananlar

| Madde | Durum |
|-------|--------|
| `generateMetadata` / `buildMetadata` | Canonical, OG, Twitter, robots |
| `metadataBase` | `NEXT_PUBLIC_SITE_URL` |
| `sitemap.xml` | Yalnızca public PUBLISHED (+ static public) |
| `robots.txt` | Allow `/`, disallow `/admin` `/api/` |
| Admin / giriş | `noIndex: true` |
| KVKK/gizlilik/çerez | `noIndex: true` (onaysız metin) |
| Article JSON-LD | Blog detay (yayınlanan alanlardan) |
| Recipe JSON-LD | Tarif detay |
| `lang="tr"` | Root layout |
| Skip link | `#main-content` |
| `href="#"` taraması | Eşleşme yok |

## Sitemap kapsamı
- Dahil: ana sayfa, hizmetler, blog, tarifler, rehberler, hesaplayıcılar, iletişim, hakkımda
- Hariç: `/admin/*`, taslak içerik, hukuki yer tutucular

## Performans / görseller
- Cloudinary `remotePatterns` `next.config` içinde
- `SiteImage` yardımcı bileşeni (next/image)
- Logo’da width/height + async decode
- LCP: hero metin SSR; görsel logo varsa lazy olmayan priority opsiyonu mevcut

## a11y (WCAG AA hedefi)
- Focus-visible global outline
- `prefers-reduced-motion` globals
- FAQ: `aria-expanded` / `aria-controls` / region
- Form hataları `role="alert"`
- Mobil menü Escape ile kapanır

## Bilinçli sınırlar
- Hukuki metinler uydurulmadı; noindex
- Takip scripti / çerez banner / bülten formu yok
- Lighthouse skoru bu ortamda ölçülmedi → Prompt 11 staging

## Doğrulama komutları
```bash
npm run typecheck
npm test
npm run build
# Build sonrası: /sitemap.xml /robots.txt
```
