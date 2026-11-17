/** Yetişkinler için yaygın bilgilendirme aralığı (g/gün). */
export function getFiberReference(): { minG: number; maxG: number; noteTr: string } {
  return {
    minG: 25,
    maxG: 30,
    noteTr:
      "EFSA/NASEM bağlamlı yetişkin referans aralığı bilgilendirmedir; bireysel tolerans değişir.",
  };
}
