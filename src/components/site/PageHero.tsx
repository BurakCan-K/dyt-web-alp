import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/cn";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  children,
}: Props) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div
        className="pointer-events-none absolute -top-24 -left-16 h-64 w-64 rounded-full bg-primary-fixed/20 blur-3xl motion-reduce:hidden"
        aria-hidden
      />
      <Container className="relative pt-space-lg pb-space-md lg:pt-space-xl">
        {eyebrow ? (
          <span className="text-label-sm font-bold uppercase tracking-widest text-primary">
            {eyebrow}
          </span>
        ) : null}
        <h1 className="mt-space-xs text-headline-lg text-on-surface">{title}</h1>
        {description ? (
          <p className="mt-space-md max-w-2xl text-body-lg text-on-surface-variant">
            {description}
          </p>
        ) : null}
        {children}
      </Container>
    </div>
  );
}
