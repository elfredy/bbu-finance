# 🚂 Railway Deployment Kılavuzu

Railway, Render'a alternatif olarak kullanabileceğiniz bir platform. Free tier'de daha esnek ve uyku modu yok!

## ✅ Railway Avantajları

- ✅ Ücretsiz $5 kredi (aylık)
- ✅ Uyku modu yok (sürekli çalışır)
- ✅ Kolay PostgreSQL database kurulumu
- ✅ GitHub entegrasyonu
- ✅ Hızlı deployment

## 🚀 Adım Adım Deployment

### 1️⃣ Railway Hesabı Oluşturma

1. Railway'a gidin: https://railway.app
2. "Start a New Project" → "Login with GitHub"
3. GitHub hesabınızla giriş yapın

### 2️⃣ PostgreSQL Database Oluşturma

1. Railway Dashboard'da "New Project" → "Empty Project"
2. "New" → "Database" → "Add PostgreSQL"
3. PostgreSQL otomatik olarak oluşturulacak
4. Database'e tıklayın → "Variables" sekmesine gidin
5. Database connection bilgilerini not edin:
   - `PGHOST` postgres.railway.internal
   - `PGPORT` 5432
   - `PGUSER` postgres
   - `PGPASSWORD` jhJwCRBYTtnRuRCTlRuANBItTDjTTkFn
   - `PGDATABASE` railway

### 3️⃣ Backend Service Oluşturma

1. Railway Dashboard'da aynı project içinde
2. "New" → "GitHub Repo" seçin
3. GitHub repository'nizi seçin
4. Railway otomatik olarak service oluşturur

### 4️⃣ Backend Konfigürasyonu

1. Service'e tıklayın → "Settings" sekmesi
2. **Root Directory:** `backend` olarak ayarlayın ⚠️ ÖNEMLİ!
3. **Build Command:** `npm install && npm run build` (cd backend YOK!)
4. **Start Command:** `npm run start:prod`

### 5️⃣ Environment Variables Ekleme

Service'e tıklayın → "Variables" sekmesi → "Raw Editor" → Şunu ekleyin:

```env
NODE_ENV=production
PORT=5000

# PostgreSQL Database (Railway otomatik olarak ekler, ama kontrol edin)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}

# CORS - Frontend URL'inizi buraya ekleyin (Vercel deploy ettikten sonra)
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

**ÖNEMLİ:** 
- Railway'da PostgreSQL service'in adı `Postgres` ise yukarıdaki gibi kullanın
- Eğer farklı bir isim verdyseniz, o ismi kullanın: `${{YourServiceName.PGHOST}}`
- `ALLOWED_ORIGINS` değerini frontend deploy ettikten sonra güncelleyin

### 6️⃣ Domain Ayarlama

1. Service'e tıklayın → "Settings" → "Generate Domain"
2. Railway otomatik olarak bir domain oluşturur: `your-service.railway.app`
3. Bu URL'yi not edin (frontend için kullanacağız)

### 7️⃣ Deploy Etme

1. "Deployments" sekmesine gidin
2. Railway otomatik olarak deploy edecek
3. Log'ları takip edin

### 8️⃣ Frontend (Vercel)

Frontend'i Vercel'de deploy edin (zaten ücretsiz ve sınırsız):

1. Vercel → "Add New..." → "Project"
2. Repository'nizi seçin
3. **Root Directory:** `frontend`
4. Environment Variable ekleyin:
   ```
   NEXT_PUBLIC_API_URL=https://your-service.railway.app
   ```
5. Deploy edin

### 9️⃣ CORS Güncelleme

1. Railway Dashboard'a geri dönün
2. Backend service → Variables
3. `ALLOWED_ORIGINS` değerini frontend URL'iniz ile güncelleyin:
   ```
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
4. Service otomatik olarak yeniden deploy edilecek

## 📊 Railway Free Tier Limitleri

- 💰 **$5 ücretsiz kredi** (aylık)
- ⏱️ **Kullanım:** Küçük projeler için yeterli
- 💾 **Storage:** 500 MB (database için)
- 🚀 **Network:** 100 GB trafik

**Not:** Küçük-orta ölçekli projeler için $5 kredi genellikle yeterlidir. Kredi bittikten sonra kart eklemeniz gerekir (ama free tier limitleri içinde kalmaya devam edebilirsiniz).

## 🔍 Troubleshooting

### Database bağlanamıyor:
- Railway Dashboard → Database → Variables sekmesinden connection bilgilerini kontrol edin
- Environment variables'da `${{Postgres.PGHOST}}` formatının doğru olduğundan emin olun

### Build hatası:
- Log'lara bakın: Service → Deployments → Latest deployment → View logs
- `Root Directory`'nin `backend` olarak ayarlandığından emin olun

### Port hatası:
- Railway otomatik olarak PORT environment variable'ı ekler
- `PORT` değişkenini environment variables'dan kaldırmayın

## 💡 İpuçları

1. **Monitoring:** Railway Dashboard'da service'in resource kullanımını görebilirsiniz
2. **Logs:** Real-time log'ları görmek için Service → Logs sekmesini kullanın
3. **Redeploy:** Manuel olarak redeploy etmek için Service → Settings → "Redeploy" butonunu kullanın

## 🎉 Tamamlandı!

Artık Railway'da backend'iniz çalışıyor! Frontend'i Vercel'de deploy ettikten sonra uygulamanız hazır olacak.

