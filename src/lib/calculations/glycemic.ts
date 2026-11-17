export type GlycemicLoadResult = {
  gl: number;
  band: "low" | "medium" | "high";
  labelTr: string;
};

/** GL = (GI × available CHO g) / 100. GI bilinmiyorsa çağırma. */
export function calculateGlycemicLoad(
  gi: number,
  availableCarbG: number,
): GlycemicLoadResult | null {
  if (
    !Number.isFinite(gi) ||
    !Number.isFinite(availableCarbG) ||
    gi < 0 ||
    gi > 150 ||
    availableCarbG < 0 ||
    availableCarbG > 500
  ) {
    return null;
  }
  const gl = Math.round(((gi * availableCarbG) / 100) * 10) / 10;
  let band: GlycemicLoadResult["band"];
  let labelTr: string;
  if (gl < 10) {
    band = "low";
    labelTr = "Düşük GL (<10) — bilgilendirme";
  } else if (gl <= 19) {
    band = "medium";
    labelTr = "Orta GL (10–19) — bilgilendirme";
  } else {
    band = "high";
    labelTr = "Yüksek GL (≥20) — bilgilendirme";
  }
  return { gl, band, labelTr };
}
