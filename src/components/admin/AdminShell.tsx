import Link from "next/link";
import { logoutAction } from "@/server/actions/auth-actions";

const nav = [
  { href: "/admin", label: "Özet" },
  { href: "/admin/yazilar", label: "Yazılar" },
  { href: "/admin/tarifler", label: "Tarifler" },
  { href: "/admin/hizmetler", label: "Hizmetler" },
  { href: "/admin/rehberler", label: "Rehberler" },
  { href: "/admin/sss", label: "SSS" },
  { href: "/admin/medya", label: "Medya" },
  { href: "/admin/site-ayarlari", label: "Site ayarları" },
  { href: "/admin/hesap", label: "Hesap" },
];

type Props = {
  email: string;
  children: React.ReactNode;
};

export function AdminShell({ email, children }: Props) {
  return (
    <div className="min-h-screen bg-surface-container-low">
      <header className="border-b border-outline-variant/30 bg-surface">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-space-sm px-margin-mobile py-space-md lg:px-margin">
          <Link href="/admin" className="text-headline-sm text-primary">
            Admin paneli
          </Link>
          <div className="flex flex-wrap items-center gap-space-sm">
            <span className="text-body-sm text-on-surface-variant">{email}</span>
            <Link
              href="/"
              className="rounded-full bg-surface-container px-space-md py-space-xs text-label-sm text-on-surface hover:bg-surface-container-high"
            >
              Siteye dön
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-full bg-primary-container px-space-md py-space-xs text-label-sm text-on-primary hover:bg-primary"
              >
                Çıkış
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-space-lg px-margin-mobile py-space-lg lg:grid-cols-12 lg:px-margin">
        <aside className="lg:col-span-3">
          <nav
            aria-label="Admin menü"
            className="flex flex-row gap-space-xs overflow-x-auto rounded-3xl bg-surface p-space-sm shadow-sm lg:flex-col"
          >
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap rounded-2xl px-space-md py-space-sm text-label-md text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="mt-space-sm hidden text-body-sm text-on-surface-variant lg:block">
            CRUD modülleri Prompt 06–08&apos;de tamamlanır.
          </p>
        </aside>
        <main className="min-w-0 lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
