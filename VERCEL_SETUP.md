# 🎨 Vercel Frontend Deployment

## ✅ Vercel Ayarları

Vercel Next.js projelerini otomatik olarak algılar. Şu ayarları yapmanız yeterli:

### 1️⃣ Root Directory (ÖNEMLİ!)

**Settings → General → Root Directory:**
- Değer: `frontend` ⚠️ **ÖNEMLİ!**

Bu ayarı yapmadan devam etmeyin!

### 2️⃣ Build and Output Settings (Otomatik)

"Build and Output Settings" bölümündeki toggle switch'ler **kapalı (off)** bırakın:
- ✅ **Build Command:** Otomatik (`npm run build` veya `next build`)
- ✅ **Install Command:** Otomatik (`npm install`)
- ✅ **Output Directory:** Otomatik (Next.js default: `.next`)

Vercel bu ayarları otomatik olarak algılayacak. Toggle switch'leri açmanıza gerek yok.

### 3️⃣ Environment Variables

**Settings → Environment Variables** sekmesine gidin ve ekleyin:

```
NEXT_PUBLIC_API_URL=https://your-backend-railway-url.railway.app
```

⚠️ Backend URL'inizi Railway'dan aldığınız URL ile değiştirin.

### 4️⃣ Deploy

"Deploy" butonuna tıklayın. Vercel:
1. `frontend` klasörüne gidecek
2. `npm install` çalıştıracak
3. `npm run build` çalıştıracak
4. `.next` klasöründen deploy edecek

## 📋 Kontrol Listesi

- [ ] Root Directory = `frontend` (Settings → General)
- [ ] Environment Variable eklendi: `NEXT_PUBLIC_API_URL`
- [ ] Build Command toggle = **OFF** (otomatik)
- [ ] Install Command toggle = **OFF** (otomatik)
- [ ] Output Directory toggle = **OFF** (otomatik)
- [ ] Deploy başlatıldı

## 🔍 Nerede Root Directory?

1. Vercel Dashboard → Projeniz
2. **"Settings"** sekmesine tıklayın
3. Sol menüden **"General"** seçin
4. Aşağı kaydırın → **"Root Directory"** bölümünü bulun
5. `frontend` yazın ve "Save" edin

## ⚠️ Önemli Notlar

- Root Directory ayarı **en önemli** ayardır
- Diğer ayarlar (Build Command, Install Command, Output Directory) Vercel tarafından otomatik algılanır
- Toggle switch'leri açmanıza gerek yok (kapalı bırakın)
- Environment Variable'ı mutlaka ekleyin (backend URL'i için)

## 🎉 Başarılı Deploy Sonrası

Deploy tamamlandıktan sonra:
1. Frontend URL'inizi not edin: `https://your-project.vercel.app`
2. Railway'a geri dönün
3. Backend service → Environment Variables
4. `ALLOWED_ORIGINS` değerini frontend URL'iniz ile güncelleyin



