# Architecture — Nutrition Tools

## İlkeler

- Hesaplama **istemci-taraflı**; sağlık verisi DB/analytics/URL/localStorage’a yazılmaz.
- Saf fonksiyonlar UI’dan ayrı: `src/lib/calculations/*`.
- Araç meta: `src/lib/nutrition-tools/registry.ts`.
- Sayfa: App Router `/hesaplayicilar/[slug]` + hub `/hesaplayicilar`.
- Ortak UI: `CalculatorShell`, `CalculatorDisclaimer`, field helpers.
- Test: Vitest unit; test edilmeden Ready yok.
- Yeni framework yok; mevcut Next/Tailwind/Zod.

## Klasörler

```
src/lib/nutrition-tools/     # registry, types, gates
src/lib/calculations/        # pure math + tests
src/lib/nutrition-data/      # static food/DRI JSON
src/components/calculators/  # forms + shell + viz
src/app/(public)/hesaplayicilar/
docs/nutrition-tools/
```

## Tool kaydı alanları

`id`, `slug`, `group`, `title`, `summary`, `minutes`, `audience`, `method`, `sources[]`, `limits[]`, `warnings[]`, `status`, `relatedHrefs[]`.

## Status

`Research Pending` → `Research Completed` → `Design Completed` → `Implemented` → `Tested` → `Ready` | `Blocked`.

## Güvenlik kapıları

`assertAdult`, `assertNotPregnantTool`, düşük BMI / istemsiz kayıp uyarıları — araç bazında `CLINICAL_SAFETY.md`.
