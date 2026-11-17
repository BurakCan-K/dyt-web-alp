export function sodiumMgToSaltG(sodiumMg: number): number | null {
  if (!Number.isFinite(sodiumMg) || sodiumMg < 0 || sodiumMg > 50000) return null;
  const sodiumG = sodiumMg / 1000;
  return Math.round(sodiumG * 2.5 * 1000) / 1000;
}

export function saltGToSodiumMg(saltG: number): number | null {
  if (!Number.isFinite(saltG) || saltG < 0 || saltG > 100) return null;
  const sodiumG = saltG / 2.5;
  return Math.round(sodiumG * 1000);
}
