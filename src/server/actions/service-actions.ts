"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { assertIsAuthAccessError, requireAdmin } from "@/lib/auth/session";
import { EMPTY_DOC } from "@/lib/richtext/types";
import { slugify } from "@/lib/slug";
import { writeAuditLog } from "@/server/audit";
import {
  softDeleteService,
  upsertService,
} from "@/server/repositories/service-repository";
import { actionError, type ActionResult } from "./action-result";

function parseJsonField(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return EMPTY_DOC;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return EMPTY_DOC;
  }
}

function isNextRedirect(err: unknown) {
  return (
    !!err &&
    typeof err === "object" &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export async function saveServiceAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const id = String(formData.get("id") ?? "") || null;
    const title = String(formData.get("title") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const status = String(formData.get("status") ?? "DRAFT");

    const service = await upsertService(id, {
      slug: slugInput || slugify(title),
      title,
      summary: String(formData.get("summary") ?? ""),
      descriptionJson: parseJsonField(formData.get("descriptionJson")),
      position: Number(formData.get("position") ?? 0) || 0,
      isFeatured: formData.get("isFeatured") === "on",
      imageId: String(formData.get("imageId") ?? "").trim() || null,
      status,
      seoTitle: String(formData.get("seoTitle") ?? "") || null,
      seoDescription: String(formData.get("seoDescription") ?? "") || null,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: id ? "update" : "create",
      entityType: "Service",
      entityId: service.id,
      metadata: { status: service.status, slug: service.slug },
    });

    revalidatePath("/");
    revalidatePath("/hizmetler");
    revalidatePath(`/hizmetler/${service.slug}`);
    revalidatePath("/admin/hizmetler");
    redirect(`/admin/hizmetler/${service.id}?saved=1`);
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    if (assertIsAuthAccessError(err)) return actionError("Oturum gerekli");
    if (err instanceof ZodError) {
      return actionError(err.issues[0]?.message ?? "Geçersiz veri");
    }
    return actionError(
      "Kayıt başarısız. Veritabanı bağlantısını ve alanları kontrol edin.",
    );
  }
}

export async function deleteServiceAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const service = await softDeleteService(id);
  await writeAuditLog({
    actorId: session.user.id,
    action: "soft_delete",
    entityType: "Service",
    entityId: id,
  });
  revalidatePath("/");
  revalidatePath("/hizmetler");
  revalidatePath(`/hizmetler/${service.slug}`);
  revalidatePath("/admin/hizmetler");
  redirect("/admin/hizmetler");
}
