# 🚀 Deployment Kılavuzu (Türkçe)

Projeyi Render (Backend) ve Vercel (Frontend) üzerinde deploy edebilirsiniz.

## 📋 Adımlar

### 1️⃣ Backend (Render) - PostgreSQL Database

1. Render'a gidin: https://dashboard.render.com
2. "New +" → "PostgreSQL" seçin
3. Ayarlar:
   - Name: `business-finance-db`
   - Database: `business_finance`
   - User: `business_finance_user`
4. "Create Database" tıklayın
5. Database oluştuktan sonra "Connections" sekmesinden bilgileri kopyalayın

### 2️⃣ Backend (Render) - Web Service

1. "New +" → "Web Service" seçin
2. GitHub repository'nizi bağlayın
3. Ayarlar:
   - Name: `business-finance-backend`
   - Environment: `Node`
   - Root Directory: `backend` ⚠️ ÖNEMLİ
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`
4. Environment Variables ekleyin:
   ```
   NODE_ENV=production
   PORT=10000
   DB_HOST=<render-database-host>
   DB_PORT=5432
   DB_USER=<render-database-user>
   DB_PASSWORD=<render-database-password>
   DB_NAME=business_finance
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
   ⚠️ `ALLOWED_ORIGINS` değerini frontend deploy ettikten sonra güncelleyin.

5. Backend URL'inizi not edin: `https://business-finance-backend.onrender.com`

### 3️⃣ Frontend (Vercel)

1. Vercel'e gidin: https://vercel.com
2. "Add New..." → "Project" seçin
3. GitHub repository'nizi import edin
4. Ayarlar:
   - Framework Preset: `Next.js`
   - Root Directory: `frontend` ⚠️ ÖNEMLİ
   - Build Command: `npm run build` (varsayılan)
5. Environment Variable ekleyin:
   ```
   NEXT_PUBLIC_API_URL=https://business-finance-backend.onrender.com
   ```
   ⚠️ Backend URL'ini yukarıdaki URL ile değiştirin.

6. Frontend URL'inizi not edin: `https://your-project.vercel.app`

### 4️⃣ CORS Güncelleme

1. Render Dashboard'a geri dönün
2. Backend service → Environment Variables
3. `ALLOWED_ORIGINS` değerini frontend URL'iniz ile güncelleyin:
   ```
   ALLOWED_ORIGINS=https://your-project.vercel.app
   ```
4. Service otomatik olarak yeniden deploy edilecek

### 5️⃣ İlk Veri Yükleme

Admin sayfasından veya direkt API ile öğrenci dosyasını yükleyin:
```
POST https://your-backend.onrender.com/api/upload-main-db
Content-Type: multipart/form-data
file: tələbə.xlsx
```

## 📝 Environment Variables Özeti

### Backend (Render):
```
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
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

## ⚠️ Önemli Notlar

- Render free tier'de servis 15 dakika kullanılmazsa uyku moduna geçer
- İlk istek 30-60 saniye sürebilir (uyku modundan uyanma)
- Production'da `synchronize: false` yapmanız önerilir (backend/src/app.module.ts)

## 🐛 Sorun Giderme

- **CORS hatası:** `ALLOWED_ORIGINS` değerini kontrol edin
- **Database bağlantı hatası:** Render dashboard'da database bilgilerini kontrol edin
- **Backend çalışmıyor:** Render dashboard → Logs sekmesine bakın

