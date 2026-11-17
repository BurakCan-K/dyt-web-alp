export type CarbItem = { name: string; carbG: number };

export function sumCarbohydrates(items: CarbItem[]): number | null {
  if (!Array.isArray(items) || items.length === 0) return null;
  let sum = 0;
  for (const item of items) {
    if (!Number.isFinite(item.carbG) || item.carbG < 0 || item.carbG > 500) {
      return null;
    }
    sum += item.carbG;
  }
  return Math.round(sum * 10) / 10;
}
