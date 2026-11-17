# Yerel Geliştirme Kurulumu

## Gereksinimler
- Node.js **22+** (LTS önerilir)
- npm 10+

## Kurulum
```bash
cd diyetisyen_cursor_gelistirme_paketi
npm install
cp .env.example .env
npm run dev
```

Tarayıcı: [http://localhost:3000](http://localhost:3000)  
Admin iskelet: [http://localhost:3000/admin/giris](http://localhost:3000/admin/giris)

## Scriptler
| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | Vitest (unit) |
| `npm run build` | Production build |
| `npm start` | Build sonrası Node sunucusu |

## Veritabanı (Prisma 7)

### Windows — MySQL 8 yeni kurulum
1. MySQL servisinin çalıştığını doğrula (`MySQL80` Running).
2. Kurulumda verdiğin **root** şifresiyle DB + `dyt` kullanıcısını oluştur:

```powershell
cd diyetisyen_cursor_gelistirme_paketi
$env:MYSQL_ROOT_PASSWORD = 'KURULUMDAKI_ROOT_SIFREN'
.\scripts\setup-mysql-local.ps1
```

Manuel (MySQL Workbench / CLI): `scripts/mysql-init-local.sql` dosyasını root ile çalıştır.
`.env` varsayılanları: user `dyt`, password `dyt_dev_only`, DB `dyt_web_dev`, host `127.0.0.1`.

3. Migrate + seed + fixture kapat:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
# .env içinde USE_FIXTURES_ONLY=0
npm run dev
```

Ayrıntı: `docs/MIGRATIONS.md`, `docs/DATA_MODEL.md`

## Admin oluşturma (DB + migrate sonrası)
```bash
# .env içinde güçlü AUTH_SECRET tanımlayın
ADMIN_EMAIL=admin@ornek.com ADMIN_PASSWORD='EnAz12Karakter!' npm run admin:create
```
- Public kayıt yok; demo parola seed’de yok.
- Giriş: `/admin/giris`

## Notlar
- `stitch-reference/` yalnızca tasarım referansıdır; CDN HTML yayınlanmaz.
- `.env` dosyasını git’e eklemeyin; gerçek sırları sohbete yapıştırmayın.
- Prisma 8’e yükseltmeyin (MariaDB).
- MySQL yoksa auth DB’ye bağlanamaz; giriş başarısız olur (beklenen).
