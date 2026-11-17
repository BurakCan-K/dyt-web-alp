type Entry = { count: number; resetAt: number };

const store = new Map<string, Entry>();

export type RateLimitResult =
  | { allowed: true; remaining: number }
  | { allowed: false; retryAfterSec: number };

/**
 * Basit bellek içi oran sınırı (tek Node process / Hostinger MVP).
 * Redis yok; process yeniden başlayınca sıfırlanır.
 */
export function checkRateLimit(
  key: string,
  limit = 5,
  windowMs = 15 * 60 * 1000,
): RateLimitResult {
  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
    };
  }

  current.count += 1;
  store.set(key, current);
  return { allowed: true, remaining: limit - current.count };
}

/** Test / process içi temizlik */
export function resetRateLimitStore() {
  store.clear();
}
