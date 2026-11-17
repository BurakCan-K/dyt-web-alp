import { cn } from "@/lib/cn";

const styles: Record<string, string> = {
  DRAFT: "bg-surface-container text-on-surface-variant",
  PUBLISHED: "bg-primary-fixed text-on-primary-fixed",
  ARCHIVED: "bg-secondary-fixed/50 text-on-secondary-fixed-variant",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "rounded-full px-space-sm py-0.5 text-label-sm",
        styles[status] ?? styles.DRAFT,
      )}
    >
      {status}
    </span>
  );
}
