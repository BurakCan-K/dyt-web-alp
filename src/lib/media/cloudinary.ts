import { createHash } from "node:crypto";
import { requireCloudinaryConfig } from "./config";

function signParams(params: Record<string, string>, apiSecret: string) {
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(`${toSign}${apiSecret}`).digest("hex");
}

export type CloudinaryUploadResult = {
  publicId: string;
  url: string;
  mimeType: string;
  bytes: number;
  width: number | null;
  height: number | null;
};

export async function uploadToCloudinary(input: {
  buffer: Buffer;
  filename: string;
  mimeType: string;
  folder?: string;
}): Promise<CloudinaryUploadResult> {
  const { cloudName, apiKey, apiSecret } = requireCloudinaryConfig();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const folder = input.folder ?? "dyt-web";
  const params: Record<string, string> = {
    folder,
    timestamp,
  };
  const signature = signParams(params, apiSecret);

  const form = new FormData();
  form.append(
    "file",
    new Blob([new Uint8Array(input.buffer)], { type: input.mimeType }),
    input.filename,
  );
  form.append("api_key", apiKey);
  form.append("timestamp", timestamp);
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: form },
  );
  const data = (await res.json()) as {
    error?: { message?: string };
    public_id?: string;
    secure_url?: string;
    url?: string;
    bytes?: number;
    width?: number;
    height?: number;
    format?: string;
  };

  if (!res.ok || !data.public_id || !(data.secure_url || data.url)) {
    throw new Error(
      data.error?.message ?? "Cloudinary yükleme başarısız",
    );
  }

  return {
    publicId: data.public_id,
    url: data.secure_url ?? data.url!,
    mimeType: input.mimeType,
    bytes: data.bytes ?? input.buffer.byteLength,
    width: data.width ?? null,
    height: data.height ?? null,
  };
}

export type CloudinaryResource = {
  publicId: string;
  url: string;
  bytes: number;
  width: number | null;
  height: number | null;
  format: string | null;
  createdAt: string | null;
};

/**
 * Admin API ile klasördeki görselleri listeler (upload type).
 * Uygulama yüklemeleri varsayılan `dyt-web` klasörüne gider.
 */
export async function listCloudinaryImages(input?: {
  folder?: string;
  maxPages?: number;
}): Promise<CloudinaryResource[]> {
  const { cloudName, apiKey, apiSecret } = requireCloudinaryConfig();
  const folder = (input?.folder ?? "dyt-web").replace(/\/$/, "");
  const maxPages = input?.maxPages ?? 20;
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const out: CloudinaryResource[] = [];
  let nextCursor: string | undefined;

  for (let page = 0; page < maxPages; page++) {
    const params = new URLSearchParams({
      type: "upload",
      prefix: `${folder}/`,
      max_results: "100",
    });
    if (nextCursor) params.set("next_cursor", nextCursor);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?${params}`,
      {
        headers: { Authorization: `Basic ${auth}` },
        cache: "no-store",
      },
    );
    const data = (await res.json()) as {
      error?: { message?: string };
      resources?: Array<{
        public_id?: string;
        secure_url?: string;
        url?: string;
        bytes?: number;
        width?: number;
        height?: number;
        format?: string;
        created_at?: string;
      }>;
      next_cursor?: string;
    };

    if (!res.ok) {
      throw new Error(
        data.error?.message ?? "Cloudinary listeleme başarısız",
      );
    }

    for (const r of data.resources ?? []) {
      if (!r.public_id || !(r.secure_url || r.url)) continue;
      out.push({
        publicId: r.public_id,
        url: r.secure_url ?? r.url!,
        bytes: r.bytes ?? 0,
        width: r.width ?? null,
        height: r.height ?? null,
        format: r.format ?? null,
        createdAt: r.created_at ?? null,
      });
    }

    nextCursor = data.next_cursor;
    if (!nextCursor) break;
  }

  return out;
}

export async function destroyCloudinaryAsset(publicId: string) {
  const { cloudName, apiKey, apiSecret } = requireCloudinaryConfig();
  const timestamp = String(Math.floor(Date.now() / 1000));
  const params = { public_id: publicId, timestamp };
  const signature = signParams(params, apiSecret);

  const body = new URLSearchParams({
    public_id: publicId,
    timestamp,
    api_key: apiKey,
    signature,
  });

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );
  const data = (await res.json()) as {
    result?: string;
    error?: { message?: string };
  };
  if (!res.ok || (data.result !== "ok" && data.result !== "not found")) {
    throw new Error(data.error?.message ?? "Cloudinary silme başarısız");
  }
}
