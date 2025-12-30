# 🔧 Database Name Hatası Çözümü

## ❌ Sorun: `database "business-finance-db" does not exist`

Backend `business-finance-db` database'ini arıyor ama Railway'da database adı farklı.

## ✅ Çözüm: DB_NAME Variable'ını Düzeltin

### Railway'da Database Adını Kontrol Edin

1. Railway Dashboard → PostgreSQL database service'inize tıklayın
2. **"Variables"** sekmesine gidin
3. `POSTGRES_DB` variable'ını bulun
4. Değerini not edin (genellikle `railway` veya `postgres`)

### Backend Service'te DB_NAME'i Düzeltin

1. Railway Dashboard → `business-finance-backend` service
2. **"Variables"** sekmesine gidin
3. `DB_NAME` variable'ını bulun
4. Değerini değiştirin:

**Eğer `POSTGRES_DB` değeri `railway` ise:**
```
DB_NAME: railway
```

**VEYA otomatik olarak database'den almak için:**
```
DB_NAME: ${{Postgres.POSTGRES_DB}}
```

⚠️ **ÖNEMLİ:** `Postgres` yerine database service'inizin tam adını yazın.

### Raw Editor ile Düzeltme

1. Backend service → Variables → **Raw Editor** (`{}` icon)
2. `DB_NAME` değerini şu şekilde değiştirin:

```json
{
  "DB_NAME": "${{Postgres.POSTGRES_DB}}"
}
```

VEYA direkt değeri yazın (eğer `railway` ise):

```json
{
  "DB_NAME": "railway"
}
```

## 📋 Doğru Variable Değerleri

Backend service'te şu variable'lar olmalı:

```json
{
  "ALLOWED_ORIGINS": "https://your-frontend.vercel.app",
  "DB_HOST": "${{Postgres.RAILWAY_PRIVATE_DOMAIN}}",
  "DB_PORT": "5432",
  "DB_USER": "${{Postgres.POSTGRES_USER}}",
  "DB_PASSWORD": "${{Postgres.POSTGRES_PASSWORD}}",
  "DB_NAME": "${{Postgres.POSTGRES_DB}}",
  "NODE_ENV": "production"
}
```

⚠️ **ÖNEMLİ:** `Postgres` yerine database service'inizin tam adını yazın.

## 🔄 Değişiklikten Sonra

1. Variable'ı değiştirdikten sonra **Save** edin
2. Railway otomatik olarak service'i yeniden deploy edecek
3. Log'ları kontrol edin: Deployments → View Logs
4. Artık database bağlantısı başarılı olmalı

## ✅ Başarılı Log Örneği

Değişiklikten sonra log'larda şunu görmelisiniz:

```
🚀 Backend server running on port X
```

Database connection error'u artık görünmemeli.

