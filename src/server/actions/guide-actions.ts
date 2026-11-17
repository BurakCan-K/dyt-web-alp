"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { assertIsAuthAccessError, requireAdmin } from "@/lib/auth/session";
import { EMPTY_DOC } from "@/lib/richtext/types";
import { slugify } from "@/lib/slug";
import { writeAuditLog } from "@/server/audit";
import {
  softDeleteGuide,
  updateGuideStatus,
  upsertGuide,
} from "@/server/repositories/guide-repository";
import { actionError, actionOk, type ActionResult } from "./action-result";

function isNextRedirect(err: unknown) {
  return (
    !!err &&
    typeof err === "object" &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

function parseJsonField(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return EMPTY_DOC;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return EMPTY_DOC;
  }
}

function parseRelatedSlugs(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return [];
  return raw
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function parseMealPlan(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function saveGuideAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const idRaw = String(formData.get("id") ?? "");
    const id = idRaw || null;
    const title = String(formData.get("title") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const status = String(formData.get("status") ?? "DRAFT");

    const guide = await upsertGuide(id, {
      slug: slugInput || slugify(title),
      title,
      intro: String(formData.get("intro") ?? ""),
      contentJson: parseJsonField(formData.get("contentJson")),
      mealPlanJson: parseMealPlan(formData.get("mealPlanJson")),
      relatedRecipeSlugsJson: parseRelatedSlugs(
        formData.get("relatedRecipeSlugs"),
      ),
      coverMediaId: String(formData.get("coverMediaId") ?? "").trim() || null,
      status,
      seoTitle: String(formData.get("seoTitle") ?? "") || null,
      seoDescription: String(formData.get("seoDescription") ?? "") || null,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: id ? "update" : "create",
      entityType: "NutritionGuide",
      entityId: guide.id,
      metadata: { status: guide.status, slug: guide.slug },
    });

    revalidatePath("/beslenme-rehberleri");
    revalidatePath(`/beslenme-rehberleri/${guide.slug}`);
    revalidatePath("/admin/rehberler");
    redirect(`/admin/rehberler/${guide.id}?saved=1`);
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

export async function deleteGuideAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const guide = await softDeleteGuide(id);
  await writeAuditLog({
    actorId: session.user.id,
    action: "soft_delete",
    entityType: "NutritionGuide",
    entityId: id,
  });
  revalidatePath("/beslenme-rehberleri");
  revalidatePath(`/beslenme-rehberleri/${guide.slug}`);
  revalidatePath("/admin/rehberler");
  redirect("/admin/rehberler");
}

export async function setGuideStatusAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "DRAFT") as
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";
  if (!id) return;

  const guide = await updateGuideStatus(id, status);
  await writeAuditLog({
    actorId: session.user.id,
    action: "status_change",
    entityType: "NutritionGuide",
    entityId: id,
    metadata: { status },
  });
  revalidatePath("/beslenme-rehberleri");
  revalidatePath(`/beslenme-rehberleri/${guide.slug}`);
  revalidatePath("/admin/rehberler");
  redirect("/admin/rehberler");
}

export async function setGuideStatusResult(
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const id = String(formData.get("id") ?? "");
    const status = String(formData.get("status") ?? "DRAFT") as
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED";
    if (!id) return actionError("Eksik id");
    const guide = await updateGuideStatus(id, status);
    await writeAuditLog({
      actorId: session.user.id,
      action: "status_change",
      entityType: "NutritionGuide",
      entityId: id,
      metadata: { status },
    });
    revalidatePath("/beslenme-rehberleri");
    revalidatePath(`/beslenme-rehberleri/${guide.slug}`);
    return actionOk(id, `Durum: ${status}`);
  } catch (err) {
    if (assertIsAuthAccessError(err)) return actionError("Oturum gerekli");
    return actionError("Durum güncellenemedi");
  }
}
