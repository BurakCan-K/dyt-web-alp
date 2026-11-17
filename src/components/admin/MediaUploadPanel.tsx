"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function MediaUploadPanel() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const file = fd.get("file");
    if (!(file instanceof File) || file.size === 0) {
      setError("Dosya seçin");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json()) as {
        ok?: boolean;
        error?: string;
        asset?: { id: string };
      };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Yükleme başarısız");
        return;
      }
      setMessage("Yüklendi");
      form.reset();
      router.refresh();
    } catch {
      setError("Ağ hatası — Cloudinary env ve oturumu kontrol edin");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-space-sm rounded-2xl bg-surface-container-low p-space-md"
    >
      <h2 className="text-headline-sm">Yükle</h2>
      <p className="text-body-sm text-on-surface-variant">
        Cloudinary gerekir. Env yoksa yükleme reddedilir (sahte başarı yok).
        Hostinger `public_html` kalıcı depo değildir.
      </p>
      <label className="flex flex-col gap-1 text-label-sm">
        Dosya (jpg/png/webp/gif, max 5 MB)
        <input
          name="file"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required
          className="text-body-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm">
        Alt text
        <input
          name="alt"
          maxLength={300}
          placeholder="Görsel açıklaması"
          className="rounded-xl bg-surface-container-lowest px-space-md py-space-sm text-body-md"
        />
      </label>
      {error ? (
        <p role="alert" className="text-body-sm text-error">
          {error}
        </p>
      ) : null}
      {message ? (
        <p role="status" className="text-body-sm text-primary">
          {message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Yükleniyor…" : "Cloudinary’ye yükle"}
      </Button>
    </form>
  );
}
