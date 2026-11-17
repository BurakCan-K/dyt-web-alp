# Stitch Referansının Teknik Analizi

## İncelenen dosyalar
- `stitch-reference/code.html` (~62 KB), `screen.png` (~396 KB), `DESIGN.md` (~10 KB).
- Tek sayfalık HTML prototipidir; üretime hazır Next.js projesi değildir.
- Tailwind CSS **CDN** ile yükleniyor; production Tailwind derleme sistemine taşınmalıdır.
- Stiller ve davranışlar HTML içine gömülü; bileşenlere ayrılmalıdır.
- Fotoğraflar Google `lh3.googleusercontent.com/aida-public/...` adreslerine bağlı; lisans, sahiplik, kalıcılık teyidi yok; yetkili görsellerle değiştirilmeli.

## Görsel tasarım öncelikleri
1. Sıcak keten/krem `#fcf9f2`, açık yüzeyler, yeşil ana `#0d631b` / `#2e7d32`, turuncu/mercan vurgular.
2. Playfair Display başlıklar, Inter metin, Plus Jakarta Sans UI.
3. Geniş boşluklar, oval/pill CTA'lar, 2xl/3xl kartlar ve organik görsel çerçeveler.
4. Ana sayfa bölümleri: header, hero, hızlı ölçüm, hizmetler, çalışma felsefesi, örnek referans kartları, 4 aşamalı süreç, SSS, iletişim, footer.
5. Masaüstü için `screen.png` ana görsel doğrulama referansıdır; tablet/mobil tasarımlar bu dilden uyarlanır.
6. `DESIGN.md` açıklamalarındaki semantik renkler ile HTML'deki Tailwind tokenları her zaman birebir aynı değil. Uygulamada **tek bir tutarlı token sistemi** oluşturulmalı; öncelikli referans görsel ve HTML'deki gerçek renk/ölçülerdir.

## Mevcut prototipin işlevsel ve hukuki sorunları
- Menü, sosyal medya ve hukuki bağlantıların çoğu `href="#"`; gerçek rotalar/yasal metinler yok.
- `consultation-form` `onsubmit="return false"` kullanıyor; istek gönderilmiyor, yalnızca başarı mesajı görüntüleniyor. **Kaldırılmalı**.
- Footer bülten kayıt formu hiçbir kaydı göndermiyor. **Çalışan abonelik hizmeti ve izin altyapısı yoksa kaldırılmalı**.
- `calc-age` alanı görüntüleniyor ama VKİ hesabında kullanılmıyor. Yanıltıcı 'kişiselleştirilmiş' ifadeler var. VKİ yalnızca boy/kilo kullanır; yaş alanı enerji hesabı aracına taşınabilir.
- Seçilen hedefe göre dönüşüm/klinik protokol isimleri gösteriliyor; bunlar tıbbi öneri olarak sunulmamalı; bilgilendirme düzeyine çekilmeli.
- Prototipte 'Uzman Diyetisyen Derya Kaya', 'Hacettepe mezunu', '10+ yıl', '850+ danışan', '4.9/5 memnuniyet', 'bu hafta 4 kontenjan' gibi **doğrulanmamış örnekler** var.
- Danışan yorumları, önce/sonra, iddialı tedavi ve sonuç vaadi dili reklam/tanıtım mevzuatı bakımından yüksek riskli: **yayında varsayılan olarak kapalı ve ilk MVP kapsamı dışında**.
- Prototipte Nişantaşı iletişim/adres/telefon/e-posta da örnek. Yayın öncesi gerçek verilerle değiştirilmelidir.
- Formdaki 'KVKK kapsamında korunur; kesinlikle üçüncü taraflarla paylaşılmaz' gibi kesin ifadeler gerçek veri akışı ve hukuk incelemesi olmadan kullanılmamalı.
- 'Online görüntülü danışmanlık' ifadeleri, çevrim içi sağlık hizmeti mevzuatı/onayları kontrol edilmeden yayına konmamalı.

## Tasarım taşıma stratejisi
- HTML dosyasını React JSX'e otomatik çevirmekle yetinme. Önce `DesignTokens`, `Header`, `Hero`, `CalculatorTeaser`, `ServiceGrid`, `Approach`, `Steps`, `Faq`, `ContactCta`, `Footer` bileşenlerine ayır.
- İlk aşamada statik içerik fixtures ile orijinal ekranı sadık biçimde üret; daha sonra DB bağla.
- Her özgün görsel bileşeni `screen.png` ile karşılaştır; erişilebilirlik ve mobil akış için gerektiğinde iyileştir.
- İşlevi olmayan butonu bırakma, fake başarı banner'ı gösterme, doğrulanmamış metin üretme.
