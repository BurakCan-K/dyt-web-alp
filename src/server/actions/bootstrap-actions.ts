"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { writeAuditLog } from "@/server/audit";
import { runLaunchSeed } from "@/server/bootstrap/launch-seed";

/**
 * Canlıya ilk kurulum: örnek blog/hizmet/tarif/rehber/SSS.
 * Birden fazla kez çalıştırılabilir (upsert); AdminUser dokunulmaz.
 */
export async function runLaunchSeedAction(formData: FormData) {
  const session = await requireAdmin();
  const confirm = String(formData.get("confirm") ?? "");
  if (confirm !== "SEED") {
    redirect("/admin?seed_error=confirm");
  }

  const result = await runLaunchSeed(prisma);
  await writeAuditLog({
    actorId: session.user.id,
    action: "update",
    entityType: "SiteSettings",
    entityId: "launch-seed",
    metadata: result,
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/yazilar");
  revalidatePath("/admin/tarifler");
  revalidatePath("/admin/hizmetler");
  revalidatePath("/admin/rehberler");
  revalidatePath("/admin/sss");
  revalidatePath("/admin/medya");
  redirect(
    `/admin?seeded=1&posts=${result.posts}&services=${result.services}&recipes=${result.recipes}`,
  );
}
