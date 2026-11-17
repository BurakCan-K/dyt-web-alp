import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { PAGE_SEO } from "@/data/site-defaults";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: PAGE_SEO.kvkk.title,
  description: PAGE_SEO.kvkk.description,
  path: "/kvkk-aydinlatma",
  noIndex: true,
});

export default function KvkkPage() {
  return (
    <LegalPage
      title="KVKK Aydınlatma Metni"
      description={PAGE_SEO.kvkk.description}
    />
  );
}
