"use client";

import { useActionState } from "react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { AdminFormMessage } from "@/components/admin/AdminFormMessage";
import { MediaPicker, type MediaOption } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/Button";
import { saveBlogPostAction } from "@/server/actions/blog-actions";
import type { ActionResult } from "@/server/actions/action-result";

export type BlogCategoryOption = { slug: string; title: string };

type Props = {
  id?: string;
  mediaAssets?: MediaOption[];
  categories?: BlogCategoryOption[];
  initial?: {
    title: string;
    slug: string;
    excerpt: string;
    contentJson: unknown;
    categoryTitle?: string;
    tags?: string[];
    references?: string[];
    status: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    coverMediaId?: string | null;
  };
};

export function BlogPostForm({
  id,
  initial,
  mediaAssets = [],
  categories = [],
}: Props) {
  const [state, action, pending] = useActionState(
    saveBlogPostAction,
    null as ActionResult | null,
  );

  const knownTitles = new Set(categories.map((c) => c.title));
  const initialCat = initial?.categoryTitle ?? "";
  const selectDefault =
    initialCat && knownTitles.has(initialCat)
      ? initialCat
      : categories[0]?.title ?? "";
  const customDefault =
    initialCat && !knownTitles.has(initialCat) ? initialCat : "";

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
          placeholder="otomatik-uret"
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Özet
        <textarea
          name="excerpt"
          required
          rows={3}
          defaultValue={initial?.excerpt}
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
      <div className="grid grid-cols-1 gap-space-md md:grid-cols-2">
        <label className="flex flex-col gap-1 text-label-sm">
          Kategori
          <select
            name="categoryTitle"
            defaultValue={selectDefault}
            className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
          >
            {categories.length === 0 ? (
              <option value="">—</option>
            ) : (
              categories.map((c) => (
                <option key={c.slug} value={c.title}>
                  {c.title}
                </option>
              ))
            )}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-label-sm">
          Yeni kategori (opsiyonel)
          <input
            name="categoryTitleCustom"
            defaultValue={customDefault}
            placeholder="Listede yoksa buraya yazın"
            className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
          />
        </label>
      </div>
      <p className="text-body-sm text-on-surface-variant">
        “Yeni kategori” doluysa seçim yerine o başlık kullanılır.
      </p>
      <label className="flex flex-col gap-1 text-label-sm">
        Etiketler (virgülle)
        <input
          name="tags"
          defaultValue={initial?.tags?.join(", ")}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Kaynaklar (satır satır)
        <textarea
          name="references"
          rows={3}
          defaultValue={initial?.references?.join("\n")}
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
          <option value="DRAFT">Taslak</option>
          <option value="PUBLISHED">Yayında</option>
          <option value="ARCHIVED">Arşiv</option>
        </select>
      </label>
      <fieldset className="flex flex-col gap-space-sm rounded-2xl border border-outline-variant/25 p-space-md">
        <legend className="px-1 text-label-sm font-semibold text-tertiary">
          SEO
        </legend>
        <p className="text-body-sm text-on-surface-variant">
          Boş bırakılırsa başlık ve özet kullanılır. Title ~50–60, description
          ~120–155 karakter hedefleyin.
        </p>
        <label className="flex flex-col gap-1 text-label-sm">
          SEO title
          <input
            name="seoTitle"
            maxLength={70}
            defaultValue={initial?.seoTitle ?? ""}
            placeholder="Yazı başlığı | kısa fayda"
            className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-sm">
          SEO description
          <textarea
            name="seoDescription"
            maxLength={170}
            rows={2}
            defaultValue={initial?.seoDescription ?? ""}
            placeholder="Yazının arama sonucundaki kısa özeti"
            className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
          />
        </label>
      </fieldset>
      <AdminFormMessage state={state} />
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Kaydediliyor…" : "Kaydet"}
      </Button>
    </form>
  );
}
