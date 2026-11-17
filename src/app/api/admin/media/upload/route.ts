import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { AuthAccessError } from "@/lib/auth/errors";
import { assertMediaConfigured, MediaConfigError } from "@/lib/media/config";
import { uploadToCloudinary } from "@/lib/media/cloudinary";
import {
  MediaValidationError,
  validateUploadFile,
} from "@/lib/media/validate-upload";
import { writeAuditLog } from "@/server/audit";
import { createMediaAsset } from "@/server/repositories/media-repository";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const session = await requireAdmin();
    assertMediaConfigured();

    const form = await request.formData();
    const file = form.get("file");
    const alt = String(form.get("alt") ?? "").trim().slice(0, 300);

    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Dosya gerekli" },
        { status: 400 },
      );
    }

    validateUploadFile({
      filename: file.name,
      mimeType: file.type || "application/octet-stream",
      bytes: file.size,
    });

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadToCloudinary({
      buffer,
      filename: file.name,
      mimeType: file.type,
      folder: "dyt-web",
    });

    const asset = await createMediaAsset({
      provider: "CLOUDINARY",
      providerPublicId: uploaded.publicId,
      url: uploaded.url,
      alt,
      mimeType: uploaded.mimeType,
      bytes: uploaded.bytes,
      width: uploaded.width,
      height: uploaded.height,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: "create",
      entityType: "MediaAsset",
      entityId: asset.id,
      metadata: {
        providerPublicId: asset.providerPublicId,
        bytes: asset.bytes,
      },
    });

    return NextResponse.json({
      ok: true,
      asset: {
        id: asset.id,
        url: asset.url,
        alt: asset.alt,
        mimeType: asset.mimeType,
        bytes: asset.bytes,
        width: asset.width,
        height: asset.height,
      },
    });
  } catch (err) {
    if (err instanceof AuthAccessError) {
      return NextResponse.json(
        { ok: false, error: "Oturum gerekli" },
        { status: 401 },
      );
    }
    if (err instanceof MediaConfigError || err instanceof MediaValidationError) {
      return NextResponse.json(
        { ok: false, error: err.message },
        { status: 400 },
      );
    }
    console.error("[media upload]", err);
    return NextResponse.json(
      {
        ok: false,
        error:
          "Yükleme başarısız. Cloudinary env ve ağ bağlantısını kontrol edin.",
      },
      { status: 500 },
    );
  }
}
