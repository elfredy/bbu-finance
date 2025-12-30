# 🔧 Bad Gateway Hatası Çözümü

## ❌ Sorun: Bad Gateway

Variable'lar doğru görünüyor ama backend çalışmıyor. Şunları kontrol edin:

### 1️⃣ ALLOWED_ORIGINS Düzeltme

Variable'da hala placeholder URL var:
```
ALLOWED_ORIGINS: https://your-frontend.vercel.app
```

**Bunu gerçek frontend URL'iniz ile değiştirin:**
1. Vercel Dashboard → Projeniz → Settings → Domains
2. Vercel URL'inizi kopyalayın (örn: `https://business-finance-xyz.vercel.app`)
3. Railway → Backend Service → Variables
4. `ALLOWED_ORIGINS` variable'ını düzenleyin
5. Gerçek URL'inizi yazın ve Save edin

### 2️⃣ Railway Log'larını Kontrol Edin

1. Railway Dashboard → `business-finance-backend` service
2. **"Deployments"** sekmesine gidin
3. En son deployment'a tıklayın
4. **"View Logs"** veya **"Logs"** butonuna tıklayın
5. Log'larda şunları arayın:

**Başarılı başlangıç:**
```
🚀 Backend server running on port X
```

**Hatalar:**
- ❌ "Cannot connect to database"
- ❌ "Error: listen EADDRINUSE" (port hatası)
- ❌ "Module not found"
- ❌ "TypeORM connection error"

### 3️⃣ Database Bağlantı Kontrolü

Log'larda database hatası görüyorsanız:

**DB_HOST değeri:**
- Şu an: `business-finance-db.railway.internal` ✅ (doğru)
- Bu internal domain, Railway içinde çalışır

**Eğer hata varsa:**
- Database service'in "Online" olduğundan emin olun
- Database service adının doğru olduğundan emin olun

### 4️⃣ Port Kontrolü

Backend'in doğru port'ta çalıştığından emin olun:

1. Variables'da `PORT` variable'ı olmamalı (Railway otomatik ayarlar)
2. Eğer `PORT` variable'ı varsa, **SİLİN**
3. `main.ts` dosyasında `process.env.PORT || 5001` kullanıyoruz, bu doğru

### 5️⃣ Manual Redeploy

Log'larda açık bir hata yoksa:

1. Service → **"Deployments"** sekmesi
2. **"Redeploy"** butonuna tıklayın
3. En son deployment'ı seçin ve redeploy yapın

### 6️⃣ Service Durumu

1. Railway Dashboard'da service'in durumunu kontrol edin
2. "Online" görünüyor mu?
3. Eğer "Offline" veya "Error" ise, log'lara bakın

## 🔍 Log'larda Ne Aranmalı?

### ✅ Başarılı Log Örneği:
```
> business-finance-backend@1.0.0 start:prod
> node dist/main

🚀 Backend server running on port 5000
```

### ❌ Hata Log Örnekleri:

**Database Connection Error:**
```
Error: connect ECONNREFUSED
TypeORM connection error
```

**Port Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Module Error:**
```
Error: Cannot find module 'xxx'
```

## 📋 Kontrol Listesi

- [ ] ALLOWED_ORIGINS gerçek frontend URL'inizi içeriyor mu?
- [ ] Log'lara baktınız mı? (Deployments → View Logs)
- [ ] Backend başarıyla başladı mı? (`🚀 Backend server running`)
- [ ] Database bağlantısı çalışıyor mu?
- [ ] PORT variable'ı var mı? (varsa silin)
- [ ] Service "Online" durumunda mı?
- [ ] Redeploy yaptınız mı?

## 🚨 Hemen Yapılacaklar

1. **ALLOWED_ORIGINS'i düzeltin** (gerçek frontend URL)
2. **Log'ları kontrol edin** (Deployments → View Logs)
3. **Log'lardaki hata mesajını paylaşın** (daha spesifik yardım için)

