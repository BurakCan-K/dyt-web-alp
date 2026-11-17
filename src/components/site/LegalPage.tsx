import { PageHero } from "@/components/site/PageHero";
import { Container } from "@/components/ui/Container";

type Props = {
  title: string;
  description: string;
};

export function LegalPage({ title, description }: Props) {
  return (
    <>
      <PageHero eyebrow="Hukuki" title={title} description={description} />
      <Container className="pb-space-xl">
        <div className="max-w-3xl rounded-3xl bg-secondary-fixed/30 p-space-lg">
          <p className="text-label-sm font-semibold text-on-secondary-fixed-variant">
            Onaylı metin bekleniyor — örnek gerçek metin uydurulmadı
          </p>
          <p className="mt-space-sm text-body-md text-on-surface">
            Bu rota hazırdır ve şu an noindex’tir. Hukuken onaylanmış KVKK /
            gizlilik / çerez metni gelene kadar production içeriği
            doldurulmamalıdır. Takip scripti veya sahte çerez banner’ı yoktur.
          </p>
          <p className="mt-space-sm text-body-sm text-on-surface-variant">
            Yayın engeli: bkz. docs/RELEASE_BLOCKERS.md
          </p>
        </div>
      </Container>
    </>
  );
}
