export type WaterSex = "female" | "male";

export type WaterRefResult = {
  aiLiters: number;
  noteTr: string;
};

/** EFSA yetişkin toplam su AI (yaklaşık): kadın 2.0 L, erkek 2.5 L. */
export function getWaterReference(
  sex: WaterSex,
  activeExtra: boolean,
): WaterRefResult {
  const aiLiters = sex === "female" ? 2.0 : 2.5;
  return {
    aiLiters,
    noteTr: activeExtra
      ? "Yoğun aktivite/sıcak ortamda ihtiyaç artabilir; sıvı kısıtı varsa hekim önerisi geçerlidir."
      : "Toplam su (içecek + yiyecek). Sıvı kısıtı olanlarda geçerli değildir.",
  };
}
