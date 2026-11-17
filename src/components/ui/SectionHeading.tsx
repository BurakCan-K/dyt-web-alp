import { cn } from "@/lib/cn";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex max-w-3xl flex-col gap-space-xs",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <span className="text-label-sm font-bold uppercase tracking-widest text-primary">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-headline-lg text-on-surface">{title}</h2>
      {description ? (
        <p className="text-body-md text-on-surface-variant">{description}</p>
      ) : null}
    </div>
  );
}
