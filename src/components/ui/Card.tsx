import { cn } from "@/lib/cn";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl bg-surface-container-lowest p-space-lg shadow-[0_12px_32px_-4px_rgba(27,59,43,0.06)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
