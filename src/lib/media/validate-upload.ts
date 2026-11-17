export const ALLOWED_MEDIA_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export const ALLOWED_MEDIA_EXT = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
]);

/** 5 MB — Hostinger 120s limiti ve Cloudinary ücretsiz planına uyumlu */
export const MAX_MEDIA_BYTES = 5 * 1024 * 1024;

export class MediaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MediaValidationError";
  }
}

export function extensionFromName(filename: string): string {
  const base = filename.split(/[/\\]/).pop() ?? "";
  const cleaned = base.replace(/[^a-zA-Z0-9._-]/g, "");
  const parts = cleaned.toLowerCase().split(".");
  return parts.length > 1 ? (parts.pop() ?? "") : "";
}

export function validateUploadFile(input: {
  filename: string;
  mimeType: string;
  bytes: number;
}) {
  if (!input.filename || input.filename.length > 180) {
    throw new MediaValidationError("Geçersiz dosya adı");
  }
  if (input.filename.includes("..") || input.filename.includes("\0")) {
    throw new MediaValidationError("Dosya adı güvenlik kontrolünden geçmedi");
  }
  const ext = extensionFromName(input.filename);
  if (!ALLOWED_MEDIA_EXT.has(ext)) {
    throw new MediaValidationError(
      "İzin verilen uzantılar: jpg, jpeg, png, webp, gif",
    );
  }
  if (!ALLOWED_MEDIA_MIME.has(input.mimeType)) {
    throw new MediaValidationError(
      "İzin verilen MIME: image/jpeg, image/png, image/webp, image/gif",
    );
  }
  if (input.bytes <= 0 || input.bytes > MAX_MEDIA_BYTES) {
    throw new MediaValidationError("Dosya boyutu 1 bayt–5 MB arasında olmalı");
  }
  return { ext };
}
