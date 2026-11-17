"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import {
  loginAction,
  type ActionResult,
} from "@/server/actions/auth-actions";

const initial: ActionResult | null = null;

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="mt-space-lg flex flex-col gap-space-sm">
      <label className="flex flex-col gap-1 text-label-sm text-on-surface">
        E-posta
        <input
          type="email"
          name="email"
          required
          autoComplete="username"
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/40"
        />
      </label>
      <label className="flex flex-col gap-1 text-label-sm text-on-surface">
        Şifre
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="rounded-xl bg-surface-container-low px-space-md py-space-sm text-body-md shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-container/40"
        />
      </label>
      {state && !state.ok ? (
        <p role="alert" className="text-body-sm text-error">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="mt-space-sm w-full">
        {pending ? "Giriş yapılıyor…" : "Giriş yap"}
      </Button>
    </form>
  );
}
