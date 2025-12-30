# 🐳 Dockerfile Çözümü

Railway Docker kullanıyor ve Node.js/npm bulunamıyor hatası alıyorsunuz.

## ✅ Çözüm: Backend'e Dockerfile Eklendi

Backend klasörüne `Dockerfile` ekledim. Railway artık bu Dockerfile'ı kullanacak.

## 📋 Railway Ayarları

### Railway Dashboard'da:

1. **Root Directory:** `backend` (Settings'te)
2. **Build Command:** (boş bırakın - Dockerfile kullanılacak)
3. **Start Command:** (boş bırakın - Dockerfile'daki CMD kullanılacak)

VEYA

1. **Root Directory:** (boş bırakın)
2. Railway otomatik olarak `railway.json` dosyasındaki ayarları kullanacak

### railway.json Dosyası

Proje root'unda `railway.json` dosyası var ve Dockerfile kullanımını belirtiyor:
- Builder: `DOCKERFILE`
- Dockerfile Path: `backend/Dockerfile`

## 🔄 Sonraki Adımlar

1. **Değişiklikleri GitHub'a commit edin:**
   ```bash
   git add backend/Dockerfile backend/.dockerignore railway.json
   git commit -m "Add Dockerfile for Railway deployment"
   git push
   ```

2. **Railway'da:**
   - Service → Settings → Root Directory: `backend` (veya boş bırakın)
   - Build Command: (boş bırakın)
   - Start Command: (boş bırakın)
   - Save edin

3. **Redeploy:**
   - Service → Deployments → Redeploy

## 📝 Dockerfile Açıklaması

`backend/Dockerfile` dosyası:
- Node.js 18 Alpine image kullanıyor (küçük ve hızlı)
- Dependencies yüklüyor
- Uygulamayı build ediyor
- Port 5000'i expose ediyor
- Production modda çalıştırıyor

## ⚠️ Önemli Notlar

- Dockerfile kullanıyorsanız, Build Command ve Start Command'ı boş bırakın
- Railway otomatik olarak Dockerfile'daki komutları kullanacak
- Port 5000 kullanıyor (Railway otomatik olarak PORT env variable'ını ayarlar)

## 🔍 Kontrol

Deploy olduktan sonra log'larda şunları görmelisiniz:
- ✅ `npm install` başarılı
- ✅ `npm run build` başarılı
- ✅ `npm run start:prod` çalışıyor

