import { FaqForm } from "@/components/admin/FaqForm";
import { EmptyState } from "@/components/site/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { deleteFaqAction } from "@/server/actions/faq-actions";
import { listFaqsForAdmin } from "@/server/repositories/faq-repository";

type Props = { searchParams: Promise<{ saved?: string; edit?: string }> };

export default async function AdminFaqPage({ searchParams }: Props) {
  const sp = await searchParams;
  let faqs: Awaited<ReturnType<typeof listFaqsForAdmin>> = [];
  let error: string | null = null;
  try {
    faqs = await listFaqsForAdmin();
  } catch {
    error = "Veritabanına bağlanılamadı.";
  }

  const editing = faqs.find((f) => f.id === sp.edit);

  return (
    <div className="space-y-space-lg">
      <h1 className="text-headline-md">SSS</h1>
      {sp.saved ? (
        <p role="status" className="text-body-sm text-primary">
          Kaydedildi.
        </p>
      ) : null}

      <Card>
        <h2 className="mb-space-md text-headline-sm">
          {editing ? "SSS düzenle" : "Yeni SSS"}
        </h2>
        <FaqForm
          id={editing?.id}
          initial={
            editing
              ? {
                  question: editing.question,
                  answerText: editing.answerText,
                  position: editing.position,
                  published: editing.published,
                }
              : undefined
          }
        />
      </Card>

      {error ? (
        <EmptyState title="DB hatası" description={error} />
      ) : faqs.length === 0 ? (
        <EmptyState title="SSS yok" />
      ) : (
        <ul className="space-y-space-sm">
          {faqs.map((faq) => (
            <li key={faq.id}>
              <Card className="flex flex-col gap-space-sm md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-headline-sm">{faq.question}</p>
                  <p className="text-body-sm text-on-surface-variant">
                    sıra {faq.position} ·{" "}
                    {faq.published ? "yayında" : "gizli"}
                  </p>
                </div>
                <div className="flex gap-space-xs">
                  <Button href={`/admin/sss?edit=${faq.id}`} variant="secondary">
                    Düzenle
                  </Button>
                  <form action={deleteFaqAction}>
                    <input type="hidden" name="id" value={faq.id} />
                    <Button type="submit" variant="ghost">
                      Sil
                    </Button>
                  </form>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
