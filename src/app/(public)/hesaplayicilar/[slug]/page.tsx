import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalculatorShell } from "@/components/calculators/CalculatorShell";
import { ToolFormRouter } from "@/components/calculators/ToolFormRouter";
import { getPublicTools, getToolBySlug } from "@/lib/nutrition-tools/registry";
import { loadPublicSiteSettings } from "@/lib/content/site-settings";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getPublicTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return buildMetadata({ title: "Araç bulunamadı", noIndex: true });
  return buildMetadata({
    title: tool.title,
    description: tool.summary,
    path: `/hesaplayicilar/${tool.slug}`,
  });
}

export default async function CalculatorToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  const settings = await loadPublicSiteSettings();

  return (
    <CalculatorShell tool={tool} settings={settings}>
      <ToolFormRouter tool={tool} />
    </CalculatorShell>
  );
}
