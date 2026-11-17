"use client";

import { useActionState } from "react";
import { AdminFormMessage } from "@/components/admin/AdminFormMessage";
import {
  MealPlanEditor,
  type DayRow,
  type MealRow,
} from "@/components/admin/MealPlanEditor";
import { MediaPicker, type MediaOption } from "@/components/admin/MediaPicker";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Button } from "@/components/ui/Button";
import { saveGuideAction } from "@/server/actions/guide-actions";
import type { ActionResult } from "@/server/actions/action-result";

type Props = {
  id?: string;
  mediaAssets?: MediaOption[];
  initial?: {
    title: string;
    slug: string;
    intro: string;
    contentJson: unknown;
    status: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    coverMediaId?: string | null;
    relatedRecipeSlugs?: string[];
    meals?: MealRow[];
    days?: DayRow[];
  };
};

export function GuideForm({ id, initial, mediaAssets = [] }: Props) {
  const [state, action, pending] = useActionState(
    saveGuideAction,
    null as ActionResult | null,
  );

  return (
    <form action={action} className="flex flex-col gap-space-md">
      {id ? <input type="hidden" name="id" value={id} /> : null}
      <p className="rounded-xl bg-secondary-fixed/40 px-space-md py-space-sm text-body-sm text-on-secondary-fixed-variant">
        Rehber metinleri tıbbi tavsiye veya kişiye özel tedavi gibi
        sunulmamalıdır. Public sayfada bilgilendirme uyarısı gösterilir.
      </p>
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
          placeholder="otomatik-uret"
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Giriş
        <textarea
          name="intro"
          required
          rows={3}
          defaultValue={initial?.intro}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <RichTextEditor
        name="contentJson"
        label="İçerik"
        initialDoc={initial?.contentJson}
      />
      <MediaPicker
        name="coverMediaId"
        label="Kapak görseli"
        assets={mediaAssets}
        initialId={initial?.coverMediaId}
      />
      <MealPlanEditor
        initialMeals={initial?.meals}
        initialDays={initial?.days}
      />
      <label className="flex flex-col gap-1 text-label-sm">
        İlgili tarif slug’ları (virgül veya satır)
        <textarea
          name="relatedRecipeSlugs"
          rows={2}
          defaultValue={initial?.relatedRecipeSlugs?.join("\n")}
          placeholder="zerdecalli-zeytinyagli-pilav"
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
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
