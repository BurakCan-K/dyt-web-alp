import { cn } from "@/lib/cn";

type Segment = { from: number; to: number; label: string };

type Props = {
  value: number;
  min: number;
  max: number;
  label: string;
  /** Opsiyonel renk bantları (metinle birlikte) */
  segments?: Segment[];
  className?: string;
};

export function RangeBar({
  value,
  min,
  max,
  label,
  segments,
  className,
}: Props) {
  const span = max - min || 1;
  const pct = Math.min(100, Math.max(0, ((value - min) / span) * 100));

  return (
    <div className={cn("space-y-space-md", className)}>
      <p className="text-body-md text-on-surface">
        Değer:{" "}
        <strong className="font-display text-headline-sm text-primary">
          {value}
        </strong>
        <span className="mt-1 block text-body-sm text-on-surface-variant">
          {label}
        </span>
      </p>

      <div className="space-y-space-xs">
        {segments && segments.length > 0 ? (
          <div
            className="flex h-3 overflow-hidden rounded-full"
            role="img"
            aria-label={`${label}: ${value}`}
          >
            {segments.map((s, i) => {
              const w = ((s.to - s.from) / span) * 100;
              const tones = [
                "bg-primary-fixed-dim/70",
                "bg-primary/35",
                "bg-secondary-container/55",
                "bg-secondary/40",
              ];
              return (
                <div
                  key={`${s.from}-${s.to}`}
                  className={cn("h-full", tones[i % tones.length])}
                  style={{ width: `${w}%` }}
                  title={s.label}
                />
              );
            })}
          </div>
        ) : (
          <div
            className="h-3 rounded-full bg-surface-container"
            role="img"
            aria-label={`${label}: ${value}`}
          />
        )}

        <div className="relative h-0">
          <div
            className="absolute top-[-1.15rem] flex -translate-x-1/2 flex-col items-center"
            style={{ left: `${pct}%` }}
          >
            <span className="h-4 w-4 rounded-full border-2 border-surface-container-lowest bg-primary shadow-sm" />
          </div>
        </div>

        <div className="flex justify-between pt-space-sm text-label-sm text-on-surface-variant">
          <span>{min}</span>
          <span>{max}</span>
        </div>

        {segments ? (
          <ul className="flex flex-wrap gap-x-space-md gap-y-1 text-label-sm text-on-surface-variant">
            {segments.map((s) => (
              <li key={s.label}>
                {s.from}–{s.to}: {s.label}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
