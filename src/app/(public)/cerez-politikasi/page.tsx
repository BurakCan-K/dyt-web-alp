import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { PAGE_SEO } from "@/data/site-defaults";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: PAGE_SEO.cerez.title,
  description: PAGE_SEO.cerez.description,
  path: "/cerez-politikasi",
  noIndex: true,
});

export default function CerezPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      description={PAGE_SEO.cerez.description}
    />
  );
}
