"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { assertIsAuthAccessError, requireAdmin } from "@/lib/auth/session";
import {
  parseLinesField,
  parseStepsField,
  stepsToInstructionsJson,
} from "@/lib/recipe/instructions";
import { parseManualNutrients } from "@/lib/recipe/nutrients";
import { slugify } from "@/lib/slug";
import { writeAuditLog } from "@/server/audit";
import {
  ensureRecipeCategory,
  softDeleteRecipe,
  updateRecipeStatus,
  upsertRecipe,
} from "@/server/repositories/recipe-repository";
import { actionError, actionOk, type ActionResult } from "./action-result";

function isNextRedirect(err: unknown) {
  return (
    !!err &&
    typeof err === "object" &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

function parseIngredients(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((row, index) => {
        const r = row as Record<string, unknown>;
        const qty = Number(r.quantityDecimal ?? r.quantity);
        return {
          position: typeof r.position === "number" ? r.position : index,
          name: String(r.name ?? "").trim(),
          quantityDecimal: qty,
          unit: String(r.unit ?? "").trim(),
          note: r.note ? String(r.note).trim() : null,
        };
      })
      .filter(
        (row) =>
          row.name.length > 0 &&
          Number.isFinite(row.quantityDecimal) &&
          row.quantityDecimal > 0 &&
          row.unit.length > 0,
      )
      .map((row, index) => ({ ...row, position: index }));
  } catch {
    return [];
  }
}

export async function saveRecipeAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const idRaw = String(formData.get("id") ?? "");
    const id = idRaw || null;
    const title = String(formData.get("title") ?? "").trim();
    const slugInput = String(formData.get("slug") ?? "").trim();
    const categoryTitle = String(formData.get("categoryTitle") ?? "").trim();

    let categoryId: string | null = null;
    if (categoryTitle) {
      const cat = await ensureRecipeCategory(categoryTitle);
      categoryId = cat.id;
    }

    const { nutrients, source } = parseManualNutrients({
      kcal: String(formData.get("kcal") ?? ""),
      proteinG: String(formData.get("proteinG") ?? ""),
      carbG: String(formData.get("carbG") ?? ""),
      fatG: String(formData.get("fatG") ?? ""),
      source: String(formData.get("nutrientSource") ?? ""),
    });

    const status = String(formData.get("status") ?? "DRAFT");
    const recipe = await upsertRecipe(id, {
      slug: slugInput || slugify(title),
      title,
      excerpt: String(formData.get("excerpt") ?? ""),
      instructionsJson: stepsToInstructionsJson(
        parseStepsField(formData.get("steps")),
        {
          difficulty: String(formData.get("difficulty") ?? ""),
          tips: parseLinesField(formData.get("tips")),
          allergens: parseLinesField(formData.get("allergens")),
        },
      ),
      servingCount: Number(formData.get("servingCount") ?? 1),
      prepMinutes: Number(formData.get("prepMinutes") ?? 0),
      cookMinutes: Number(formData.get("cookMinutes") ?? 0),
      nutrientsPerServingJson: nutrients,
      nutrientSource: source,
      categoryId,
      coverMediaId: String(formData.get("coverMediaId") ?? "").trim() || null,
      status,
      seoTitle: String(formData.get("seoTitle") ?? "") || null,
      seoDescription: String(formData.get("seoDescription") ?? "") || null,
      ingredients: parseIngredients(formData.get("ingredientsJson")),
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: id ? "update" : "create",
      entityType: "Recipe",
      entityId: recipe.id,
      metadata: { status: recipe.status, slug: recipe.slug },
    });

    revalidatePath("/tarifler");
    revalidatePath(`/tarifler/${recipe.slug}`);
    revalidatePath("/admin/tarifler");
    redirect(`/admin/tarifler/${recipe.id}?saved=1`);
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    if (assertIsAuthAccessError(err)) return actionError("Oturum gerekli");
    if (err instanceof ZodError) {
      return actionError(err.issues[0]?.message ?? "Geçersiz veri");
    }
    if (err instanceof Error && err.message.includes("Besin")) {
      return actionError(err.message);
    }
    return actionError(
      "Kayıt başarısız. Veritabanı bağlantısını ve alanları kontrol edin.",
    );
  }
}

export async function deleteRecipeAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const recipe = await softDeleteRecipe(id);
  await writeAuditLog({
    actorId: session.user.id,
    action: "soft_delete",
    entityType: "Recipe",
    entityId: id,
  });
  revalidatePath("/tarifler");
  revalidatePath(`/tarifler/${recipe.slug}`);
  revalidatePath("/admin/tarifler");
  redirect("/admin/tarifler");
}

export async function setRecipeStatusAction(formData: FormData): Promise<void> {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "DRAFT") as
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";
  if (!id) return;

  const recipe = await updateRecipeStatus(id, status);
  await writeAuditLog({
    actorId: session.user.id,
    action: "status_change",
    entityType: "Recipe",
    entityId: id,
    metadata: { status },
  });
  revalidatePath("/tarifler");
  revalidatePath(`/tarifler/${recipe.slug}`);
  revalidatePath("/admin/tarifler");
  redirect("/admin/tarifler");
}

export async function setRecipeStatusResult(
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
    const recipe = await updateRecipeStatus(id, status);
    await writeAuditLog({
      actorId: session.user.id,
      action: "status_change",
      entityType: "Recipe",
      entityId: id,
      metadata: { status },
    });
    revalidatePath("/tarifler");
    revalidatePath(`/tarifler/${recipe.slug}`);
    return actionOk(id, `Durum: ${status}`);
  } catch (err) {
    if (assertIsAuthAccessError(err)) return actionError("Oturum gerekli");
    return actionError("Durum güncellenemedi");
  }
}
