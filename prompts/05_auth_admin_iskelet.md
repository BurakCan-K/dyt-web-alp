# CURSOR PROMPT 05 — Güvenli Admin Authentication ve Yönetim Layout'u

`docs/ARCHITECTURE.md` güvenlik başlığını oku. Dış kullanıcı kaydı olmayacak; sadece bir OWNER admin hesabı.

Görevler:
1. Auth.js Credentials veya uyumlu bakımı yapılan kimlik doğrulama kur; AdminUser passwordHash için Argon2id/bcrypt kullan. Password hash asla düz metin tutulmasın.
2. İlk admin hesabını yalnızca güvenli CLI/provisioning scriptiyle oluştur; sabit demo şifre veya public kayıt endpoint'i oluşturma.
3. Oturum cookie ayarları ve giriş/çıkış; gizli secret, güvenli sessiz hata mesajları ve brute force/deneme sınırlaması ekle.
4. `/admin/giris` tasarım sistemiyle uyumlu, sade ve erişilebilir login sayfası oluştur.
5. `/admin` dashboard, responsive sidebar/topbar, siteye dön, logout, oturum durumları.
6. Admin route korumasını **server-side** uygulamaya ekle; daha önemlisi bütün gelecekteki yazma Server Action/API endpoint'lerinde `requireAdmin()` çağrısını kullanacak yardımcıyı oluştur.
7. Yetkisiz 401/403; login olmayan kişinin admin HTML veya admin veri okuyamadığından emin ol.
8. `AdminUser` email değişimi/şifre değişimi (onaylı geçerli parola) için temel hesap ayarları ekle.
9. Oturum admin router ve CSRF testlerini yaz; session-olmayan mutation testleri ekle.

Bu adımda sadece auth ve admin shell; içerik CRUD faz 06/07'de. Gerçek DB erişimi yoksa auth çalışır diye iddia etme, blokajı açıkça belirt.
