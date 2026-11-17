import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/admin/LoginForm";
import { Card } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Admin Giriş",
  description: "Yönetim paneli girişi",
  path: "/admin/giris",
  noIndex: true,
});

export default async function AdminLoginPage() {
  const session = await auth();
  if (session?.user?.id && session.user.role === "OWNER") {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-margin-mobile py-space-xl">
      <Card className="w-full max-w-md">
        <p className="text-label-sm uppercase tracking-widest text-primary">
          Yönetim
        </p>
        <h1 className="mt-space-xs text-headline-md text-on-surface">
          Admin girişi
        </h1>
        <p className="mt-space-sm text-body-sm text-on-surface-variant">
          Yalnızca yetkili yönetici. Public kayıt yoktur. Veritabanı ve admin
          hesabı hazır değilse giriş başarısız olur.
        </p>
        <LoginForm />
        <p className="mt-space-md text-center text-body-sm text-on-surface-variant">
          <Link href="/" className="text-primary hover:underline">
            Siteye dön
          </Link>
        </p>
      </Card>
    </div>
  );
}
