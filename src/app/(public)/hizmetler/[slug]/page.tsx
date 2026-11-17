import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { RichTextView } from "@/components/content/RichTextView";
import { ContactChannels } from "@/components/site/ContactChannels";
import { Container } from "@/components/ui/Container";
import { SiteImage } from "@/components/ui/SiteImage";
import {
  loadPublicService,
  loadPublicServices,
} from "@/lib/content/public-source";
import { loadPublicSiteSettings } from "@/lib/content/site-settings";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const services = await loadPublicServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await loadPublicService(slug);
  if (!service) {
    return buildMetadata({ title: "Hizmet bulunamadı", noIndex: true });
  }
  return buildMetadata({
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.summary,
    path: `/hizmetler/${service.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    loadPublicService(slug),
    loadPublicSiteSettings(),
  ]);
  if (!service) notFound();

  const message = `Merhaba, "${service.title}" hizmeti hakkında bilgi almak istiyorum.`;

  return (
    <Container className="py-space-xl">
      <p className="text-label-sm font-bold uppercase tracking-widest text-primary">
        Hizmet
      </p>
      <h1 className="mt-space-xs text-headline-lg text-on-surface">
        {service.title}
      </h1>
      <p className="mt-space-md max-w-2xl text-body-lg text-on-surface-variant">
        {service.summary}
      </p>

      {service.tags.length > 0 ? (
        <ul className="mt-space-md flex flex-wrap gap-space-xs">
          {service.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-surface-container px-space-md py-space-xs text-label-sm text-on-surface-variant"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {service.imageUrl ? (
        <div className="relative mt-space-lg aspect-[16/9] w-full overflow-hidden rounded-3xl bg-surface-container">
          <SiteImage
            src={service.imageUrl}
            alt={service.imageAlt ?? service.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 960px"
          />
        </div>
      ) : null}

      <div className="mt-space-xl grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <div className="max-w-3xl space-y-space-md lg:col-span-7">
          <RichTextView doc={service.bodyDoc} />
        </div>
        <aside className="lg:col-span-5">
          <div className="sticky top-24 space-y-space-md">
            {service.highlights.length > 0 ? (
              <div className="rounded-3xl bg-surface-container-low p-space-lg">
                <h2 className="text-headline-sm text-on-surface">Özet kapsam</h2>
                <ul className="mt-space-sm space-y-space-xs text-body-sm text-on-surface-variant">
                  {service.highlights.map((h) => (
                    <li key={h.slice(0, 48)} className="flex gap-2">
                      <span className="text-primary" aria-hidden>
                        ✓
                      </span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="rounded-3xl bg-surface-container-lowest p-space-lg shadow-md">
              <h2 className="text-headline-sm text-on-surface">İletişim</h2>
              <p className="mt-space-xs text-body-sm text-on-surface-variant">
                Randevu takvimi yoktur. WhatsApp mesajına hizmet adı eklenir.
              </p>
              <ContactChannels
                className="mt-space-md"
                settings={settings}
                primaryLabel="WhatsApp ile bu hizmeti sorun"
                whatsappMessage={message}
              />
            </div>
          </div>
        </aside>
      </div>

      <Link
        href="/hizmetler"
        className="mt-space-lg inline-block text-label-md text-primary hover:underline"
      >
        ← Tüm hizmetler
      </Link>
    </Container>
  );
}
