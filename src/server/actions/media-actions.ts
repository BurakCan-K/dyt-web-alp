"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import {
  destroyCloudinaryAsset,
  listCloudinaryImages,
} from "@/lib/media/cloudinary";
import { writeAuditLog } from "@/server/audit";
import {
  countMediaUsages,
  deleteMediaAssetRecord,
  getMediaAsset,
  updateMediaAlt,
  upsertCloudinaryMediaAsset,
} from "@/server/repositories/media-repository";

export async function syncCloudinaryMediaAction() {
  const session = await requireAdmin();
  const resources = await listCloudinaryImages({ folder: "dyt-web" });
  let created = 0;
  let updated = 0;

  for (const r of resources) {
    const result = await upsertCloudinaryMediaAsset({
      providerPublicId: r.publicId,
      url: r.url,
      alt: r.publicId.split("/").pop() ?? r.publicId,
      mimeType: r.format ? `image/${r.format}` : "image/jpeg",
      bytes: r.bytes,
      width: r.width,
      height: r.height,
    });
    if (result.created) created += 1;
    else updated += 1;
  }

  await writeAuditLog({
    actorId: session.user.id,
    action: "update",
    entityType: "MediaAsset",
    entityId: "cloudinary-sync",
    metadata: { folder: "dyt-web", total: resources.length, created, updated },
  });

  revalidatePath("/admin/medya");
  redirect(
    `/admin/medya?synced=1&total=${resources.length}&created=${created}&updated=${updated}`,
  );
}

export async function updateMediaAltAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const alt = String(formData.get("alt") ?? "").trim();
  if (!id) return;
  await updateMediaAlt(id, alt);
  await writeAuditLog({
    actorId: session.user.id,
    action: "update",
    entityType: "MediaAsset",
    entityId: id,
    metadata: { alt },
  });
  revalidatePath("/admin/medya");
  redirect("/admin/medya?saved=1");
}

export async function deleteUnusedMediaAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  const asset = await getMediaAsset(id);
  if (!asset) redirect("/admin/medya?error=not_found");

  const usage = await countMediaUsages(id);
  if (usage.total > 0) {
    redirect("/admin/medya?error=in_use");
  }

  if (asset.provider === "CLOUDINARY") {
    await destroyCloudinaryAsset(asset.providerPublicId);
  }

  await deleteMediaAssetRecord(id);
  await writeAuditLog({
    actorId: session.user.id,
    action: "delete",
    entityType: "MediaAsset",
    entityId: id,
    metadata: { providerPublicId: asset.providerPublicId },
  });
  revalidatePath("/admin/medya");
  redirect("/admin/medya?deleted=1");
}
