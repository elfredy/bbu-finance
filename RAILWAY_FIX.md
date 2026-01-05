# 🔧 Railway Build Hatası Çözümü

## ❌ Hata: `npm: not found` (Docker build)

Eğer hata mesajında hala `cd backend &&` görüyorsanız:

### 1️⃣ Ayarları Kontrol Edin

Railway Dashboard'da:
1. Service'e tıklayın
2. **"Settings"** sekmesine gidin
3. **"Root Directory"** alanını kontrol edin:
   - Değer: `backend` (sadece backend, başında `/` yok)
4. **"Build Command"** alanını kontrol edin:
   - Değer: `npm install && npm run build` (cd backend YOK!)
5. **"Start Command"** alanını kontrol edin:
   - Değer: `npm run start:prod`

### 2️⃣ Değişiklikleri Kaydedin

- Ayarları değiştirdikten sonra **mutlaka "Save" butonuna tıklayın**
- Railway otomatik olarak yeniden deploy başlatmalı
- Eğer başlamazsa, manuel olarak "Redeploy" yapın

### 3️⃣ Manuel Redeploy

1. Service → **"Deployments"** sekmesine gidin
2. Sağ üstte **"Redeploy"** butonuna tıklayın
3. Son deployment'ı seçin ve "Redeploy" yapın

### 4️⃣ Build Command'ı Temizleyin

Eğer hala `cd backend` görüyorsanız:

1. Settings → Build Command alanını **tamamen temizleyin**
2. Tekrar yazın: `npm install && npm run build`
3. Save edin

### 5️⃣ Root Directory Kontrolü

**Root Directory** mutlaka `backend` olmalı:
- ✅ Doğru: `backend`
- ❌ Yanlış: `/backend`
- ❌ Yanlış: `./backend`
- ❌ Yanlış: (boş)

## 🔍 Alternatif Çözüm: railway.json

Eğer Railway ayarları çalışmıyorsa, proje root'una bir `railway.json` dosyası ekleyebilirsiniz:

### railway.json (Proje root'unda):

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && npm install && npm run build"
  },
  "deploy": {
    "startCommand": "cd backend && npm run start:prod",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**AMA** eğer Root Directory `backend` ise, railway.json'a gerek yok. Root Directory kullanmak daha iyi.

## ✅ Önerilen Çözüm: Root Directory Kullanın

1. **Root Directory:** `backend` (Settings'te)
2. **Build Command:** `npm install && npm run build` (cd YOK)
3. **Start Command:** `npm run start:prod`
4. **railway.json:** Gerek yok (Root Directory kullanıyorsanız)

## 🚨 Eğer Hala Çalışmıyorsa

### Railway'ı Sıfırlayın:

1. Service'i silin (Settings → Delete Service)
2. Yeni service oluşturun
3. Ayarları tekrar yapın:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start:prod`

### Nixpacks Builder Kullanın:

1. Settings → "Builder" → "Nixpacks" seçin
2. Root Directory: `backend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start:prod`

## 📝 Kontrol Listesi

- [ ] Root Directory = `backend` (Settings'te)
- [ ] Build Command = `npm install && npm run build` (cd YOK)
- [ ] Start Command = `npm run start:prod` (cd YOK)
- [ ] Ayarları Save ettiniz mi?
- [ ] Service yeniden deploy oldu mu?
- [ ] Log'larda hala `cd backend` görünüyor mu?



