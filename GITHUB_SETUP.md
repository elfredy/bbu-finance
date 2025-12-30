# 📤 GitHub'a Yükleme Kılavuzu

Render ve Vercel deployment için önce projeyi GitHub'a yüklemeniz gerekiyor.

## 🔧 Adım Adım

### 1️⃣ Git Repository Başlatma

Terminal'de proje klasöründe şu komutları çalıştırın:

```bash
cd /Users/mac/Documents/B/BBU/businnes-finance

# Git repository başlat
git init

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "Initial commit: Business Finance Student Payment Tracking System"
```

### 2️⃣ GitHub'da Repository Oluşturma

1. GitHub'a gidin: https://github.com
2. Sağ üstteki "+" butonuna tıklayın → "New repository"
3. Repository bilgilerini girin:
   - **Repository name:** `business-finance` (veya istediğiniz isim)
   - **Description:** "Student Payment Tracking System"
   - **Visibility:** Public veya Private (tercihinize göre)
   - ⚠️ **"Initialize this repository with a README" seçeneğini işaretlemeyin** (zaten dosyalarımız var)
4. "Create repository" butonuna tıklayın

### 3️⃣ GitHub'a Yükleme

GitHub repository oluşturulduktan sonra, size verilen komutları çalıştırın. Genellikle şu şekilde:

```bash
# GitHub repository URL'inizi kullanın (örnek: https://github.com/kullaniciadi/business-finance.git)
git remote add origin https://github.com/KULLANICI_ADINIZ/REPOSITORY_ADI.git

# Ana branch'i main olarak ayarla
git branch -M main

# GitHub'a yükle
git push -u origin main
```

⚠️ **Not:** Eğer GitHub'da README oluşturduysanız, önce pull yapmanız gerekebilir:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### 4️⃣ Dosyaları Kontrol Edin

GitHub repository sayfanızda şu dosyaların olduğunu kontrol edin:
- ✅ `backend/` klasörü
- ✅ `frontend/` klasörü
- ✅ `DEPLOYMENT.md`
- ✅ `README_DEPLOYMENT.md`
- ✅ `.gitignore`
- ✅ `render.yaml`

### 5️⃣ Sonraki Adım: Deployment

GitHub'a yükledikten sonra:
1. **Render'da Backend deploy edin** (`DEPLOYMENT.md` dosyasındaki talimatları takip edin)
2. **Vercel'de Frontend deploy edin** (`DEPLOYMENT.md` dosyasındaki talimatları takip edin)

---

## 🔐 Güvenlik Notları

✅ `.gitignore` dosyası şunları hariç tutar:
- `node_modules/`
- `.env` dosyaları
- `dist/`, `.next/` gibi build dosyaları
- Excel dosyaları (`excel-files/*.xlsx`)

⚠️ **ÖNEMLİ:** Hiçbir zaman `.env` dosyalarını commit etmeyin! Environment variable'ları deployment platformlarında (Render, Vercel) manuel olarak ekleyin.

---

## 🐛 Sorun Giderme

### "Permission denied" hatası:
```bash
# SSH key kullanıyorsanız, GitHub'a SSH key ekleyin
# veya HTTPS kullanın:
git remote set-url origin https://github.com/KULLANICI_ADINIZ/REPOSITORY_ADI.git
```

### "Repository not found" hatası:
- Repository adını ve kullanıcı adını kontrol edin
- GitHub'da repository'nin oluşturulduğundan emin olun

### Büyük dosya hatası:
```bash
# .gitignore dosyasının çalıştığından emin olun
git status
# Eğer node_modules görünüyorsa:
git rm -r --cached node_modules
git commit -m "Remove node_modules from git"
```

