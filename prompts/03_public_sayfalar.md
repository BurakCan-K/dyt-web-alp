# CURSOR PROMPT 03 — Public sayfalar ve içerik şablonları

`docs/PRD.md` ve `docs/STITCH_AUDIT.md`'yi oku. Faz 02'de oluşturulan design system ve layout bileşenlerini yeniden kullan.

Aşağıdaki sayfaları oluştur: `hakkimda`, `hizmetler`, `hizmetler/[slug]`, `blog`, `blog/[slug]`, `tarifler`, `tarifler/[slug]`, `beslenme-rehberleri`, `beslenme-rehberleri/[slug]`, `hesaplayicilar`, `iletisim`, hukuki metinler için rotalar.

Gereksinimler:
- Stitch'teki editoryal hissi tüm sayfalara aktar; her sayfa ayrı rastgele UI kütüphanesi gibi görünmesin.
- Blog listesinde kategori filtresi, arama, pagination (gerekliyse), boş durum; detayda kaynaklar ve paylaşım.
- Tarif listesinde kategori/etiket filtreleri; detayda porsiyon, hazırlık süresi, malzemeler, tarif adımları, sağlanan besin değerleri ve porsiyon dönüştürücü için UI alanı.
- Örnek beslenme rehberleri genel bilgilendirmedir; hastalık/kişiye özel tedavi listesi üretme.
- Hizmet detaylarında iletişim CTA'sı; WhatsApp mesajına hizmet başlığı (urlencoded) eklenebilir. Randevu takvimi oluşturma.
- Hakkımda bilgileri doğrulanmadan sıfat/sertifika uydurma; geçici placeholder belirgin olsun.
- Etkileşimsiz demo bülten ve danışan yorumları yok.
- `notFound()` davranışı; published olmayan içerik fixture'da bile gösterilmemeli.
- Metadata, page title, OG için veri yapısını hazırla. Gerçek DB entegrasyonu **faz 06'da**.

Her sayfayı breakpoint'lerde ve semantik HTML açısından kontrol et; build ve lint sonuçlarını bildir. Bu fazda admin veya DB kodlama.
