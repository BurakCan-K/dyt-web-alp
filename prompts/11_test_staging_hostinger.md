# CURSOR PROMPT 11 — Entegrasyon testleri, son kontrol ve Hostinger prod hazırlığı

`docs/HOSTINGER_DEPLOY.md`, `docs/TEST_CHECKLIST.md`, `docs/PRD.md` ve `docs/RELEASE_BLOCKERS.md` dosyalarını aç.

İşler:
1. `npm run lint`, `npx tsc --noEmit`, Vitest, Playwright ve `npm run build` sırayla çalıştır. Eksik test ortamı varsa gerçek blokaj olarak raporla; hayali başarı yazma.
2. Admin login, yetki, CRUD, draft/publish, slug collision, upload, website settings, public görünürlük, SEO, calculators, WhatsApp bağlantısı ve mobil menü için E2E testleri.
3. Test veritabanını production'dan ayır; `prisma migrate deploy` için SQL yedeği/migration planı hazırla.
4. `next export` / `output: export` yapılandırması olmasın; Hostinger'da gerçek Next.js server deploy edilecek. build/start komutlarını doğrula.
5. Node 22, environment variable listesi, Prisma Client generation, private GitHub repo, web app deployment, DB host `127.0.0.1:3306`, signed medya servis key'leri, TLS/HTTPS ayarları.
6. Hostinger deploy için adım adım kullanıcı eylemleri rehberi oluştur. Sırları chat'e veya loglara basma.
7. Önce staging/test ortamında varsa dağıtım yap; DNS/DB/migration gibi gerçek harici işlemleri kullanıcı onayı olmadan otomatik yürütme.
8. Production smoke test planı: `/`, `/hizmetler`, `/blog`, `/tarifler`, `/hesaplayicilar`, `/iletisim`, `/admin/giris`; admin yayınlama, görsel upload, re-deploy sonrası görsel kalıcılığı, SEO sitemap, SSL.
9. Tamamlanmamış maddeleri `docs/RELEASE_BLOCKERS.md` altında öncelikli sıraya koy. Kullanıcının diyetisyen kimliği, gerçek iletişim, meslek unvanı, görseller, hukuk metinleri, sosyal URL bilgilerini eksikse listele.
10. `docs/RELEASE_CHECKLIST.md` ve `docs/OPERATIONS_RUNBOOK.md` (DB backup, migration, recovery, media backup, admin şifre sıfırlama) oluştur.

Faz bitimi: Değişen dosyalar, çalıştırılan komutlar, PASS/FAIL sonuçları, production blocker'lar, Hostinger yapılacaklar. Kullanıcıya 'deploy edildi' deme; gerçek deploy ve domain doğrulanmadan release tamamlanmış sayılmaz.
