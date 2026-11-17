"use client";

import { useActionState } from "react";
import {
  IngredientEditor,
  type IngredientRow,
} from "@/components/admin/IngredientEditor";
import { AdminFormMessage } from "@/components/admin/AdminFormMessage";
import { MediaPicker, type MediaOption } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/Button";
import { saveRecipeAction } from "@/server/actions/recipe-actions";
import type { ActionResult } from "@/server/actions/action-result";

type Props = {
  id?: string;
  mediaAssets?: MediaOption[];
  initial?: {
    title: string;
    slug: string;
    excerpt: string;
    steps: string[];
    difficulty?: string;
    tips?: string[];
    allergens?: string[];
    servingCount: number;
    prepMinutes: number;
    cookMinutes: number;
    categoryTitle?: string;
    status: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    coverMediaId?: string | null;
    ingredients: IngredientRow[];
    nutrients?: {
      kcal: number;
      proteinG: number;
      carbG: number;
      fatG: number;
    } | null;
    nutrientSource?: string | null;
  };
};

export function RecipeForm({ id, initial, mediaAssets = [] }: Props) {
  const [state, action, pending] = useActionState(
    saveRecipeAction,
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
      <label className="flex flex-col gap-1 text-label-sm">
        Kategori
        <input
          name="categoryTitle"
          defaultValue={initial?.categoryTitle}
          placeholder="Kahvaltı"
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <div className="grid grid-cols-1 gap-space-sm sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-label-sm">
          Porsiyon
          <input
            name="servingCount"
            type="number"
            min={1}
            max={50}
            required
            defaultValue={initial?.servingCount ?? 1}
            className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-sm">
          Hazırlık (dk)
          <input
            name="prepMinutes"
            type="number"
            min={0}
            defaultValue={initial?.prepMinutes ?? 0}
            className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-sm">
          Pişirme (dk)
          <input
            name="cookMinutes"
            type="number"
            min={0}
            defaultValue={initial?.cookMinutes ?? 0}
            className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
          />
        </label>
      </div>

      <MediaPicker
        name="coverMediaId"
        label="Kapak görseli"
        assets={mediaAssets}
        initialId={initial?.coverMediaId}
      />

      <IngredientEditor initial={initial?.ingredients} />

      <label className="flex flex-col gap-1 text-label-sm">
        Zorluk
        <select
          name="difficulty"
          defaultValue={initial?.difficulty ?? "kolay"}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        >
          <option value="çok kolay">Çok kolay</option>
          <option value="kolay">Kolay</option>
          <option value="orta">Orta</option>
          <option value="zor">Zor</option>
        </select>
      </label>

      <label className="flex flex-col gap-1 text-label-sm">
        Adımlar (satır satır)
        <textarea
          name="steps"
          required
          rows={6}
          defaultValue={initial?.steps?.join("\n")}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>

      <label className="flex flex-col gap-1 text-label-sm">
        Püf noktaları (satır satır)
        <textarea
          name="tips"
          rows={3}
          defaultValue={initial?.tips?.join("\n")}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>

      <label className="flex flex-col gap-1 text-label-sm">
        Alerjen bilgisi (satır satır)
        <textarea
          name="allergens"
          rows={2}
          defaultValue={initial?.allergens?.join("\n")}
          placeholder="Örn. Gluten&#10;Süt ve süt ürünleri"
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>

      <fieldset className="rounded-2xl bg-surface-container-low p-space-md">
        <legend className="px-1 text-label-sm">
          Besin değerleri (porsiyon başına — el ile)
        </legend>
        <p className="mb-space-sm text-body-sm text-on-surface-variant">
          Otomatik kalori üretilmez. Boş bırakılabilir; doluysa kaynak zorunlu.
        </p>
        <div className="grid grid-cols-2 gap-space-sm sm:grid-cols-4">
          {(
            [
              ["kcal", "kcal", initial?.nutrients?.kcal],
              ["proteinG", "Protein (g)", initial?.nutrients?.proteinG],
              ["carbG", "Karb (g)", initial?.nutrients?.carbG],
              ["fatG", "Yağ (g)", initial?.nutrients?.fatG],
            ] as const
          ).map(([name, label, value]) => (
            <label key={name} className="flex flex-col gap-1 text-label-sm">
              {label}
              <input
                name={name}
                type="number"
                step="any"
                min={0}
                defaultValue={value ?? ""}
                className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md"
              />
            </label>
          ))}
        </div>
        <label className="mt-space-sm flex flex-col gap-1 text-label-sm">
          Besin değeri kaynağı / yöntem notu
          <input
            name="nutrientSource"
            defaultValue={initial?.nutrientSource ?? ""}
            placeholder="El ile doğrulanmış / laboratuvar / tahmin…"
            className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md"
          />
        </label>
      </fieldset>

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
