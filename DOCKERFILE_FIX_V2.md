# 🐳 Dockerfile Düzeltmesi V2

## ❌ Sorun

`package.json` bulunamıyor hatası alıyordunuz çünkü Railway Root Directory kullanırken Dockerfile path'i yanlıştı.

## ✅ Çözüm

Dockerfile'ı proje root'una taşıdım ve COPY komutlarını buna göre düzenledim.

### Yeni Yapı:

- **Dockerfile:** Proje root'unda (`/Dockerfile`)
- **railway.json:** Dockerfile path = `Dockerfile` (root'ta)
- **Root Directory:** Railway'da boş bırakın (veya kaldırın)

### Dockerfile Değişiklikleri:

- `COPY backend/package*.json ./` - Backend klasöründen package.json kopyalıyor
- `COPY backend/ ./` - Tüm backend kodunu kopyalıyor
- Working directory `/app` içinde çalışıyor

## 📋 Railway Ayarları

### Railway Dashboard'da:

1. **Root Directory:** (boş bırakın veya kaldırın) ⚠️ ÖNEMLİ!
2. **Build Command:** (boş bırakın - Dockerfile kullanılacak)
3. **Start Command:** (boş bırakın - Dockerfile kullanılacak)

VEYA

Root Directory'yi tamamen kaldırın - railway.json otomatik olarak Dockerfile'ı kullanacak.

## 🔄 Sonraki Adımlar

1. **GitHub'a commit edin:**
   ```bash
   git add Dockerfile .dockerignore railway.json
   git commit -m "Move Dockerfile to root for Railway"
   git push
   ```

2. **Railway'da:**
   - Service → Settings → Root Directory: (boş bırakın veya silin)
   - Build Command: (boş bırakın)
   - Start Command: (boş bırakın)
   - Save edin

3. **Redeploy:**
   - Service → Deployments → Redeploy

## 📝 Alternatif: Root Directory = backend

Eğer Root Directory'yi `backend` olarak bırakmak isterseniz:

1. Dockerfile'ı `backend/Dockerfile` olarak bırakın
2. railway.json'da: `"dockerfilePath": "Dockerfile"` (backend klasörü içinde)
3. Root Directory: `backend`

Ama şu anki çözüm (Dockerfile root'ta) daha temiz.


