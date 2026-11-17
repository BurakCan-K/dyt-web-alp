import { Button } from "@/components/ui/Button";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export type ContactSettingsInput = {
  whatsappE164: string | null;
  phone: string | null;
  email: string | null;
};

type Props = {
  settings: ContactSettingsInput;
  primaryLabel?: string;
  className?: string;
  compact?: boolean;
  showNote?: boolean;
  whatsappMessage?: string;
};

export function ContactChannels({
  settings,
  primaryLabel = "WhatsApp ile İletişime Geç",
  className,
  compact = false,
  showNote = true,
  whatsappMessage,
}: Props) {
  const wa = buildWhatsAppLink(settings.whatsappE164, whatsappMessage);
  const phoneHref = settings.phone
    ? `tel:${settings.phone.replace(/[^\d+]/g, "")}`
    : null;
  const mailHref = settings.email ? `mailto:${settings.email}` : null;

  return (
    <div className={className}>
      <div className="flex flex-col gap-space-sm sm:flex-row sm:flex-wrap">
        {wa.ready ? (
          <Button href={wa.href} target="_blank" rel="noopener noreferrer">
            {primaryLabel}
          </Button>
        ) : (
          <Button disabled variant="secondary" title={wa.reason}>
            WhatsApp yakında
          </Button>
        )}
        {!compact || phoneHref ? (
          phoneHref ? (
            <Button href={phoneHref} variant="secondary">
              Telefon
            </Button>
          ) : !compact ? (
            <Button disabled variant="ghost" title="Telefon henüz tanımlı değil">
              Telefon yakında
            </Button>
          ) : null
        ) : null}
        {!compact || mailHref ? (
          mailHref ? (
            <Button href={mailHref} variant="ghost">
              E-posta
            </Button>
          ) : !compact ? (
            <Button disabled variant="ghost" title="E-posta henüz tanımlı değil">
              E-posta yakında
            </Button>
          ) : null
        ) : null}
      </div>
      {showNote ? (
        <p className="mt-space-sm text-body-sm text-on-surface-variant">
          Online randevu takvimi veya ödeme formu yoktur. WhatsApp bağlantısı
          harici uygulamayı (wa.me) açar; sitede randevu oluşturulmaz.
        </p>
      ) : null}
    </div>
  );
}
