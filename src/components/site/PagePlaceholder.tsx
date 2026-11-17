import { Container } from "@/components/ui/Container";
import { EXAMPLE_BANNER } from "@/data/fixtures";

type Props = {
  title: string;
  description?: string;
};

export function PagePlaceholder({ title, description }: Props) {
  return (
    <Container className="py-space-xl">
      <p className="mb-space-md w-fit rounded-full bg-secondary-fixed/50 px-space-md py-space-xs text-label-sm text-on-secondary-fixed-variant">
        {EXAMPLE_BANNER}
      </p>
      <h1 className="text-headline-lg text-on-surface">{title}</h1>
      <p className="mt-space-md max-w-2xl text-body-lg text-on-surface-variant">
        {description ??
          "Bu sayfa Prompt 03'te tam şablonla genişletilecek. Menü bağlantısı çalışır durumda."}
      </p>
    </Container>
  );
}
