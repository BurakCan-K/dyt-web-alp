import type { PublicSiteSettings } from "@/lib/content/site-settings";
import { buildPublishVerificationChecklist } from "@/lib/content/site-settings";

export function PublishChecklist({
  settings,
}: {
  settings: PublicSiteSettings;
}) {
  const items = buildPublishVerificationChecklist(settings);
  return (
    <section
      className="rounded-2xl bg-secondary-fixed/30 p-space-md"
      aria-labelledby="publish-check"
    >
      <h2 id="publish-check" className="text-headline-sm text-on-surface">
        Yayın doğrulama checklist
      </h2>
      <p className="mt-space-xs text-body-sm text-on-surface-variant">
        Fiyat, ücretsiz görüşme ve belgesiz diploma iddiaları boş bırakılmalı —
        verification required.
      </p>
      <ul className="mt-space-sm space-y-space-xs">
        {items.map((item) => (
          <li key={item.id} className="flex gap-space-sm text-body-sm">
            <span aria-hidden>{item.ok ? "✓" : "○"}</span>
            <span>
              {item.label}
              {"note" in item && item.note ? (
                <span className="block text-on-surface-variant">{item.note}</span>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
