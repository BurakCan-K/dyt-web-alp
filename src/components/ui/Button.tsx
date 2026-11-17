import Link from "next/link";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-primary-container text-on-primary hover:bg-primary shadow-md hover:-translate-y-0.5",
  secondary:
    "bg-surface-container-low text-tertiary hover:bg-surface-container",
  ghost:
    "bg-transparent text-primary border border-tertiary/30 hover:bg-primary/5",
};

type CommonProps = {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  disabled?: boolean;
};

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

export function Button({
  children,
  className,
  variant = "primary",
  disabled,
  ...rest
}: ButtonAsButton | ButtonAsLink) {
  const classes = cn(
    "inline-flex items-center justify-center gap-space-xs rounded-full px-space-lg py-space-sm text-label-md font-label transition-all duration-200 disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    className,
  );

  if ("href" in rest && rest.href) {
    const { href, target, rel } = rest;
    if (disabled) {
      return (
        <span className={classes} aria-disabled="true">
          {children}
        </span>
      );
    }
    return (
      <Link className={classes} href={href} target={target} rel={rel}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ButtonAsButton;
  return (
    <button className={classes} disabled={disabled} {...buttonProps}>
      {children}
    </button>
  );
}
