import type { Metadata } from "next";
import { PasswordChangeForm } from "@/components/admin/PasswordChangeForm";
import { Card } from "@/components/ui/Card";
import { getAdminSession } from "@/lib/auth/session";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Hesap",
  path: "/admin/hesap",
  noIndex: true,
});

export default async function AdminAccountPage() {
  const session = await getAdminSession();

  return (
    <Card>
      <h1 className="text-headline-md text-on-surface">Hesap</h1>
      <p className="mt-space-sm text-body-md text-on-surface-variant">
        E-posta: <strong>{session?.user.email}</strong> (değişim CLI ile)
      </p>
      <h2 className="mt-space-lg text-headline-sm text-on-surface">
        Şifre değiştir
      </h2>
      <div className="mt-space-md">
        <PasswordChangeForm />
      </div>
    </Card>
  );
}
