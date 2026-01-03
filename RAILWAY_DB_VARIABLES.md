# 🔗 Railway Database Variables Ekleme

## ✅ ALLOWED_ORIGINS Eklendi

Şimdi database variable'larını eklemeliyiz. Railway'da iki yöntem var:

## Yöntem 1: Database Service'ten Bağlama (ÖNERİLEN)

1. Railway Dashboard'da **PostgreSQL database service'inize** tıklayın
2. **"Variables"** sekmesine gidin
3. Sağ üstte **"Connect"** veya **"Add to..."** butonuna tıklayın
4. `business-finance-backend` service'ini seçin
5. Railway otomatik olarak database variable'larını ekleyecek

## Yöntem 2: Raw Editor ile Manuel Ekleme

1. Backend service → **"Variables"** sekmesine gidin
2. Sağ üstte **"Raw Editor"** butonuna tıklayın (curly braces `{}` icon)
3. Şu variable'ları ekleyin:

```json
{
  "ALLOWED_ORIGINS": "https://your-frontend.vercel.app",
  "DB_HOST": "${{Postgres.PGHOST}}",
  "DB_PORT": "${{Postgres.PGPORT}}",
  "DB_USER": "${{Postgres.PGUSER}}",
  "DB_PASSWORD": "${{Postgres.PGPASSWORD}}",
  "DB_NAME": "${{Postgres.PGDATABASE}}",
  "NODE_ENV": "production",
  "PORT": "5000"
}
```

⚠️ **ÖNEMLİ:** 
- `Postgres` yerine database service'inizin tam adını yazın (örn: `business-finance-db`)
- Frontend URL'inizi `ALLOWED_ORIGINS` değerine yazın

## 📋 Eklenecek Variable'lar

### Gerekli Variable'lar:

1. ✅ `ALLOWED_ORIGINS` - Zaten eklediniz
2. ❓ `DB_HOST` - Database host (Postgres service'inden)
3. ❓ `DB_PORT` - Database port (genellikle 5432)
4. ❓ `DB_USER` - Database kullanıcı adı
5. ❓ `DB_PASSWORD` - Database şifresi
6. ❓ `DB_NAME` - Database adı (genellikle `railway`)
7. ✅ `NODE_ENV` - Zaten var (production)
8. ✅ `PORT` - Zaten var (Railway otomatik ayarlar)

### Database Service Adını Bulma

1. Railway Dashboard'da PostgreSQL service'inize tıklayın
2. Service adı üstte görünür (örn: `Postgres`, `business-finance-db`, vs.)
3. Variable'larda bu ismi kullanın: `${{ServiceName.PGHOST}}`

## 🔄 Değişikliklerden Sonra

1. Variable'ları ekledikten sonra **Save** edin
2. Railway otomatik olarak service'i yeniden deploy edecek
3. Log'ları kontrol edin: Service → Deployments → View Logs
4. Başarılı olduğunda log'da şunu göreceksiniz: `🚀 Backend server running on port X`

## 🐛 Sorun Giderme

### "Cannot connect to database" hatası:
- Database service adını doğru yazdığınızdan emin olun
- `${{ServiceName.PGHOST}}` formatını kullanın
- Database'in "Online" durumunda olduğundan emin olun

### Variable görünmüyor:
- Raw Editor'ü kullanarak manuel ekleyin
- Veya database service'inden "Connect" yapın


