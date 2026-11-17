export class AuthAccessError extends Error {
  readonly status: 401 | 403;

  constructor(message = "Yetkisiz", status: 401 | 403 = 401) {
    super(message);
    this.name = "AuthAccessError";
    this.status = status;
  }
}

/** Kullanıcıya gösterilecek genel giriş hatası — kullanıcı numarası sızdırma */
export const GENERIC_LOGIN_ERROR =
  "Giriş başarısız. Bilgilerinizi kontrol edin veya daha sonra tekrar deneyin.";
