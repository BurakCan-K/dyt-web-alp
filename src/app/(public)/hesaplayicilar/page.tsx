import type { Metadata } from "next";
import { PageHero } from "@/components/site/PageHero";
import { ToolsHubClient } from "@/components/calculators/ToolsHubClient";
import { Container } from "@/components/ui/Container";
import { getPublicTools } from "@/lib/nutrition-tools/registry";
import { PAGE_SEO } from "@/data/site-defaults";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: PAGE_SEO.hesaplayicilar.title,
  description: PAGE_SEO.hesaplayicilar.description,
  path: "/hesaplayicilar",
});

export default function HesaplayicilarPage() {
  const tools = getPublicTools();

  return (
    <>
      <PageHero
        eyebrow="Araçlar"
        title="Beslenme hesaplayıcıları"
        description="Ölçüm, enerji ve besin araçları — tarayıcıda hesaplanır, kaydedilmez. Teşhis veya tedavi değildir."
      />
      <Container className="relative pb-space-xl">
        <div
          className="pointer-events-none absolute -right-20 top-0 h-56 w-56 rounded-full bg-primary-fixed/25 blur-3xl motion-reduce:hidden"
          aria-hidden
        />
        <ToolsHubClient tools={tools} />
      </Container>
    </>
  );
}
