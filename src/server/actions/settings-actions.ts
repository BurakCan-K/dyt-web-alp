"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { assertIsAuthAccessError, requireAdmin } from "@/lib/auth/session";
import { writeAuditLog } from "@/server/audit";
import { upsertSiteSettings } from "@/server/repositories/settings-repository";
import { actionError, type ActionResult } from "./action-result";

function isNextRedirect(err: unknown) {
  return (
    !!err &&
    typeof err === "object" &&
    "digest" in err &&
    String((err as { digest?: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

function emptyToNull(raw: FormDataEntryValue | null) {
  const s = String(raw ?? "").trim();
  return s || null;
}

function parseOpeningHours(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const days = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const idx = line.indexOf("|");
      if (idx === -1) return { label: line, hours: "" };
      return {
        label: line.slice(0, idx).trim(),
        hours: line.slice(idx + 1).trim(),
      };
    });
  return { days };
}

export async function saveSiteSettingsAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const session = await requireAdmin();
    const logoRaw = String(formData.get("logoMediaId") ?? "").trim();

    const settings = await upsertSiteSettings({
      brandName: String(formData.get("brandName") ?? ""),
      dietitianName: String(formData.get("dietitianName") ?? ""),
      professionalTitle: String(formData.get("professionalTitle") ?? ""),
      heroTitle: String(formData.get("heroTitle") ?? ""),
      heroSubtitle: String(formData.get("heroSubtitle") ?? ""),
      biography: emptyToNull(formData.get("biography")),
      phone: emptyToNull(formData.get("phone")),
      whatsappE164: emptyToNull(formData.get("whatsappE164")),
      email: emptyToNull(formData.get("email")),
      address: emptyToNull(formData.get("address")),
      mapUrl: emptyToNull(formData.get("mapUrl")),
      openingHoursJson: parseOpeningHours(formData.get("openingHours")),
      instagramUrl: emptyToNull(formData.get("instagramUrl")),
      metaTitle: String(formData.get("metaTitle") ?? ""),
      metaDescription: String(formData.get("metaDescription") ?? ""),
      logoMediaId: logoRaw || null,
    });

    await writeAuditLog({
      actorId: session.user.id,
      action: "update",
      entityType: "SiteSettings",
      entityId: settings.id,
      metadata: {
        brandName: settings.brandName,
        whatsapp: Boolean(settings.whatsappE164),
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/iletisim");
    revalidatePath("/hakkimda");
    revalidatePath("/admin/site-ayarlari");
    redirect("/admin/site-ayarlari?saved=1");
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
