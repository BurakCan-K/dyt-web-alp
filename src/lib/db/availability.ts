/**
 * MySQL kapalıyken her istekte uzun TCP timeout yaşanmasın diye
 * kısa süreli circuit-breaker.
 */
const COOLDOWN_MS = 30_000;

let lastFailureAt = 0;

export function isDbInCooldown(): boolean {
  return Date.now() - lastFailureAt < COOLDOWN_MS;
}

export function markDbFailure(): void {
  lastFailureAt = Date.now();
}

export function clearDbFailure(): void {
  lastFailureAt = 0;
}

export async function withDbFallback<T>(
  query: () => Promise<T>,
  fallback: () => T | Promise<T>,
): Promise<T> {
  if (isDbInCooldown()) {
    return fallback();
  }
  try {
    const result = await query();
    clearDbFailure();
    return result;
  } catch {
    markDbFailure();
    return fallback();
  }
}
