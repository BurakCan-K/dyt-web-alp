"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";
import type { PublicSiteSettings } from "@/lib/content/site-settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const nav = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/tarifler", label: "Tarifler" },
  { href: "/blog", label: "Blog" },
  { href: "/hesaplayicilar", label: "Hesaplayıcılar" },
  { href: "/iletisim", label: "İletişim" },
];

type Props = {
  settings: PublicSiteSettings;
};

export function SiteHeader({ settings }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const wa = buildWhatsAppLink(settings.whatsappE164);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-outline-variant/20 bg-surface/85 shadow-[0_1px_8px_rgba(27,59,43,0.06)] backdrop-blur-xl">
      <Container className="flex h-20 items-center justify-between gap-space-md">
        <Link href="/" className="flex items-center gap-space-sm">
          {settings.logoUrl ? (
            // next/image uzak host: next.config remotePatterns (Cloudinary)
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={settings.logoUrl}
              alt={settings.logoAlt || settings.brandName}
              width={140}
              height={40}
              className="h-10 w-auto max-w-[140px] object-contain"
              decoding="async"
            />
          ) : null}
          <span className="flex flex-col">
            <span className="text-headline-sm leading-none tracking-tight text-primary">
              {settings.brandName}
            </span>
            <span className="hidden text-label-sm uppercase tracking-wide text-tertiary sm:block">
              {settings.professionalTitle}
            </span>
          </span>
        </Link>

        <nav
          className="hidden items-center gap-space-xs xl:flex"
          aria-label="Ana menü"
        >
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-space-md py-space-xs text-label-md transition-colors",
                  active
                    ? "bg-primary-container font-semibold text-on-primary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-space-sm">
          {wa.ready ? (
            <Button
              href={wa.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex"
            >
              WhatsApp
            </Button>
          ) : null}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-low text-primary xl:hidden"
            aria-expanded={open}
            aria-controls={panelId}
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden className="text-label-lg">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </Container>

      <div
        id={panelId}
        hidden={!open}
        className="border-t border-outline-variant/20 bg-surface xl:hidden"
      >
        <Container className="flex flex-col gap-space-xs py-space-md">
          <nav aria-label="Mobil menü" className="flex flex-col gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-2xl px-space-md py-space-sm text-label-md text-on-surface hover:bg-surface-container-low"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {wa.ready ? (
            <Button
              href={wa.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-space-sm w-full"
            >
              WhatsApp ile İletişime Geç
            </Button>
          ) : (
            <Button disabled variant="secondary" className="mt-space-sm w-full">
              WhatsApp yakında
            </Button>
          )}
        </Container>
      </div>
    </header>
  );
}
