"use client";

import { useActionState } from "react";
import { AdminFormMessage } from "@/components/admin/AdminFormMessage";
import { MediaPicker, type MediaOption } from "@/components/admin/MediaPicker";
import { Button } from "@/components/ui/Button";
import { saveSiteSettingsAction } from "@/server/actions/settings-actions";
import type { ActionResult } from "@/server/actions/action-result";

type Props = {
  mediaAssets: MediaOption[];
  initial: {
    brandName: string;
    dietitianName: string;
    professionalTitle: string;
    heroTitle: string;
    heroSubtitle: string;
    biography?: string | null;
    phone?: string | null;
    whatsappE164?: string | null;
    email?: string | null;
    address?: string | null;
    mapUrl?: string | null;
    openingHoursText?: string;
    instagramUrl?: string | null;
    metaTitle: string;
    metaDescription: string;
    logoMediaId?: string | null;
  };
};

export function SiteSettingsForm({ mediaAssets, initial }: Props) {
  const [state, action, pending] = useActionState(
    saveSiteSettingsAction,
    null as ActionResult | null,
  );

  return (
    <form action={action} className="flex flex-col gap-space-md">
      <p className="rounded-2xl bg-surface-container-low px-space-md py-space-sm text-body-sm text-on-surface-variant">
        Marka adı, diyetisyen adı ve unvan ana sayfa, footer ve hakkımda
        bölümlerinde görünür. Logo alanı hero portresi olarak da kullanılır.
      </p>
      <label className="flex flex-col gap-1 text-label-sm">
        Marka adı
        <input
          name="brandName"
          required
          defaultValue={initial.brandName}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Diyetisyen adı
        <input
          name="dietitianName"
          required
          defaultValue={initial.dietitianName}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Mesleki unvan (doğrulanmış)
        <input
          name="professionalTitle"
          required
          defaultValue={initial.professionalTitle}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Hero başlık
        <textarea
          name="heroTitle"
          required
          rows={2}
          defaultValue={initial.heroTitle}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Hero alt metin
        <textarea
          name="heroSubtitle"
          required
          rows={3}
          defaultValue={initial.heroSubtitle}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Biyografi
        <textarea
          name="biography"
          rows={5}
          defaultValue={initial.biography ?? ""}
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
        />
      </label>

      <MediaPicker
        name="logoMediaId"
        label="Logo"
        assets={mediaAssets}
        initialId={initial.logoMediaId}
      />

      <fieldset className="grid grid-cols-1 gap-space-sm rounded-2xl bg-surface-container-low p-space-md sm:grid-cols-2">
        <legend className="px-1 text-label-sm">İletişim</legend>
        <label className="flex flex-col gap-1 text-label-sm sm:col-span-2">
          WhatsApp (ülke kodlu, örn. +90 5xx…)
          <input
            name="whatsappE164"
            defaultValue={initial.whatsappE164 ?? ""}
            placeholder="+90 5xx xxx xxxx"
            className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-sm">
          Telefon
          <input
            name="phone"
            defaultValue={initial.phone ?? ""}
            className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-sm">
          E-posta
          <input
            name="email"
            type="email"
            defaultValue={initial.email ?? ""}
            className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-sm sm:col-span-2">
          Adres
          <textarea
            name="address"
            rows={2}
            defaultValue={initial.address ?? ""}
            className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-sm sm:col-span-2">
          Harita URL
          <input
            name="mapUrl"
            type="url"
            defaultValue={initial.mapUrl ?? ""}
            className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-sm sm:col-span-2">
          Çalışma saatleri (satır: Gün | Saat)
          <textarea
            name="openingHours"
            rows={4}
            placeholder={"Pzt–Cum | 09:00–18:00\nCmt | 10:00–14:00"}
            defaultValue={initial.openingHoursText ?? ""}
            className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-sm sm:col-span-2">
          Instagram URL
          <input
            name="instagramUrl"
            type="url"
            defaultValue={initial.instagramUrl ?? ""}
            className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md"
          />
        </label>
      </fieldset>

      <fieldset className="flex flex-col gap-space-md rounded-2xl border border-outline-variant/25 p-space-md">
        <legend className="px-1 text-label-sm font-semibold text-tertiary">
          Varsayılan SEO (ana sayfa)
        </legend>
        <p className="text-body-sm text-on-surface-variant">
          Title’da konuyu başa, markayı sona koyun (~50–60 karakter). Description
          doğal bir özet olsun (~120–155 karakter). Alt sayfalar başlığa otomatik
          “| Marka” ekler.
        </p>
        <label className="flex flex-col gap-1 text-label-sm">
          SEO title
          <input
            name="metaTitle"
            required
            maxLength={70}
            defaultValue={initial.metaTitle}
            placeholder="Diyetisyen ve Beslenme Danışmanlığı | Marka"
            className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md"
          />
        </label>
        <label className="flex flex-col gap-1 text-label-sm">
          SEO description
          <textarea
            name="metaDescription"
            required
            maxLength={170}
            rows={3}
            defaultValue={initial.metaDescription}
            placeholder="Danışmanlık, içerikler ve iletişim özeti…"
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
