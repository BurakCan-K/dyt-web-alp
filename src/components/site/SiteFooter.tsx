import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { PublicSiteSettings } from "@/lib/content/site-settings";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const links = [
  { href: "/hakkimda", label: "Hakkımda" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/blog", label: "Blog" },
  { href: "/tarifler", label: "Tarifler" },
  { href: "/beslenme-rehberleri", label: "Beslenme Rehberleri" },
  { href: "/hesaplayicilar", label: "Hesaplayıcılar" },
  { href: "/iletisim", label: "İletişim" },
];

type Props = {
  settings: PublicSiteSettings;
};

export function SiteFooter({ settings }: Props) {
  const wa = buildWhatsAppLink(settings.whatsappE164);

  return (
    <footer className="mt-auto bg-surface-container-low pt-space-xl pb-space-lg text-on-surface shadow-[0_-1px_8px_rgba(27,59,43,0.03)]">
      <Container>
        <div className="grid grid-cols-1 gap-space-xl pb-space-xl md:grid-cols-2 lg:grid-cols-12">
          <div className="flex flex-col gap-space-md lg:col-span-5">
            <span className="text-headline-sm text-primary">
              {settings.brandName}
            </span>
            <p className="text-body-md text-on-surface-variant">
              {settings.dietitianName} · {settings.professionalTitle}. Randevu
              takvimi, ödeme ve bülten aboneliği yoktur; iletişim WhatsApp,
              telefon veya e-posta ile yapılır.
            </p>
          </div>
          <div className="flex flex-col gap-space-md lg:col-span-3">
            <h2 className="text-headline-sm text-on-surface">İletişim</h2>
            <ul className="space-y-space-xs text-body-sm text-on-surface-variant">
              {wa.ready ? (
                <li>
                  <a
                    href={wa.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary"
                  >
                    WhatsApp
                  </a>
                </li>
              ) : null}
              {settings.phone ? (
                <li>
                  <a
                    href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                    className="hover:text-primary"
                  >
                    {settings.phone}
                  </a>
                </li>
              ) : null}
              {settings.email ? (
                <li>
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-primary"
                  >
                    {settings.email}
                  </a>
                </li>
              ) : null}
              {settings.address ? <li>{settings.address}</li> : null}
              {!settings.phone && !settings.email && !wa.ready ? (
                <li>İletişim bilgileri yayın öncesi tanımlanacak.</li>
              ) : null}
            </ul>
          </div>
          <div className="flex flex-col gap-space-md lg:col-span-4">
            <h2 className="text-headline-sm text-on-surface">Hızlı Erişim</h2>
            <nav className="flex flex-col gap-space-xs" aria-label="Footer">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-label-md text-on-surface-variant transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between gap-space-md border-t border-outline-variant/30 pt-space-lg md:flex-row">
          <div className="flex flex-wrap gap-x-space-md gap-y-space-xs text-label-sm text-on-surface-variant">
            <Link href="/kvkk-aydinlatma" className="hover:text-primary">
              KVKK Aydınlatma
            </Link>
            <Link href="/gizlilik" className="hover:text-primary">
              Gizlilik
            </Link>
            <Link href="/cerez-politikasi" className="hover:text-primary">
              Çerez Politikası
            </Link>
          </div>
          <p className="text-body-sm text-tertiary">
            © {new Date().getFullYear()} {settings.brandName}
          </p>
        </div>
      </Container>
    </footer>
  );
}
