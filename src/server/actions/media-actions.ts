"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { destroyCloudinaryAsset } from "@/lib/media/cloudinary";
import { writeAuditLog } from "@/server/audit";
import {
  countMediaUsages,
  deleteMediaAssetRecord,
  getMediaAsset,
  updateMediaAlt,
} from "@/server/repositories/media-repository";

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
