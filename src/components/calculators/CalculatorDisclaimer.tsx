import { cn } from "@/lib/cn";

type Props = {
  children?: React.ReactNode;
  className?: string;
};

export function CalculatorDisclaimer({ children, className }: Props) {
  return (
    <aside
      className={cn(
        "rounded-2xl border border-secondary/15 bg-secondary-fixed/35",
        "px-space-md py-space-md text-body-sm leading-relaxed text-on-secondary-fixed-variant",
        className,
      )}
      role="note"
    >
      {children ?? (
        <>
          Bu araç bilgilendirme amaçlıdır; teşhis, tedavi veya kişiye özel diyet
          reçetesi değildir. Girdiler yalnızca tarayıcınızda hesaplanır;
          sunucuya veya veritabanına kaydedilmez.
        </>
      )}
    </aside>
  );
}
