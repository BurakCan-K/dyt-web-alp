import { ContactChannels } from "@/components/site/ContactChannels";
import type { PublicSiteSettings } from "@/lib/content/site-settings";

type Props = {
  settings: PublicSiteSettings;
  whatsappMessage?: string;
};

/**
 * Sahte randevu formu yerine iletişim kanalları.
 */
export function ContactCta({ settings, whatsappMessage }: Props) {
  return (
    <div className="relative flex flex-col gap-space-md overflow-hidden rounded-3xl bg-surface-container-lowest p-space-lg shadow-xl lg:p-space-xl">
      <div
        className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-bl-full bg-primary-fixed/30"
        aria-hidden
      />
      <div className="relative flex flex-col gap-space-xs">
        <span className="text-label-sm font-bold uppercase tracking-widest text-secondary">
          İletişim
        </span>
        <h2 className="text-headline-md text-on-surface">
          WhatsApp, telefon veya e-posta
        </h2>
        <p className="text-body-sm text-on-surface-variant">
          Form gönderimi, otomatik randevu veya &quot;talebiniz alındı&quot;
          mesajı yoktur. Numaralar site ayarlarından tanımlanır.
        </p>
      </div>
      <ContactChannels
        settings={settings}
        primaryLabel="WhatsApp ile İletişime Geç"
        className="relative"
        whatsappMessage={whatsappMessage}
      />
    </div>
  );
}
