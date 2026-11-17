"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { assertIsAuthAccessError, requireAdmin } from "@/lib/auth/session";
import { writeAuditLog } from "@/server/audit";
import {
  deleteFaq,
  upsertFaq,
} from "@/server/repositories/faq-repository";
import { actionError, type ActionResult } from "./action-result";

function isNextRedirect(err: unknown) {
  return (
    !!err &&
    typeof err === "object" &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export async function saveFaqAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const id = String(formData.get("id") ?? "") || null;
    const faq = await upsertFaq(id, {
      question: String(formData.get("question") ?? ""),
      answerText: String(formData.get("answerText") ?? ""),
      position: Number(formData.get("position") ?? 0) || 0,
      published: formData.get("published") === "on",
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: id ? "update" : "create",
      entityType: "Faq",
      entityId: faq.id,
      metadata: { published: faq.published },
    });

    revalidatePath("/");
    revalidatePath("/admin/sss");
    redirect(`/admin/sss?saved=1`);
  } catch (err) {
    if (isNextRedirect(err)) throw err;
    if (assertIsAuthAccessError(err)) return actionError("Oturum gerekli");
    if (err instanceof ZodError) {
      return actionError(err.issues[0]?.message ?? "Geçersiz veri");
    }
    return actionError(
      "Kayıt başarısız. Veritabanı bağlantısını kontrol edin.",
    );
  }
}

export async function deleteFaqAction(formData: FormData) {
  const session = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await deleteFaq(id);
  await writeAuditLog({
    actorId: session.user.id,
    action: "delete",
    entityType: "Faq",
    entityId: id,
  });
  revalidatePath("/");
  revalidatePath("/admin/sss");
  redirect("/admin/sss");
}
