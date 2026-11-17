# Migration prosedürü

## Geliştirme (local)
1. `.env.example` → `.env` kopyala; **local** MySQL/MariaDB bilgilerini doldur.
2. Hostinger production DB’ye günlük geliştirme için bağlanma.
3. Client üret:
   ```bash
   npm run db:generate
   ```
4. Migration (yalnızca local DB):
   ```bash
   npm run db:migrate
   ```
5. Seed (demo admin parolası oluşturmaz):
   ```bash
   npm run db:seed
   ```

## Production (Hostinger)
1. DB yedeği al.
2. Env: `DATABASE_URL`, `DATABASE_HOST=127.0.0.1`, user/password/name.
3. Build sırasında: `prisma generate`
4. Deploy sonrası (otomatik her start’ta değil):
   ```bash
   npx prisma migrate deploy
   ```
5. `migrate dev` production’da **kullanma**.

## DB yoksa
- Şema dosyaları ve `prisma generate` yine çalıştırılabilir (geçerli formatlı `DATABASE_URL` env’de olmalı; bağlantı generate için gerekmez).
- `migrate dev` / `seed` bağlantı hatası verir — beklenen. Engel: yerel MySQL yok.

## Komutlar (package.json)
| Script | Anlam |
|---|---|
| `db:generate` | Prisma Client |
| `db:migrate` | `prisma migrate dev` |
| `db:migrate:deploy` | production migrate |
| `db:seed` | seed.ts |
| `db:studio` | Prisma Studio |
