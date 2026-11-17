"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { assertIsAuthAccessError, requireAdmin } from "@/lib/auth/session";
import { EMPTY_DOC } from "@/lib/richtext/types";
import { slugify } from "@/lib/slug";
import { writeAuditLog } from "@/server/audit";
import {
  ensurePostCategory,
  softDeleteBlogPost,
  updateBlogPostStatus,
  upsertBlogPost,
} from "@/server/repositories/blog-repository";
import { actionError, actionOk, type ActionResult } from "./action-result";

function parseJsonField(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return EMPTY_DOC;
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return EMPTY_DOC;
  }
}

function parseTags(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return [];
  return raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 20);
}

function parseReferences(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return [];
  return raw
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 30);
}

function isNextRedirect(err: unknown) {
  return (
    !!err &&
    typeof err === "object" &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export async function saveBlogPostAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const idRaw = String(formData.get("id") ?? "");
    const id = idRaw || null;
    const title = String(formData.get("title") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const categoryCustom = String(
      formData.get("categoryTitleCustom") ?? "",
    ).trim();
    const categoryTitle =
      categoryCustom || String(formData.get("categoryTitle") ?? "").trim();

    let categoryId: string | null = null;
    if (categoryTitle) {
      const cat = await ensurePostCategory(categoryTitle);
      categoryId = cat.id;
    }

    const status = String(formData.get("status") ?? "DRAFT");
    const post = await upsertBlogPost(id, {
      slug: slugInput || slugify(title),
      title,
      excerpt: String(formData.get("excerpt") ?? ""),
      contentJson: parseJsonField(formData.get("contentJson")),
      categoryId,
      coverMediaId: String(formData.get("coverMediaId") ?? "").trim() || null,
      tagsJson: parseTags(formData.get("tags")),
      referencesJson: parseReferences(formData.get("references")),
      status,
      seoTitle: String(formData.get("seoTitle") ?? "") || null,
      seoDescription: String(formData.get("seoDescription") ?? "") || null,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: id ? "update" : "create",
      entityType: "BlogPost",
      entityId: post.id,
      metadata: { status: post.status, slug: post.slug },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/yazilar");
    redirect(`/admin/yazilar/${post.id}?saved=1`);
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

export async function deleteBlogPostAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const post = await softDeleteBlogPost(id);
  await writeAuditLog({
    actorId: session.user.id,
    action: "soft_delete",
    entityType: "BlogPost",
    entityId: id,
  });
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/yazilar");
  redirect("/admin/yazilar");
}

export async function setBlogPostStatusAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "DRAFT") as
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";
  if (!id) return;

  const post = await updateBlogPostStatus(id, status);
  await writeAuditLog({
    actorId: session.user.id,
    action: "status_change",
    entityType: "BlogPost",
    entityId: id,
    metadata: { status },
  });
  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/yazilar");
  redirect("/admin/yazilar");
}

/** Test yardımcısı — form action void döner; sonuç için bunu kullan */
export async function setBlogPostStatusResult(
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
    const post = await updateBlogPostStatus(id, status);
    await writeAuditLog({
      actorId: session.user.id,
      action: "status_change",
      entityType: "BlogPost",
      entityId: id,
      metadata: { status },
    });
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return actionOk(id, `Durum: ${status}`);
  } catch (err) {
    if (assertIsAuthAccessError(err)) return actionError("Oturum gerekli");
    return actionError("Durum güncellenemedi");
  }
}
