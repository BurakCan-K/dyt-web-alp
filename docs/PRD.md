# Ürün Gereksinimleri (PRD) — Diyetisyen Web Sitesi

## Amaç
Bir diyetisyenin uzmanlık alanlarını ve çalışma yaklaşımını tanıttığı; ziyaretçilerin beslenme içeriklerini ve matematiksel bilgi araçlarını kullanabildiği; randevu için **telefon/WhatsApp/e-posta ile iletişim kurduğu**; diyetisyenin içerikleri **korumalı admin panelinden yönetebildiği** SEO uyumlu bir web sitesi.

## Hedef kullanıcılar
1. Site ziyaretçisi (giriş yapmaz): tanıtım, yazılar, tarifler, hesaplayıcılar, iletişim.
2. Yönetici/diyetisyen (giriş yapar): içerik ve görünürlük yönetimi.

## MVP kapsamı
### Herkese açık sayfalar
| URL | Gereksinimler |
|---|---|
| `/` | Stitch'ten taşınmış ana sayfa, öne çıkan hizmetler, yazılar, tarifler, kısa hesaplayıcı, güçlü iletişim CTA |
| `/hakkimda` | Eğitim, sertifika (doğrulanmış), yaklaşım, fotoğraf, SEO |
| `/hizmetler` ve `/hizmetler/[slug]` | Hizmet kartları, detay açıklaması, WhatsApp CTA |
| `/blog` ve `/blog/[slug]` | Kategori/arama, tarih, kapak, içindekiler (varsa), kaynaklar, SEO |
| `/tarifler` ve `/tarifler/[slug]` | Kategori filtreleri, porsiyon ölçekleme, malzemeler, uygulama adımları, el ile girilen/yöntemi belirtilen besin değerleri |
| `/beslenme-rehberleri` ve `/beslenme-rehberleri/[slug]` | Genel örnek beslenme düzeni içerikleri, öğünler, ilgili tarifler, genel bilgilendirme notu |
| `/hesaplayicilar` | Araç listesi |
| `/hesaplayicilar/vki` | VKİ hesaplama, yetişkin sınırı, temel açıklama |
| `/hesaplayicilar/enerji` | Mifflin–St Jeor dinlenme enerjisi + kullanıcı seçimine göre aktivite çarpanı, tahmin uyarısı |
| `/hesaplayicilar/makro` | Kullanıcının girdiği günlük enerji ve dağılıma göre makro gramları; doğrulama |
| `/iletisim` | WhatsApp, telefon, mail, doğrulanmış adres ve çalışma saatleri, harita bağlantısı |
| `/kvkk-aydinlatma`, `/gizlilik`, `/cerez-politikasi` | Hukuken onaylanmış metinler mevcutsa yayınlanır; aksi halde üretimde eksik metinle yayına alınmaz |

### Admin sayfaları
| URL | Fonksiyon |
|---|---|
| `/admin/giris` | Güvenli oturum açma, kaba kuvvet koruması |
| `/admin` | Özet; taslak/yayındaki içerik sayıları, son düzenlemeler |
| `/admin/yazilar` | Blog CRUD, taslak/yayın, kategori, sıralama, kaynak ve SEO |
| `/admin/tarifler` | Tarif CRUD, malzeme miktar/birim, adımlar, kapak, besin değeri |
| `/admin/hizmetler` | Hizmet CRUD, sıralama, öne çıkarma, sayfa bilgileri |
| `/admin/rehberler` | Genel beslenme rehberi CRUD, öğünler, ilgili tarifler |
| `/admin/sss` | SSS CRUD ve sıralama |
| `/admin/medya` | Görsel yükleme, kullanım yerleri, alternatif metin; kalıcı bulut depolama |
| `/admin/site-ayarlari` | Logo, diyetisyen kimliği, hero, Hakkımda, iletişim, sosyal, çalışma saatleri, SEO varsayılanları |
| `/admin/hesap` | Şifre değiştirme, oturum kapatma |

### İçerik durumları
- Taslak (`DRAFT`), yayınlandı (`PUBLISHED`), arşivlendi (`ARCHIVED`); taslaklar asla public listelerde/SEO sitemap'te görünmemeli.
- `slug` benzersiz; Türkçe karakter normalizasyonu ve çakışma çözümü.
- SEO title/description ve OG görseli içerik bazında yönetilebilir.
- Silme tercihen soft-delete; yanlışlıkla silinen içerik kurtarılabilir.
- Güncellemelerden sonra public sayfalar yeniden doğrulanmalı / cache temizlenmeli.

### İletişim akışı
- Her ana CTA: `https://wa.me/<ülkekodlu_numara>?text=<urlencoded_mesaj>`; URL uygulama içinde admin ayarlarından üretilecek.
- Mesaj: `Merhaba, beslenme danışmanlığı ve görüşme süreci hakkında bilgi almak istiyorum.`
- `tel:` ve `mailto:` yedek kanallar.
- **Takvim, otomatik rezervasyon, Lead tablosu, danışan kayıt formu, ödeme akışı YOK.**
- Kullanıcıyı yanıltan 'randevunuz oluşturuldu/talebiniz alındı' mesajları YOK.

### Hesaplayıcı güvenliği
- İşlemler yalnızca tarayıcıda; girilen kişisel ölçümler DB'ye ve analitik servislerine aktarılmaz.
- VKİ: `kg / (m*m)`; yetişkinler için sınıflar 18.5/25/30; etiketsiz tanı değil.
- Mifflin–St Jeor: `10*kg + 6.25*cm - 5*yaş + s` (s erkek +5, kadın -161); cinsiyet temelli formül girdisini ve alternatiflere ilişkin açıklamayı açık göster.
- TDEE = RMR × etkinlik çarpanı; tüm faktörlerin kaynağı ve tahmin niteliği açıklanır.
- Makro: `P*4 + K*4 + Y*9`; enerji yüzdeleri toplamı %100 değilse hata.
- Tarif porsiyonu `yeni_miktar = orijinal_miktar × yeni_porsiyon / mevcut_porsiyon`; kesir, ağırlık ve birim yuvarlamaları korunur.
- Yaş, boy, kilo, enerji gibi girdiler min/max kontrolünden geçer; sıfır, negatif, NaN, aşırı uçlar hatalı olarak işaretlenir.
- Gebelik, emzirme, çocuklar, kronik hastalıklar için otomatik kişisel diyet/reçete verilmez.

## Yayın kriterleri
- Admin girişi yalnızca yetkili kullanıcıda başarılı.
- Tam CRUD + taslak/yayın + görsel yükleme + SEO yönetimi uçtan uca çalışıyor.
- Blog/tarif/hizmet değişikliği yeni deployment olmadan sitede görünüyor.
- WhatsApp doğru numaraya ve kodlanmış mesajla gidiyor.
- Fake başarı formu, bülten, hasta yorumları, doğrulanmamış başarı iddiaları kaldırılmış.
- 360px / 768px / 1440px responsivity; klavye, kontrast, temel ekran okuyucu davranışları.
- SEO, sitemap, robots, canonical, metadata, 404 ve SSR sayfa görüntülemesi.
- Lint, typecheck, unit, E2E ve build başarılı; Hostinger smoke test başarılı.
