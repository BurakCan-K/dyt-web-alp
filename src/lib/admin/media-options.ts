import { listMediaAssets } from "@/server/repositories/media-repository";

export async function loadMediaOptions() {
  try {
    const rows = await listMediaAssets();
    return rows.map((m) => ({ id: m.id, url: m.url, alt: m.alt }));
  } catch {
    return [];
  }
}
