# Security Review — Prompt 10

Tarih: 2026-11-13 · Ortam: yerel geliştirme (MySQL/Cloudinary opsiyonel)

## Özet

| Alan | Durum | Not |
|------|--------|-----|
| Admin route auth | Uygulandı | `middleware` + `requireAdmin()` |
| Upload API | Uygulandı | `/api/admin/*` middleware + session |
| Rich-text XSS | Uygulandı | TipTap allowlist sanitize + unit test |
| SQL injection | Düşük risk | Prisma ORM, ham SQL yok |
| File upload | Uygulandı | MIME/uzantı/boyut; env yoksa upload yok |
| Rate limit login | Uygulandı | Prompt 05 |
| Security headers | Uygulandı | CSP, XFO, nosniff, Referrer, Permissions |
| `poweredByHeader` | Kapalı | `next.config.ts` |
| Log hygiene | Kısmi | Upload hatalarında genel mesaj; secret loglanmamalı |
| Cookies | Auth.js JWT | HttpOnly session cookie (Auth.js varsayılan) |

## Bulgular

### İyi
- Admin CRUD ve medya yazma sunucu tarafında `requireAdmin`.
- Draft/admin noindex; robots `Disallow: /admin`.
- WhatsApp harici link; sahte “randevu oluşturuldu” yok.
- Hesaplayıcı girdileri istemci-only.

### Kalan riskler / takip
1. CSP `unsafe-inline` / `unsafe-eval` — Next.js hydration için gerekli; production’da nonce tabanlı CSP ileride sıkılaştırılabilir.
2. Canlı E2E brute-force / IDOR — MySQL + staging ortamında Prompt 11.
3. Cloudinary imza sunucu tarafında; API secret client’a gitmiyor (doğrulandı tasarım).
4. Hukuki sayfalar yer tutucu — yayın öncesi hukuk onayı (RELEASE_BLOCKERS).

## Otomatik testler
- `sanitize.test.ts` — script/javascript: URL reddi
- `validate-upload.test.ts` — path traversal / boyut
- `headers.test.ts` — güvenlik başlıkları
- `session.test.ts` / rate-limit / password

## Manuel smoke (staging’de tekrar)
- [ ] Anonim `/admin` → girişe yönlendirme
- [ ] Anonim `POST /api/admin/media/upload` → 401
- [ ] Blog içeriğine `<script>` → sanitize sonrası yok
- [ ] Response header’larda `X-Frame-Options: DENY`
