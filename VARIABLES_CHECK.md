# ✅ Variables Kontrolü

## Mevcut Variable'lar:

1. ✅ **ALLOWED_ORIGINS**: `https://bbu-finance.vercel.app` - DOĞRU (gerçek frontend URL'i)
2. ✅ **DB_HOST**: `business-finance-db.railway.internal` - DOĞRU
3. ✅ **DB_PORT**: `5432` - DOĞRU
4. ✅ **DB_USER**: `postgres` - DOĞRU
5. ✅ **DB_PASSWORD**: `XcWKFgZBmGRHRvmEHuaJpCKE10FxBWEu` - DOĞRU
6. ❌ **DB_NAME**: `business-finance-db` - **YANLIŞ!**
7. ✅ **NODE_ENV**: `production` - DOĞRU

## ❌ Sorun: DB_NAME

`DB_NAME` değeri `business-finance-db` ama Railway PostgreSQL'de database adı genellikle `railway` veya `postgres` olur.

### Çözüm:

1. Database service'inize gidin (`business-finance-db`)
2. Variables sekmesinde `POSTGRES_DB` değerini kontrol edin
3. Muhtemelen değer `railway` olacak
4. Backend service'te `DB_NAME` variable'ını şu şekilde değiştirin:

**Seçenek 1: Otomatik (ÖNERİLEN)**
```
DB_NAME: ${{business-finance-db.POSTGRES_DB}}
```

**Seçenek 2: Direkt değer (eğer `railway` ise)**
```
DB_NAME: railway
```

## 📋 Düzeltme Adımları:

1. Railway Dashboard → `business-finance-backend` service
2. Variables → `DB_NAME` variable'ını düzenleyin
3. Değeri `${{business-finance-db.POSTGRES_DB}}` veya `railway` olarak değiştirin
4. Save edin
5. Railway otomatik olarak redeploy edecek
6. Log'ları kontrol edin

## ✅ Düzeltme Sonrası Beklenen:

Log'larda artık şunu görmelisiniz:
```
🚀 Backend server running on port X
```

Database connection error'u görünmemeli.

