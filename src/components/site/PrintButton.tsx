"use client";

import { Button } from "@/components/ui/Button";

export function PrintButton({ label = "Yazdır" }: { label?: string }) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="print:hidden"
      onClick={() => window.print()}
    >
      {label}
    </Button>
  );
}
