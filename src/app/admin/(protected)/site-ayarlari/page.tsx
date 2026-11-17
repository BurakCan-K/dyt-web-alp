import { PublishChecklist } from "@/components/admin/PublishChecklist";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/site/EmptyState";
import {
  fixtureSiteSettings,
  type PublicSiteSettings,
} from "@/lib/content/site-settings";
import { listMediaAssets } from "@/server/repositories/media-repository";
import { getSiteSettingsForAdmin } from "@/server/repositories/settings-repository";

type Props = {
  searchParams: Promise<{ saved?: string }>;
};

function openingHoursToText(raw: unknown): string {
  if (!raw || typeof raw !== "object") return "";
  const days = (raw as { days?: Array<{ label: string; hours: string }> }).days;
  if (!Array.isArray(days)) return "";
  return days.map((d) => `${d.label} | ${d.hours}`).join("\n");
}

export default async function AdminSettingsPage({ searchParams }: Props) {
  const sp = await searchParams;
  let settings = null as Awaited<ReturnType<typeof getSiteSettingsForAdmin>>;
  let media: Awaited<ReturnType<typeof listMediaAssets>> = [];
  let error: string | null = null;

  try {
    [settings, media] = await Promise.all([
      getSiteSettingsForAdmin(),
      listMediaAssets(),
    ]);
  } catch {
    error =
      "Veritabanına bağlanılamadı. Local MySQL ve migration gerekli (Prompt 04).";
  }

  const checklistSource: PublicSiteSettings = settings
    ? {
        brandName: settings.brandName,
        dietitianName: settings.dietitianName,
        professionalTitle: settings.professionalTitle,
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        biography: settings.biography,
        phone: settings.phone,
        whatsappE164: settings.whatsappE164,
        email: settings.email,
        address: settings.address,
        mapUrl: settings.mapUrl,
        openingHours: [],
        instagramUrl: settings.instagramUrl,
        metaTitle: settings.metaTitle,
        metaDescription: settings.metaDescription,
        logoUrl: settings.logoMedia?.url ?? null,
        logoAlt: settings.logoMedia?.alt ?? null,
        isPlaceholder: !settings.whatsappE164 && !settings.phone,
        source: "db",
      }
    : fixtureSiteSettings();

  if (error) {
    return <EmptyState title="DB hatası" description={error} />;
  }

  return (
    <div className="space-y-space-md">
      {sp.saved ? (
        <p role="status" className="text-body-sm text-primary">
          Kaydedildi — public cache yenilendi.
        </p>
      ) : null}
      <h1 className="text-headline-md text-on-surface">Site ayarları</h1>
      <PublishChecklist settings={checklistSource} />
      <Card>
        <SiteSettingsForm
          mediaAssets={media.map((m) => ({
            id: m.id,
            url: m.url,
            alt: m.alt,
          }))}
          initial={{
            brandName: settings?.brandName ?? checklistSource.brandName,
            dietitianName:
              settings?.dietitianName ?? checklistSource.dietitianName,
            professionalTitle:
              settings?.professionalTitle ?? checklistSource.professionalTitle,
            heroTitle: settings?.heroTitle ?? checklistSource.heroTitle,
            heroSubtitle:
              settings?.heroSubtitle ?? checklistSource.heroSubtitle,
            biography: settings?.biography,
            phone: settings?.phone,
            whatsappE164: settings?.whatsappE164,
            email: settings?.email,
            address: settings?.address,
            mapUrl: settings?.mapUrl,
            openingHoursText: openingHoursToText(settings?.openingHoursJson),
            instagramUrl: settings?.instagramUrl,
            metaTitle: settings?.metaTitle ?? checklistSource.metaTitle,
            metaDescription:
              settings?.metaDescription ?? checklistSource.metaDescription,
            logoMediaId: settings?.logoMediaId,
          }}
        />
      </Card>
    </div>
  );
}
