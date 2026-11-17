"use client";

import { useActionState } from "react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { AdminFormMessage } from "@/components/admin/AdminFormMessage";
import { MediaPicker, type MediaOption } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/Button";
import { saveServiceAction } from "@/server/actions/service-actions";
import type { ActionResult } from "@/server/actions/action-result";

type Props = {
  id?: string;
  mediaAssets?: MediaOption[];
  initial?: {
    title: string;
    slug: string;
    summary: string;
    descriptionJson: unknown;
    position: number;
    isFeatured: boolean;
    status: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    imageId?: string | null;
  };
};

export function ServiceForm({ id, initial, mediaAssets = [] }: Props) {
  const [state, action, pending] = useActionState(
    saveServiceAction,
    null as ActionResult | null,
  );

  return (
    <form action={action} className="flex flex-col gap-space-md">
      {id ? <input type="hidden" name="id" value={id} /> : null}
      <label className="flex flex-col gap-1 text-label-sm">
        Başlık
        <input
          name="title"
          required
          defaultValue={initial?.title}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Slug
        <input
          name="slug"
          defaultValue={initial?.slug}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Özet
        <textarea
          name="summary"
          required
          rows={3}
          defaultValue={initial?.summary}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <RichTextEditor
        name="descriptionJson"
        label="Detay"
        initialDoc={initial?.descriptionJson}
      />
      <MediaPicker
        name="imageId"
        label="Hizmet görseli"
        assets={mediaAssets}
        initialId={initial?.imageId}
      />
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
          name="isFeatured"
          defaultChecked={initial?.isFeatured}
        />
        Öne çıkan
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Durum
        <select
          name="status"
          defaultValue={initial?.status ?? "DRAFT"}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        >
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        SEO title
        <input
          name="seoTitle"
          defaultValue={initial?.seoTitle ?? ""}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        SEO description
        <textarea
          name="seoDescription"
          rows={2}
          defaultValue={initial?.seoDescription ?? ""}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <AdminFormMessage state={state} />
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </Button>
    </form>
  );
}
