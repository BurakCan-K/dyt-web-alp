# Tasarım farkları — Stitch `screen.png` vs React ana sayfa (Prompt 02)

Masaüstü referans: `stitch-reference/screen.png` + `code.html`.

## Korunanlar
- Krem yüzey (`#fcf9f2`), yeşil primary/container, mercan secondary vurgu
- Playfair Display başlık + Inter gövde + Plus Jakarta Sans UI
- Fixed blur header, pill CTA, `rounded-2xl/3xl` kartlar
- Hero 7/5 grid, ambient glow, hizmet 4’lü grid, felsefe 5/7, 4 adım, SSS + sağ CTA
- Soft yeşil gölge dili

## Bilinçli sapmalar (zorunlu / UX)
| Alan | Stitch | Üretim |
|---|---|---|
| Birincil CTA | Ücretsiz ön görüşme randevusu | WhatsApp ile iletişime geç |
| Trust rozetleri | 4.9/5, 850+, Hacettepe, 10+ yıl, kontenjan | Nötr yaklaşım/iletişim sinyalleri |
| Hero görsel | Google aida-public foto | Yerel gradient placeholder |
| Yorumlar | 3 danışan başarı kartı | İçerik önizleme (blog/tarif/hesaplayıcı) |
| SSS yanı | Sahte randevu formu + başarı banner | WhatsApp / tel / e-posta CTA |
| Footer | Bülten formu | Kaldırıldı |
| Nav | `href="#"` + Başarı Hikayeleri / Randevu | Gerçek rotalar |
| VKİ | Yaş alanı (kullanılmıyor) + klinik protokol dili | Boy/kilo + bilgilendirme notu |
| Mobil | Tek kırılım sınırlı | Hamburger menü + accordion a11y |

## Bilinen / Prompt 03+ ile kapanacak
- Placeholder sayfalar (hakkımda, blog detay, tam hesaplayıcılar) henüz fixture şablon seviyesinde
- Gerçek logo, fotoğraf, iletişim numaraları SiteSettings sonrası
- Pixel-perfect spacing ince ayarı görsel onay sonrası
