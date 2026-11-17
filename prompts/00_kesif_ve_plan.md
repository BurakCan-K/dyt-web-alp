# CURSOR PROMPT 00 — Keşif, plan, risk analizi (KOD YAZMA)

Bu repo üzerinde çalışıyorsun. Önce sırasıyla şu dosyaları oku:
- `README.md`
- `.cursor/rules/project.mdc`
- `docs/PRD.md`
- `docs/STITCH_AUDIT.md`
- `docs/ARCHITECTURE.md`
- `stitch-reference/DESIGN.md`
- `stitch-reference/code.html`
- `stitch-reference/screen.png` (görsel erişimi varsa incele)

**Bu turda hiçbir uygulama kodu yazma.**

Görevin:
1. Stitch HTML'inin gerçek bölüm ağacını, mevcut etkileşimlerini ve kırık/gerçekte çalışmayan öğelerini tablo olarak çıkar.
2. Tasarımın korunması gereken tipografi, renk, düzen, responsive ve mikro etkileşimlerini sırala.
3. PRD'ye göre MVP kapsamını kesinleştir; online randevu takvimi, ödeme, danışan üyeliği, gerçek olmayan bülten/başarı formu ekleme.
4. Tek Next.js App Router + admin + Hostinger MySQL/MariaDB + Prisma 7 için mimari plan çıkar. Prisma 8 MariaDB uyumsuzluğuna dikkat et.
5. Rota ağacı, component breakdown, veritabanı şeması taslağı, güvenlik kontrol listesi, riskler ve fazların tamamlanma kriterlerini öner.
6. Referansta geçen örnek/uydurma kimlik, diploma, başarı ve iletişim iddialarını açıkça risk listesine ekle.
7. `docs/IMPLEMENTATION_PLAN.md` ve `docs/DECISIONS.md` üret; yapılacak işleri [ ] checklist olarak sırala.

Çıktının sonunda yalnızca şu üç sorunu kontrol et: (1) tasarım birebir hangi kısımlarda korunacak? (2) veri ve medya kalıcılığı nasıl sağlanacak? (3) admin güvenliği nasıl sağlanacak? Bunların dışındaki konularda kullanıcıdan onay bekleme; dokümandaki varsayımlarla ilerle.

KOD YAZMAYI BU ADIMDA DURDUR. Sonraki prompt 01'dir.
