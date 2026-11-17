type Props = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <div
      role="status"
      className="rounded-3xl bg-surface-container-low px-space-lg py-space-xl text-center"
    >
      <p className="text-headline-sm text-on-surface">{title}</p>
      {description ? (
        <p className="mt-space-sm text-body-md text-on-surface-variant">
          {description}
        </p>
      ) : null}
    </div>
  );
}
