import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Sayfa bulunamadı",
  description: "İstenen sayfa yok veya yayınlanmamış olabilir.",
  noIndex: true,
});

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-start justify-center py-space-xl">
      <p className="text-label-sm font-bold uppercase tracking-widest text-primary">
        404
      </p>
      <h1 className="mt-space-xs text-headline-lg text-on-surface">
        Sayfa bulunamadı
      </h1>
      <p className="mt-space-md max-w-xl text-body-md text-on-surface-variant">
        Aradığınız içerik yok veya henüz yayınlanmamış olabilir.
      </p>
      <div className="mt-space-lg flex flex-wrap gap-space-sm">
        <Button href="/">Ana sayfa</Button>
        <Button href="/blog" variant="secondary">
          Blog
        </Button>
      </div>
      <Link href="/iletisim" className="mt-space-md text-label-md text-primary">
        İletişim →
      </Link>
    </Container>
  );
}
