const DEFAULT_MESSAGE =
  "Merhaba, beslenme danışmanlığı ve görüşme süreci hakkında bilgi almak istiyorum.";

export type WhatsAppLinkResult =
  | { ready: true; href: string; label: string }
  | { ready: false; href: undefined; label: string; reason: string };

/**
 * E.164 benzeri numaradan wa.me URL üretir.
 * Numara yoksa CTA disable edilmeli — sahte başarı yok.
 */
export function buildWhatsAppLink(
  whatsappE164: string | null | undefined,
  message?: string,
): WhatsAppLinkResult {
  const digits = (whatsappE164 ?? "").replace(/\D/g, "");
  const text = message?.trim() || DEFAULT_MESSAGE;

  if (digits.length < 10) {
    return {
      ready: false,
      href: undefined,
      label: "WhatsApp yakında",
      reason: "Geçerli WhatsApp numarası tanımlı değil",
    };
  }

  const href = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  return {
    ready: true,
    href,
    label: "WhatsApp ile yazın",
  };
}

export { DEFAULT_MESSAGE as WHATSAPP_DEFAULT_MESSAGE };
