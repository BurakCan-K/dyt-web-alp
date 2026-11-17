/**
 * Türkçe karakterleri normalize ederek URL-safe slug üretir.
 */
const TR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  I: "i",
  İ: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

export function slugify(input: string): string {
  const normalized = input
    .trim()
    .split("")
    .map((ch) => TR_MAP[ch] ?? ch)
    .join("")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return normalized || "icerik";
}

/**
 * Çakışmada `-2`, `-3` … ekler.
 */
export function uniqueSlug(base: string, existing: Iterable<string>): string {
  const taken = new Set(
    [...existing].map((s) => s.toLowerCase()).filter(Boolean),
  );
  const root = slugify(base);
  if (!taken.has(root)) return root;

  let n = 2;
  while (taken.has(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}
