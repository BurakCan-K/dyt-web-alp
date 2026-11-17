import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { PAGE_SEO } from "@/data/site-defaults";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: PAGE_SEO.gizlilik.title,
  description: PAGE_SEO.gizlilik.description,
  path: "/gizlilik",
  noIndex: true,
});

export default function GizlilikPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      description={PAGE_SEO.gizlilik.description}
    />
  );
}
