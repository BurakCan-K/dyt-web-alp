import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/auth/session";
import { buildAdminMetadata } from "@/lib/seo";

export const metadata: Metadata = buildAdminMetadata("Yönetim");

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/giris");
  }

  return (
    <AdminShell email={session.user.email ?? "admin"}>
      {children}
    </AdminShell>
  );
}
