# 🔗 Railway Backend Variables Setup

## Database Variable'larını Backend'e Ekleme

Backend service'inizin **Variables** sayfasına gidin ve şu variable'ları ekleyin:

### Yöntem 1: Raw Editor (ÖNERİLEN)

1. Backend service → **Variables** → **Raw Editor** (`{}` icon)
2. Şu variable'ları ekleyin:

```json
{
  "ALLOWED_ORIGINS": "https://your-frontend.vercel.app",
  "DB_HOST": "${{Postgres.RAILWAY_PRIVATE_DOMAIN}}",
  "DB_PORT": "5432",
  "DB_USER": "${{Postgres.POSTGRES_USER}}",
  "DB_PASSWORD": "${{Postgres.POSTGRES_PASSWORD}}",
  "DB_NAME": "${{Postgres.POSTGRES_DB}}",
  "NODE_ENV": "production",
  "PORT": "5000"
}
```

⚠️ **ÖNEMLİ:** 
- `Postgres` yerine database service'inizin **tam adını** yazın (örn: `business-finance-db`)
- Frontend URL'inizi `ALLOWED_ORIGINS` değerine yazın

### Yöntem 2: Database Service'ten Connect

1. PostgreSQL database service'inize tıklayın
2. **Variables** sekmesine gidin
3. Sağ üstte **"Add to..."** veya **"Connect"** butonuna tıklayın
4. `business-finance-backend` service'ini seçin
5. Railway otomatik olarak database variable'larını ekleyecek

**AMA** bu yöntem Railway'ın kendi formatını kullanır (`PGHOST`, `PGUSER`, vs.). Bizim backend'imiz `DB_HOST`, `DB_USER` formatını bekliyor, bu yüzden **Yöntem 1'i kullanmanızı öneririz**.

## 📋 Variable Mapping

Backend'iniz şu formatı bekliyor:
- `DB_HOST` → Database host
- `DB_PORT` → Database port (5432)
- `DB_USER` → Database user
- `DB_PASSWORD` → Database password
- `DB_NAME` → Database name

Database service'inde şunlar var:
- `PGHOST` veya `RAILWAY_PRIVATE_DOMAIN` → DB_HOST için
- `PGPORT` → DB_PORT için (5432)
- `PGUSER` veya `POSTGRES_USER` → DB_USER için
- `PGPASSWORD` veya `POSTGRES_PASSWORD` → DB_PASSWORD için
- `PGDATABASE` veya `POSTGRES_DB` → DB_NAME için

## ✅ Doğru Format

Database service adınız `Postgres` ise:

```json
{
  "DB_HOST": "${{Postgres.RAILWAY_PRIVATE_DOMAIN}}",
  "DB_PORT": "5432",
  "DB_USER": "${{Postgres.POSTGRES_USER}}",
  "DB_PASSWORD": "${{Postgres.POSTGRES_PASSWORD}}",
  "DB_NAME": "${{Postgres.POSTGRES_DB}}"
}
```

Database service adınız farklıysa (örn: `business-finance-db`):

```json
{
  "DB_HOST": "${{business-finance-db.RAILWAY_PRIVATE_DOMAIN}}",
  "DB_PORT": "5432",
  "DB_USER": "${{business-finance-db.POSTGRES_USER}}",
  "DB_PASSWORD": "${{business-finance-db.POSTGRES_PASSWORD}}",
  "DB_NAME": "${{business-finance-db.POSTGRES_DB}}"
}
```

## 🔍 Database Service Adını Bulma

1. Railway Dashboard'da PostgreSQL service'inize tıklayın
2. Service adı üstte görünür (örn: `Postgres`, `business-finance-db`, vs.)
3. Bu ismi variable'larda kullanın

## 🎯 Tam Variable Listesi (Backend için)

Raw Editor'de şunları ekleyin:

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

⚠️ **NOT:** `PORT` variable'ını eklemeyin, Railway otomatik olarak ayarlar.

## 🔄 Değişikliklerden Sonra

1. Variable'ları ekledikten sonra **Save** edin
2. Railway otomatik olarak service'i yeniden deploy edecek
3. Log'ları kontrol edin: Service → Deployments → View Logs
4. Başarılı olduğunda log'da şunu göreceksiniz: `🚀 Backend server running on port X`

## 🐛 Sorun Giderme

### "Cannot connect to database" hatası:
- Database service adını doğru yazdığınızdan emin olun
- `${{ServiceName.VARIABLE_NAME}}` formatını kullanın
- Variable isimlerinin doğru olduğundan emin olun

### Variable görünmüyor:
- Raw Editor'ü kullanarak manuel ekleyin
- Tüm variable'ları bir kerede ekleyin (JSON formatında)


