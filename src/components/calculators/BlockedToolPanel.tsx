import { Button } from "@/components/ui/Button";
import { CalcFormCard } from "@/components/calculators/field";
import type { NutritionTool } from "@/lib/nutrition-tools/types";

export function BlockedToolPanel({ tool }: { tool: NutritionTool }) {
  return (
    <CalcFormCard className="border-dashed border-outline/40 bg-surface-container/60">
      <p className="text-label-sm font-bold uppercase tracking-[0.14em] text-tertiary">
        Erişim kapalı
      </p>
      <h2 className="mt-space-sm text-headline-sm text-on-surface">
        Bu araç sitede açılamaz
      </h2>
      <p className="mt-space-sm text-body-md leading-relaxed text-on-surface-variant">
        {tool.summary}
      </p>
      <ul className="mt-space-md space-y-space-xs border-l-2 border-secondary/30 pl-space-md text-body-sm text-on-surface-variant">
        {tool.limits.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>
      {tool.externalHref ? (
        <Button
          href={tool.externalHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-space-lg w-fit"
        >
          Resmi kaynağa git
        </Button>
      ) : (
        <p className="mt-space-lg text-body-sm text-on-surface-variant">
          Gerekli veri tablosu veya lisans tamamlanınca etkinleştirilecektir.
        </p>
      )}
    </CalcFormCard>
  );
}
