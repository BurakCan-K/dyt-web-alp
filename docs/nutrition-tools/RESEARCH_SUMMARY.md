# Beslenme Araçları — Araştırma Özeti

**Proje:** dyt-web (`diyetisyen_cursor_gelistirme_paketi`)  
**Tarih:** 2026-03-17  
**Kapsam:** 28 modül (A–D grupları)

## Mevcut durum (FAZ 0)

Zaten canlı (istemci-taraflı, Vitest’li):

| ID | Slug | Not |
|---|---|---|
| A01 | `vki` | Yetişkin BMI; teşhis yok |
| B01+B02 | `enerji` | Mifflin–St Jeor RMR + aktivite çarpanlı TDEE |
| B04 | `makro` | % dağılım → g (4/4/9 kcal) |
| C02 | `porsiyon` | Doğrusal ölçekleme |

## Araştırma ilkeleri

1. Öncelik: WHO, CDC, NIH/NIDDK, USDA FDC, NASEM, EFSA, ADA, ACOG, ESPEN, BAPEN, NICE, T.C. Sağlık Bakanlığı.
2. Blog siteleri birincil kaynak değildir.
3. Doğrulanamayan formül “kesin” diye sunulmaz.
4. Telif korumalı ölçek maddeleri (MUST, MNA-SF) kopyalanmaz → **Blocked**.
5. NIH dinamik kilo modeli kamuya tam doğrulanamazsa tahmin motoru açılmaz.

## Grup özeti

- **A Antropometri:** BMI, WHtR (NICE), WHR, referans ağırlık aralığı, % değişim, kompozisyon (ölçülen ≠ tahmin).
- **B Enerji:** RMR/TDEE, hedef kilo (güvenlikli), makro, protein, su, lif, DRI.
- **C Besin/tarif:** statik kompozisyon seti; canlı FDC API sonraki faz.
- **D Klinik:** çocuk persentil (LMS gerekir), gebelik IOM; MUST/MNA Blocked; NRS/GLIM eğitimsel.

Ayrıntı: `research/*.md`, `EVIDENCE_MATRIX.md`.
