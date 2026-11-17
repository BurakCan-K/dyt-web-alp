"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  title: string;
  path: string;
};

export function ShareButtons({ title, path }: Props) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}${path}`
        : path;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* kullanıcı iptal */
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-space-sm">
      <Button type="button" variant="secondary" onClick={share}>
        {copied ? "Bağlantı kopyalandı" : "Paylaş / kopyala"}
      </Button>
    </div>
  );
}
