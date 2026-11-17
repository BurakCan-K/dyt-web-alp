import type { Metadata } from "next";
import { ApproachSection } from "@/components/site/ApproachSection";
import { ContactCta } from "@/components/site/ContactCta";
import { ContentPreviewSection } from "@/components/site/ContentPreviewSection";
import { FaqPreview } from "@/components/site/FaqPreview";
import { Hero } from "@/components/site/Hero";
import { HowItWorksSteps } from "@/components/site/HowItWorksSteps";
import { QuickBmiWidget } from "@/components/site/QuickBmiWidget";
import { ServicesPreview } from "@/components/site/ServicesPreview";
import { Container } from "@/components/ui/Container";
import { loadPublicFaqs, loadPublicServices } from "@/lib/content/public-source";
import { loadPublicSiteSettings } from "@/lib/content/site-settings";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await loadPublicSiteSettings();
  return buildMetadata({
    title: settings.metaTitle,
    description: settings.metaDescription,
    path: "/",
    brandName: settings.brandName,
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const [services, faqs, settings] = await Promise.all([
    loadPublicServices(),
    loadPublicFaqs(),
    loadPublicSiteSettings(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <QuickBmiWidget whatsappE164={settings.whatsappE164} />
      <ServicesPreview services={services} />
      <ApproachSection />
      <ContentPreviewSection />
      <HowItWorksSteps />
      <section className="py-space-xl" aria-labelledby="faq-heading">
        <Container>
          <div className="grid grid-cols-1 gap-space-xl lg:grid-cols-12">
            <div className="lg:col-span-6">
              <FaqPreview faqs={faqs} />
            </div>
            <div className="lg:col-span-6" id="iletisim-cta">
              <ContactCta settings={settings} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
