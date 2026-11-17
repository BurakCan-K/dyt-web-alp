import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { loadPublicSiteSettings } from "@/lib/content/site-settings";

export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await loadPublicSiteSettings();

  return (
    <>
      <SiteHeader settings={settings} />
      <main id="main-content" className="flex-grow pt-20">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </>
  );
}
