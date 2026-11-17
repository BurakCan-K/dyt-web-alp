import { cn } from "@/lib/cn";

export const fieldClass = cn(
  "w-full rounded-2xl border border-outline-variant/35 bg-surface-container-lowest",
  "px-space-md py-3 text-body-md text-on-surface shadow-none",
  "transition-[border-color,box-shadow] duration-200",
  "placeholder:text-on-surface-variant/50",
  "focus:border-primary/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/25",
);

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-body-sm text-error">
      {message}
    </p>
  );
}

export function ResultPanel({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-outline-variant/25",
        "bg-gradient-to-br from-surface-container-lowest via-surface-container-lowest to-primary-fixed/20",
        "p-space-lg shadow-sm",
        className,
      )}
      aria-live="polite"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl motion-reduce:hidden"
        aria-hidden
      />
      <h3 className="relative text-label-sm font-bold uppercase tracking-[0.14em] text-tertiary">
        {title}
      </h3>
      <div className="relative mt-space-md">{children}</div>
    </div>
  );
}

/** Büyük sayı + etiket sonuç kartı */
export function ResultHero({
  value,
  unit,
  label,
  hint,
  className,
}: {
  value: string;
  unit?: string;
  label: string;
  hint?: string;
  className?: string;
}) {
  return (
    <ResultPanel title="Sonuç" className={className}>
      <div className="flex flex-wrap items-end gap-x-space-sm gap-y-1">
        <p className="font-display text-[clamp(2.75rem,8vw,4.25rem)] leading-none tracking-tight text-primary">
          {value}
        </p>
        {unit ? (
          <span className="mb-2 text-headline-sm text-on-surface-variant">
            {unit}
          </span>
        ) : null}
      </div>
      <p className="mt-space-md text-headline-sm text-on-surface">{label}</p>
      {hint ? (
        <p className="mt-space-xs max-w-prose text-body-sm text-on-surface-variant">
          {hint}
        </p>
      ) : null}
    </ResultPanel>
  );
}

export function CalcFormCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.75rem] border border-outline-variant/30 bg-surface-container-lowest/90",
        "p-space-lg backdrop-blur-sm md:p-space-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Sonuç içi küçük metrik kutusu */
export function MetricTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}) {
  return (
    <div className="rounded-2xl bg-primary/5 px-space-md py-space-md">
      <p className="text-label-sm text-tertiary">{label}</p>
      <p className="mt-1 font-display text-headline-md text-primary">
        {value}
        {unit ? (
          <span className="ml-1 text-body-md text-on-surface-variant">
            {unit}
          </span>
        ) : null}
      </p>
    </div>
  );
}

export const choiceCardClass = cn(
  "flex cursor-pointer items-center gap-space-sm rounded-2xl border border-outline-variant/35",
  "bg-surface-container-lowest px-space-md py-3 text-body-sm text-on-surface",
  "transition-colors has-[:checked]:border-primary/40 has-[:checked]:bg-primary/5",
);
