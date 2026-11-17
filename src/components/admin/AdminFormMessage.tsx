"use client";

import type { ActionResult } from "@/server/actions/action-result";

export function AdminFormMessage({ state }: { state: ActionResult | null }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <p role="status" className="text-body-sm text-primary">
        {state.message ?? "Kaydedildi"}
      </p>
    );
  }
  return (
    <p role="alert" className="text-body-sm text-error">
      {state.error}
    </p>
  );
}
