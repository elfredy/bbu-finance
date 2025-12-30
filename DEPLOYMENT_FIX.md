# 🔧 Build Hatası Çözümü

## ❌ Hata: `npm: not found`

Eğer şu hatayı alıyorsanız:
```
sh: 1: npm: not found
ERROR: failed to build
```

## ✅ Çözüm

### Railway veya Render'da Build Command

**Root Directory** `backend` olarak ayarlandıysa, build command'da **`cd backend` YAZMAYIN!**

#### ❌ Yanlış:
```
Build Command: cd backend && npm install && npm run build
```

#### ✅ Doğru:
```
Build Command: npm install && npm run build
```

### Neden?

Platform zaten **Root Directory**'de çalışıyor. Eğer Root Directory `backend` ise, komutlar zaten `backend` klasöründe çalışır. `cd backend` yazarsanız, `backend/backend` klasörüne gitmeye çalışır ki bu klasör yok!

## 📋 Doğru Ayarlar

### Railway:
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`

### Render:
- **Root Directory:** `backend`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm run start:prod`

## 🔄 Düzeltme Adımları

1. Railway/Render Dashboard'a gidin
2. Service'inize tıklayın
3. "Settings" sekmesine gidin
4. **Build Command** alanını bulun
5. `cd backend &&` kısmını silin
6. Sadece `npm install && npm run build` bırakın
7. Kaydedin ve yeniden deploy edin

## ✅ Alternatif: Root Directory Boş Bırakma

Eğer Root Directory'yi boş bırakmak isterseniz:

- **Root Directory:** (boş)
- **Build Command:** `cd backend && npm install && npm run build`
- **Start Command:** `cd backend && npm run start:prod`

Ama **Root Directory = backend** kullanmanızı öneririz (daha temiz).

