# Veri Modeli (Prisma 7 + MySQL/MariaDB)

## Genel
- ORM: **Prisma 7.x** (`prisma` + `@prisma/client` aynı major)
- DB: Hostinger MySQL/MariaDB — `provider = "mysql"`
- Runtime: `@prisma/adapter-mariadb`
- CLI URL: `prisma.config.ts` → `DATABASE_URL`
- JSON alanlar Tiptap/blok içerik ve yapılandırılmış meta için

## Modeller
| Model | Not |
|---|---|
| `AdminUser` | Tek `OWNER`; kayıt UI yok |
| `SiteSettings` | Singleton `id=default` |
| `MediaAsset` | Cloudinary/S3; deploy klasörüne yazılmaz |
| `Service` | slug unique, soft-delete `deletedAt` |
| `PostCategory` / `BlogPost` | kategori opsiyonel; tags/references JSON |
| `RecipeCategory` / `Recipe` / `RecipeIngredient` | porsiyon + el ile besin |
| `NutritionGuide` | genel bilgilendirme; `mealPlanJson` |
| `Faq` | `published` boolean |
| `AuditLog` | parola/hassas veri yok |

## Enums
- `ContentStatus`: `DRAFT` \| `PUBLISHED` \| `ARCHIVED`
- `AdminRole`: `OWNER`
- `MediaProvider`: `CLOUDINARY` \| `S3` \| `LOCAL_PLACEHOLDER`

## Besin değerleri
- `Recipe.nutrientsPerServingJson` + `nutrientSource`
- Otomatik bilimsel üretim yok; değerler el ile / belirtilen yöntemle

## Public sorgu kuralı
`status=PUBLISHED` ∧ `deletedAt IS NULL` ∧ `publishedAt <= now()`

## Kararlar
- Rehber↔tarif ilişkisi MVP’de `relatedRecipeSlugsJson` (join tablosu sonra)
- Soft-delete içerik modellerinde; hard delete admin’de bilinçli tercih olabilir
- Ayrıntılar: `docs/DECISIONS.md` D-09
