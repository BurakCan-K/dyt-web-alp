/**
 * Tarif porsiyon ölçekleme — yalnızca görüntü hesabı; DB’ye yazılmaz.
 * newQty = originalQty × targetServings / baseServings
 */
export function scaleIngredientQuantity(
  quantity: number,
  baseServings: number,
  targetServings: number,
): number | null {
  if (
    !Number.isFinite(quantity) ||
    !Number.isFinite(baseServings) ||
    !Number.isFinite(targetServings) ||
    quantity < 0 ||
    baseServings <= 0 ||
    targetServings <= 0 ||
    targetServings > 50
  ) {
    return null;
  }
  const scaled = (quantity * targetServings) / baseServings;
  return Math.round(scaled * 100) / 100;
}
