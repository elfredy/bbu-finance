# Deployment Guide

Bu proje Render (Backend) ve Vercel (Frontend) üzerinde deploy edilebilir.

## 📋 Gereksinimler

1. **Render hesabı** (Backend + PostgreSQL için)
2. **Vercel hesabı** (Frontend için)
3. **GitHub repository** (projenin yüklü olması gerekiyor)

---

## 🔧 Backend Deployment (Render)

### 1. Render'da PostgreSQL Database Oluşturma

1. Render Dashboard'a gidin: https://dashboard.render.com
2. "New +" → "PostgreSQL" seçin
3. Aşağıdaki ayarları yapın:
   - **Name:** `business-finance-db`
   - **Database:** `business_finance`
   - **User:** `business_finance_user`
   - **Region:** Size en yakın region
   - **Plan:** Free tier
4. "Create Database" butonuna tıklayın
5. Database oluşturulduktan sonra, "Connections" sekmesinden connection string'i kopyalayın

### 2. Render'da Web Service Oluşturma

1. Render Dashboard'da "New +" → "Web Service" seçin
2. GitHub repository'nizi bağlayın
3. Aşağıdaki ayarları yapın:
   - **Name:** `business-finance-backend`
   - **Environment:** `Node`
   - **Region:** Database ile aynı region
   - **Branch:** `main` (veya kullandığınız branch)
   - **Root Directory:** `backend` (önemli!)
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
4. Environment Variables ekleyin:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<database-host-from-render>
   DB_PORT=5432
   DB_USER=<database-user-from-render>
   DB_PASSWORD=<database-password-from-render>
   DB_NAME=business_finance
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   ⚠️ **ÖNEMLİ:** `ALLOWED_ORIGINS` değerini Vercel'de frontend deploy ettikten sonra frontend URL'iniz ile güncelleyin.

5. "Create Web Service" butonuna tıklayın
6. Service deploy olmaya başlayacak (5-10 dakika sürebilir)

### 3. Backend URL'ini Not Edin

Deploy tamamlandıktan sonra backend URL'iniz şu şekilde olacak:
```
https://business-finance-backend.onrender.com
```

---

## 🎨 Frontend Deployment (Vercel)

### 1. Vercel'de Proje Oluşturma

1. Vercel Dashboard'a gidin: https://vercel.com
2. "Add New..." → "Project" seçin
3. GitHub repository'nizi import edin
4. Aşağıdaki ayarları yapın:
   - **Framework Preset:** Next.js (otomatik algılanmalı)
   - **Root Directory:** `frontend` (önemli!)
   - **Build Command:** `npm run build` (varsayılan)
   - **Output Directory:** `.next` (varsayılan)
5. Environment Variables ekleyin:
   ```
   NEXT_PUBLIC_API_URL=https://business-finance-backend.onrender.com
   ```
   ⚠️ Backend URL'ini Render'dan aldığınız URL ile değiştirin.

6. "Deploy" butonuna tıklayın
7. Deploy tamamlandıktan sonra frontend URL'inizi not edin:
   ```
   https://your-project.vercel.app
   ```

### 2. Backend CORS Ayarlarını Güncelleme

1. Render Dashboard'a geri dönün
2. Backend service'inizin Environment Variables sekmesine gidin
3. `ALLOWED_ORIGINS` değişkenini güncelleyin:
   ```
   ALLOWED_ORIGINS=https://your-project.vercel.app
   ```
4. "Save Changes" butonuna tıklayın
5. Service otomatik olarak yeniden deploy edilecek

---

## 🔄 Veritabanı İlk Kurulumu

### Öğrenci Verilerini Yükleme

1. Backend deploy edildikten sonra, admin sayfasına gidin:
   ```
   https://your-frontend.vercel.app/admin
   ```

2. Veya direkt API endpoint'i kullanabilirsiniz:
   ```bash
   curl -X POST https://your-backend.onrender.com/api/upload-main-db \
     -F "file=@excel-files/tələbə.xlsx"
   ```

---

## 🧪 Test Etme

1. **Frontend URL'i açın:** `https://your-project.vercel.app`
2. Ana sayfada öğrenci listesinin yüklendiğini kontrol edin
3. Admin sayfasına gidin ve grup yönetimini test edin
4. Ödeme yükleme sayfasını test edin

---

## 📝 Önemli Notlar

### Render Free Tier Limitleri:
- **Uyku modu:** 15 dakika kullanılmazsa servis uyku moduna geçer
- **İlk istek yavaş olabilir:** Uyku modundan uyanmak 30-60 saniye sürebilir
- **Aylık kullanım limiti:** 750 saat

### Vercel Free Tier:
- **Bandwidth limiti:** 100 GB/ay
- **Build zamanı:** 6000 dakika/ay
- **Serverless functions:** 100 GB-hours/ay

### Production İçin Öneriler:
1. **Database:** Production'da `synchronize: false` yapın (backend/src/app.module.ts)
2. **Migrations:** TypeORM migrations kullanın
3. **Environment Variables:** Hassas bilgileri asla commit etmeyin
4. **Monitoring:** Render ve Vercel'de log'ları takip edin

---

## 🐛 Sorun Giderme

### Backend bağlanmıyor:
- Render dashboard'da service'in durumunu kontrol edin
- Log'lara bakın: Render dashboard → Service → Logs
- Environment variables'ların doğru olduğundan emin olun

### CORS hatası:
- `ALLOWED_ORIGINS` environment variable'ının doğru frontend URL'ini içerdiğinden emin olun
- Backend service'i yeniden deploy edin

### Database bağlantı hatası:
- Database'in Render'da oluşturulduğundan emin olun
- Database connection string'in doğru olduğundan emin olun
- Database'in aynı region'da olduğundan emin olun

---

## 🔗 Hızlı Başvuru

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Backend API Docs:** Swagger/Postman collection eklenebilir
- **Frontend:** Next.js App Router kullanıyor


