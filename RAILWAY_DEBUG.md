# 🔍 Railway Backend Debug

## ❌ Sorun: "Application failed to respond"

Backend "Online" görünüyor ama çalışmıyor. Şunları kontrol edin:

### 1️⃣ Railway Log'larına Bakın

1. Railway Dashboard → `business-finance-backend` service'ine tıklayın
2. **"Deployments"** sekmesine gidin
3. En son deployment'a tıklayın
4. **"View Logs"** veya **"Logs"** butonuna tıklayın
5. Log'larda şunları arayın:
   - ❌ Error mesajları
   - ❌ "failed to start"
   - ❌ Database connection errors
   - ❌ Port binding errors
   - ✅ "🚀 Backend server running on port X" mesajı (başarılı başlangıç)

### 2️⃣ Environment Variables Kontrolü

1. Service → **"Variables"** sekmesine gidin
2. Şu variable'ların olduğundan emin olun:

```env
NODE_ENV=production
PORT=5000
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

⚠️ **ÖNEMLİ:** 
- `ALLOWED_ORIGINS` değişkeni frontend URL'inizi içermeli
- Database variable'ları doğru service adıyla eşleşmeli (Postgres yerine farklı bir isim kullandıysanız)

### 3️⃣ Database Bağlantısı

Log'larda database connection hatası görüyorsanız:

1. Database service'in adını kontrol edin
2. Environment variables'da `${{ServiceName.PGHOST}}` formatını doğru kullanın
3. Database'in "Online" olduğundan emin olun

### 4️⃣ Port Kontrolü

Backend'in doğru port'ta çalıştığından emin olun:
- Railway otomatik olarak PORT environment variable'ını ayarlar
- `main.ts` dosyasında `process.env.PORT || 5001` kullanıyoruz, bu doğru
- Log'larda hangi port'ta çalıştığını görebilirsiniz

### 5️⃣ CORS Hatası

Frontend'den "Network Error" alıyorsanız, CORS sorunu olabilir:

1. Railway → Service → Variables
2. `ALLOWED_ORIGINS` değişkenini kontrol edin
3. Frontend URL'inizi ekleyin: `https://your-frontend.vercel.app`
4. Virgülle ayırarak birden fazla URL ekleyebilirsiniz: `https://url1.com,https://url2.com`
5. Değişiklikten sonra service otomatik olarak yeniden deploy edilecek

### 6️⃣ Manual Redeploy

Log'larda açık bir hata yoksa:

1. Service → **"Deployments"** sekmesine gidin
2. **"Redeploy"** butonuna tıklayın
3. En son deployment'ı seçin ve redeploy yapın

## 🐛 Yaygın Hatalar ve Çözümleri

### Hata: "Cannot connect to database"
**Çözüm:** Database variable'larını kontrol edin, database service adını doğru yazın

### Hata: "Port already in use"
**Çözüm:** PORT environment variable'ını kaldırın, Railway otomatik ayarlayacak

### Hata: "CORS policy"
**Çözüm:** `ALLOWED_ORIGINS` variable'ını frontend URL'iniz ile güncelleyin

### Hata: "Module not found"
**Çözüm:** Dockerfile'da `npm install` çalıştığından emin olun

## 📝 Kontrol Listesi

- [ ] Log'lara baktınız mı? (Deployments → View Logs)
- [ ] Environment variables doğru mu?
- [ ] Database bağlantısı çalışıyor mu?
- [ ] ALLOWED_ORIGINS frontend URL'inizi içeriyor mu?
- [ ] Service redeploy edildi mi?
- [ ] Database service "Online" durumunda mı?

## 🔗 Hızlı Erişim

- Railway Dashboard: https://railway.app/dashboard
- Service Logs: Service → Deployments → View Logs
- Environment Variables: Service → Variables
- Deployments: Service → Deployments



