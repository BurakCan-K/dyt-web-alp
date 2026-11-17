# Math Validation

## Ortak kurallar

- Sonlu sayı; birim dönüşümü (cm↔m, g↔kg, kcal↔kJ).
- Sıfır/negatif/eksik → `null` veya alan hatası; sessiz NaN yok.
- Yuvarlama: BMI 1 ondalık; enerji 1 ondalık veya tam kcal (fonksiyonda belgelenir).
- Makro: CHO×4 + P×4 + F×9 ≈ hedef kcal (±1 yuvarlama).
- Porsiyon: `qty * (target/base)`.

## Zorunlu test grupları

1. Referans örnek  
2. Normal girdi  
3. Min/max  
4. Sıfıra bölme  
5. Eksik  
6. Negatif  
7. Birim  
8. Yuvarlama  
9. TR ondalık (virgül parse)  
10. Tutarlılık  
11. Uygun olmayan kitle (gate)  

Dosyalar: `src/lib/calculations/*.test.ts`.
