export type MediaStorageMode = "cloudinary" | "s3" | "unset";

export class MediaConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaConfigError";
  }
}

export function getMediaStorageMode(): MediaStorageMode {
  const explicit = (process.env.MEDIA_PROVIDER ?? "").toLowerCase();
  if (explicit === "s3") return "s3";
  if (explicit === "cloudinary") return "cloudinary";

  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    return "cloudinary";
  }
  if (
    process.env.S3_BUCKET &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY
  ) {
    return "s3";
  }
  return "unset";
}

export function requireCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (!cloudName || !apiKey || !apiSecret) {
    throw new MediaConfigError(
      "Cloudinary env eksik (CLOUDINARY_CLOUD_NAME / API_KEY / API_SECRET). Sahte yükleme yapılmaz; Hostinger’da object storage kullanın — public_html kalıcı değil.",
    );
  }
  return { cloudName, apiKey, apiSecret };
}

export function assertMediaConfigured() {
  const mode = getMediaStorageMode();
  if (mode === "unset") {
    throw new MediaConfigError(
      "Medya deposu yapılandırılmadı. CLOUDINARY_* veya S3_* env değişkenlerini tanımlayın. Yerel public/ klasörüne kalıcı upload yok.",
    );
  }
  if (mode === "s3") {
    throw new MediaConfigError(
      "S3 provider seçildi ancak bu MVP’de Cloudinary yükleme etkin. MEDIA_PROVIDER=cloudinary ve CLOUDINARY_* env kullanın.",
    );
  }
  return requireCloudinaryConfig();
}
