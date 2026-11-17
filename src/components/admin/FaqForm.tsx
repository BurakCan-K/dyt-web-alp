"use client";

import { useActionState } from "react";
import { AdminFormMessage } from "@/components/admin/AdminFormMessage";
import { Button } from "@/components/ui/Button";
import { saveFaqAction } from "@/server/actions/faq-actions";
import type { ActionResult } from "@/server/actions/action-result";

type Props = {
  id?: string;
  initial?: {
    question: string;
    answerText: string;
    position: number;
    published: boolean;
  };
};

export function FaqForm({ id, initial }: Props) {
  const [state, action, pending] = useActionState(
    saveFaqAction,
    null as ActionResult | null,
  );

  return (
    <form action={action} className="flex flex-col gap-space-md">
      {id ? <input type="hidden" name="id" value={id} /> : null}
      <label className="flex flex-col gap-1 text-label-sm">
        Soru
        <input
          name="question"
          required
          defaultValue={initial?.question}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Yanıt
        <textarea
          name="answerText"
          required
          rows={5}
          defaultValue={initial?.answerText}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Sıra
        <input
          type="number"
          name="position"
          min={0}
          defaultValue={initial?.position ?? 0}
          className="w-32 rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex items-center gap-space-sm text-label-sm">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial?.published ?? false}
        />
        Yayınla
      </label>
      <AdminFormMessage state={state} />
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </Button>
    </form>
  );
}
