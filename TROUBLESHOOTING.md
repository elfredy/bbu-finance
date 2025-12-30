# 🔍 Build Hatası Troubleshooting

## ❓ Hala Build Hatası Alıyorsanız

### 1️⃣ Root Directory Kontrolü

**Railway'da:**
- Service → Settings → "Root Directory" kontrol edin
- Değer: `backend` olmalı (sadece backend, /backend değil)

**Render'da:**
- Service → Settings → "Root Directory" kontrol edin  
- Değer: `backend` olmalı

### 2️⃣ Build Command Kontrolü

Build Command'da:
- ✅ Doğru: `npm install && npm run build`
- ❌ Yanlış: `cd backend && npm install && npm run build`
- ❌ Yanlış: `/backend && npm install && npm run build`

### 3️⃣ Start Command Kontrolü

Start Command'da:
- ✅ Doğru: `npm run start:prod`
- ❌ Yanlış: `cd backend && npm run start:prod`
- ❌ Yanlış: `node dist/main.js` (bu da çalışır ama package.json'daki script'i kullanmak daha iyi)

### 4️⃣ Watch Paths (Opsiyonel)

"Watch Paths" bölümüne **hiçbir şey yazmanıza gerek yok!**
- Bu bölüm boş bırakılabilir
- Otomatik deploy için tüm dosyaları izler
- Sadece belirli klasörler değiştiğinde deploy etmek isterseniz kullanın

### 5️⃣ Log Kontrolü

Hata detaylarını görmek için:
- Railway: Service → "Deployments" → Son deployment → "View Logs"
- Render: Service → "Logs" sekmesi

Log'larda şunları kontrol edin:
- Node.js versiyonu doğru mu? (18+ olmalı)
- `package.json` bulunuyor mu?
- `package.json` içinde `build` script'i var mı?

### 6️⃣ package.json Kontrolü

Backend klasöründe `package.json` dosyasında şu script'ler olmalı:

```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main"
  }
}
```

## 🔧 Yaygın Hatalar ve Çözümleri

### Hata: "npm: not found"
**Neden:** Build command'da `cd backend` yazılmış
**Çözüm:** `cd backend &&` kısmını silin

### Hata: "Cannot find module"
**Neden:** `node_modules` yüklenmemiş
**Çözüm:** Build command'ın `npm install` içerdiğinden emin olun

### Hata: "nest: command not found"
**Neden:** Build script'i çalışmıyor
**Çözüm:** `npm run build` yerine `npm install` önce çalışmalı

### Hata: "dist/main.js not found"
**Neden:** Build başarısız olmuş
**Çözüm:** Log'lara bakın, build hatası var mı kontrol edin

## ✅ Doğru Ayarlar Özeti

### Railway:
```
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm run start:prod
Watch Paths: (boş bırakın)
```

### Render:
```
Root Directory: backend
Build Command: npm install && npm run build
Start Command: npm run start:prod
Watch Paths: (boş bırakın)
```

## 📸 Ayarlar Görsel Rehberi

### Railway Settings:
1. Service'e tıklayın
2. "Settings" sekmesine gidin
3. "Root Directory": `backend`
4. "Build Command": `npm install && npm run build`
5. "Start Command": `npm run start:prod`

### Render Settings:
1. Service'e tıklayın
2. "Settings" sekmesine gidin
3. "Root Directory": `backend`
4. "Build Command": `npm install && npm run build`  
5. "Start Command": `npm run start:prod`

## 🆘 Hala Çalışmıyorsa

Log'lardan tam hata mesajını paylaşın, daha spesifik yardım edebilirim!

