"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export function FaqPreview({ faqs }: { faqs: FaqItem[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);
  const baseId = useId();

  if (faqs.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Henüz yayınlanmış SSS yok.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-space-md">
      <div className="flex flex-col gap-space-xs">
        <span className="text-label-sm font-bold uppercase tracking-widest text-primary">
          Merak edilenler
        </span>
        <h2 id="faq-heading" className="text-headline-lg text-on-surface">
          Sıkça sorulan sorular
        </h2>
        <p className="text-body-md text-on-surface-variant">
          SSS kayıtları admin panelinden yönetilir.
        </p>
      </div>

      <div className="space-y-space-sm pt-space-xs">
        {faqs.map((faq) => {
          const expanded = openId === faq.id;
          const panelId = `${baseId}-panel-${faq.id}`;
          const buttonId = `${baseId}-btn-${faq.id}`;

          return (
            <div
              key={faq.id}
              className="overflow-hidden rounded-2xl bg-surface-container-low transition-all"
            >
              <h3>
                <button
                  id={buttonId}
                  type="button"
                  className="flex w-full items-center justify-between gap-space-sm p-space-md text-left text-headline-sm text-on-surface"
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() => setOpenId(expanded ? null : faq.id)}
                >
                  <span>{faq.question}</span>
                  <span
                    className={cn(
                      "shrink-0 text-primary transition-transform motion-reduce:transition-none",
                      expanded && "rotate-180",
                    )}
                    aria-hidden
                  >
                    ▾
                  </span>
                </button>
              </h3>
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                hidden={!expanded}
                className="px-space-md pb-space-md text-body-sm leading-relaxed text-on-surface-variant"
              >
                {faq.answer}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
