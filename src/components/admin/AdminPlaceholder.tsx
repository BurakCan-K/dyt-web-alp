import { Card } from "@/components/ui/Card";

export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <Card>
      <h1 className="text-headline-md text-on-surface">{title}</h1>
      <p className="mt-space-sm text-body-md text-on-surface-variant">
        Modül iskeleti. CRUD Prompt 06–08&apos;de eklenecek. Bu sayfa yalnızca
        oturum açmış admin tarafından görülebilir.
      </p>
    </Card>
  );
}
