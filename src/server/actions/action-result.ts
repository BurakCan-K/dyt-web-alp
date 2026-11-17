export type ActionResult =
  | { ok: true; id?: string; message?: string }
  | { ok: false; error: string };

export function actionError(error: string): ActionResult {
  return { ok: false, error };
}

export function actionOk(id?: string, message?: string): ActionResult {
  return { ok: true, id, message };
}
