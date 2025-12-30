# 🔧 Render Deployment Kılavuzu

Render free tier'de sadece **1 adet Web Service** oluşturabilirsiniz. Eğer zaten bir projeniz varsa, önce onu silmeniz gerekebilir.

## ⚠️ Önemli Not

Render free tier limitleri:
- ✅ Sınırsız PostgreSQL database
- ❌ Sadece **1 Web Service** (free tier)
- ⚠️ 15 dakika kullanılmazsa uyku moduna geçer
- ⚠️ İlk istek 30-60 saniye sürebilir (uyku modundan uyanma)

## 🚀 Adım Adım Deployment

### 1️⃣ Mevcut Render Projesini Silme (Gerekirse)

Eğer zaten bir Render projeniz varsa:

1. Render Dashboard: https://dashboard.render.com
2. Mevcut service'e tıklayın
3. "Settings" sekmesine gidin
4. En altta "Delete Service" butonuna tıklayın
5. Onaylayın

### 2️⃣ PostgreSQL Database Oluşturma

1. Render Dashboard → "New +" → "PostgreSQL"
2. Ayarlar:
   - **Name:** `business-finance-db`
   - **Database:** `business_finance`
   - **User:** `business_finance_user`
   - **Region:** Size en yakın region (örn: Frankfurt, Singapore)
   - **PostgreSQL Version:** 15 (veya en son)
   - **Plan:** Free
3. "Create Database" tıklayın
4. Database oluşturulduktan sonra:
   - "Info" sekmesinden connection bilgilerini kopyalayın
   - **Internal Database URL** veya **External Database URL** kullanabilirsiniz

### 3️⃣ Web Service Oluşturma

1. Render Dashboard → "New +" → "Web Service"
2. GitHub repository'nizi bağlayın
   - "Connect account" ile GitHub hesabınızı bağlayın
   - Repository'nizi seçin
3. Service ayarları:
   - **Name:** `business-finance-backend`
   - **Environment:** `Node`
   - **Region:** Database ile aynı region (önemli!)
   - **Branch:** `main` (veya kullandığınız branch)
   - **Root Directory:** `backend` ⚠️ **ÖNEMLİ!**
   - **Runtime:** `Node` (otomatik algılanır)
   - **Build Command:** `npm install && npm run build` ⚠️ `cd backend` YOK çünkü Root Directory zaten `backend`!
   - **Start Command:** `npm run start:prod`
   - **Plan:** Free

4. "Advanced" sekmesine gidin ve "Add Environment Variable" butonuna tıklayın:
   
   Şu environment variable'ları ekleyin:

   ```
   NODE_ENV=production
   PORT=10000
   ```

   Database bilgilerini ekleyin:
   ```
   DB_HOST=<database-host-from-render>
   DB_PORT=5432
   DB_USER=<database-user-from-render>
   DB_PASSWORD=<database-password-from-render>
   DB_NAME=business_finance
   ```

   ⚠️ **ÖNEMLİ:** Database bilgilerini Render'ın database sayfasından alın:
   - Database → "Info" sekmesi → "Internal Database URL" veya connection bilgileri
   - Veya "Connections" sekmesinden bilgileri alın

   CORS için (frontend deploy ettikten sonra güncelleyeceğiz):
   ```
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   Şimdilik localhost bırakabilirsiniz:
   ```
   ALLOWED_ORIGINS=http://localhost:3000
   ```

5. "Create Web Service" butonuna tıklayın
6. Render otomatik olarak build ve deploy etmeye başlayacak
7. Build tamamlandıktan sonra service'iniz çalışacak
8. Backend URL'inizi not edin: `https://business-finance-backend.onrender.com`

### 4️⃣ Build ve Deploy Kontrolü

1. Service'e tıklayın → "Logs" sekmesine gidin
2. Build log'larını kontrol edin
3. Eğer hata varsa log'lardan görebilirsiniz

**Yaygın Hatalar:**
- `Root Directory` yanlış → `backend` olmalı
- Database connection hatası → Environment variables'ı kontrol edin
- Build hatası → Log'lara bakın

### 5️⃣ Frontend Deploy (Vercel)

1. Vercel'e gidin: https://vercel.com
2. "Add New..." → "Project"
3. GitHub repository'nizi import edin
4. Ayarlar:
   - **Framework Preset:** Next.js
   - **Root Directory:** `frontend` ⚠️ ÖNEMLİ
   - **Build Command:** `npm run build` (varsayılan)
5. Environment Variable ekleyin:
   ```
   NEXT_PUBLIC_API_URL=https://business-finance-backend.onrender.com
   ```
6. "Deploy" tıklayın
7. Frontend URL'inizi not edin: `https://your-project.vercel.app`

### 6️⃣ CORS Güncelleme

1. Render Dashboard'a geri dönün
2. Backend service → "Environment" sekmesi
3. `ALLOWED_ORIGINS` değişkenini bulun veya ekleyin
4. Değerini frontend URL'iniz ile güncelleyin:
   ```
   ALLOWED_ORIGINS=https://your-project.vercel.app
   ```
5. "Save Changes" tıklayın
6. Service otomatik olarak yeniden deploy edilecek

### 7️⃣ İlk Veri Yükleme

1. Frontend URL'inize gidin: `https://your-project.vercel.app/admin`
2. Veya direkt API endpoint'ini kullanın:
   ```bash
   curl -X POST https://business-finance-backend.onrender.com/api/upload-main-db \
     -F "file=@excel-files/tələbə.xlsx"
   ```

## 📝 Environment Variables Özeti

### Backend (Render):

```env
NODE_ENV=production
PORT=10000
DB_HOST=<render-database-host>
DB_PORT=5432
DB_USER=<render-database-user>
DB_PASSWORD=<render-database-password>
DB_NAME=business_finance
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend (Vercel):

```env
NEXT_PUBLIC_API_URL=https://business-finance-backend.onrender.com
```

## ⚠️ Render Free Tier Limitleri

- **Uyku Modu:** 15 dakika kullanılmazsa servis uyku moduna geçer
- **İlk İstek:** Uyku modundan uyanmak 30-60 saniye sürebilir
- **Aylık Limit:** 750 saat (aylık)
- **Build Süresi:** 90 dakika limiti var
- **Web Service:** Sadece 1 adet (free tier)

## 🐛 Sorun Giderme

### Build Hatası:
- Service → Logs sekmesine bakın
- `Root Directory`'nin `backend` olduğundan emin olun
- Node.js versiyonunu kontrol edin

### Database Bağlantı Hatası:
- Database'in aynı region'da olduğundan emin olun
- Environment variables'ların doğru olduğundan emin olun
- Database'in "Available" durumunda olduğunu kontrol edin

### CORS Hatası:
- `ALLOWED_ORIGINS` değerinin doğru frontend URL'ini içerdiğinden emin olun
- Backend service'i yeniden deploy edin

### Servis Çalışmıyor:
- Log'lara bakın: Service → Logs
- Service'in "Live" durumunda olduğunu kontrol edin
- İlk istek biraz yavaş olabilir (uyku modundan uyanma)

## 💡 İpuçları

1. **Database ve Service aynı region'da olsun** (daha hızlı bağlantı)
2. **Root Directory mutlaka `backend` olmalı** (önemli!)
3. **Environment variables'ı database sayfasından kopyalayın**
4. **CORS ayarlarını frontend deploy ettikten sonra güncelleyin**

## 🎉 Tamamlandı!

Artık Render'da backend'iniz çalışıyor! Frontend'i Vercel'de deploy ettikten sonra uygulamanız hazır olacak.

