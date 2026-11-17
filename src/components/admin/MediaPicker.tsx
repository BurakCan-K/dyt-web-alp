"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export type MediaOption = {
  id: string;
  url: string;
  alt: string;
};

type Props = {
  name: string;
  label: string;
  assets: MediaOption[];
  initialId?: string | null;
};

export function MediaPicker({ name, label, assets, initialId }: Props) {
  const [selectedId, setSelectedId] = useState(initialId ?? "");
  const selected = assets.find((a) => a.id === selectedId);

  return (
    <fieldset className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-low p-space-md">
      <legend className="px-1 text-label-sm">{label}</legend>
      <input type="hidden" name={name} value={selectedId} />
      {selected ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={selected.url}
          alt={selected.alt || "Seçili medya"}
          className="h-28 w-auto max-w-full rounded-xl object-cover"
        />
      ) : (
        <p className="text-body-sm text-on-surface-variant">Medya seçilmedi</p>
      )}
      <label className="flex flex-col gap-1 text-label-sm">
        Kütüphaneden seç
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md"
        >
          <option value="">— Yok —</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.alt || a.id.slice(0, 8)} · {a.url.slice(0, 40)}
            </option>
          ))}
        </select>
      </label>
      <div className="flex flex-wrap gap-space-xs">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setSelectedId("")}
        >
          Temizle
        </Button>
        <Link
          href="/admin/medya"
          className="text-label-md text-primary hover:underline"
        >
          Medya kütüphanesi
        </Link>
      </div>
    </fieldset>
  );
}
