import Link from "next/link";
import { contentPreviewFixture } from "@/data/fixtures";
import { Container } from "@/components/ui/Container";

/**
 * Stitch'teki danışan yorumları yerine içerik önizlemesi.
 * Doğrulanmamış başarı hikayesi / önce-sonra yok.
 */
export function ContentPreviewSection() {
  return (
    <section
      className="py-space-xl"
      aria-labelledby="content-preview-heading"
    >
      <Container>
        <div className="mx-auto mb-space-xl flex max-w-3xl flex-col gap-space-xs text-center">
          <span className="text-label-sm font-bold uppercase tracking-widest text-primary">
            Bilgi & araçlar
          </span>
          <h2
            id="content-preview-heading"
            className="text-headline-lg text-on-surface"
          >
            Okuyun, hesaplayın, sorun
          </h2>
          <p className="text-body-md text-on-surface-variant">
            Danışan yorumları ve sonuç iddiaları bu sürümde yer almaz. Bunun
            yerine bilgilendirici içerik ve araçlara yönlendirilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-3">
          {contentPreviewFixture.map((item) => (
            <article
              key={item.href}
              className="flex flex-col justify-between rounded-3xl bg-surface-container-lowest p-space-lg shadow-md transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-col gap-space-sm">
                <h3 className="text-headline-md text-on-surface">
                  {item.title}
                </h3>
                <p className="text-body-sm leading-relaxed text-on-surface-variant">
                  {item.excerpt}
                </p>
              </div>
              <Link
                href={item.href}
                className="mt-space-md text-label-md font-semibold text-primary hover:underline"
              >
                İncele →
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
