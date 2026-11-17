"use server";

import { assertIsAuthAccessError } from "@/lib/auth/session";
import { requireAdmin } from "@/lib/auth/session";

/**
 * Session-olmayan mutation örneği — CRUD fazlarında aynı kalıp.
 */
export async function exampleProtectedMutation() {
  try {
    await requireAdmin();
  } catch (err) {
    if (assertIsAuthAccessError(err)) {
      return { ok: false as const, status: err.status };
    }
    throw err;
  }
  return { ok: true as const };
}
