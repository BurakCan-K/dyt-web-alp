"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  changePasswordAction,
  type ActionResult,
} from "@/server/actions/auth-actions";

const initial: ActionResult | null = null;

export function PasswordChangeForm() {
  const [state, formAction, pending] = useActionState(
    changePasswordAction,
    initial,
  );

  return (
    <form action={formAction} className="flex max-w-md flex-col gap-space-sm">
      <label className="flex flex-col gap-1 text-label-sm text-on-surface">
        Mevcut şifre
        <input
          type="password"
          name="currentPassword"
          required
          autoComplete="current-password"
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md shadow-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm text-on-surface">
        Yeni şifre (min. 12)
        <input
          type="password"
          name="newPassword"
          required
          minLength={12}
          autoComplete="new-password"
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md shadow-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm text-on-surface">
        Yeni şifre (tekrar)
        <input
          type="password"
          name="confirmPassword"
          required
          minLength={12}
          autoComplete="new-password"
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md shadow-sm"
        />
      </label>
      {state?.ok === false ? (
        <p role="alert" className="text-body-sm text-error">
          {state.error}
        </p>
      ) : null}
      {state?.ok === true ? (
        <p role="status" className="text-body-sm text-primary">
          Şifre güncellendi.
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="mt-space-sm w-fit">
        {pending ? "Kaydediliyor…" : "Şifreyi değiştir"}
      </Button>
    </form>
  );
}
