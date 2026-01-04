# 🔒 Railway JWT_SECRET Hatası Çözümü

## ❌ Hata Mesajı

```
Error: JWT_SECRET environment variable is required in production!
```

## ✅ Çözüm

Railway'de `JWT_SECRET` environment variable'ını eklemeniz gerekiyor.

### Adım 1: Railway Dashboard'a Gidin

1. Railway Dashboard'u açın: https://railway.app
2. Projenizi seçin
3. Backend service'inize tıklayın

### Adım 2: Variables Sekmesine Gidin

1. Service sayfasında **"Variables"** sekmesine tıklayın
2. **"Raw Editor"** butonuna tıklayın (veya manuel olarak ekleyin)

### Adım 3: JWT_SECRET Ekleyin

Aşağıdaki satırı ekleyin:

```env
JWT_SECRET=your-very-strong-random-secret-key-min-32-characters-long
```

### Adım 4: Güçlü Bir Secret Oluşturun

Güvenli bir `JWT_SECRET` oluşturmak için:

**Mac/Linux:**
```bash
openssl rand -base64 32
```

**Windows (PowerShell):**
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Online Tool:**
- https://www.random.org/strings/ adresini kullanabilirsiniz
- Length: 32, Characters: a-z, A-Z, 0-9, !@#$%^&*

### Adım 5: Örnek JWT_SECRET

```env
JWT_SECRET=K8mN2pQ5rT9vW3xZ7aB1dF4gH6jL0oM8nP2qR5sT8uV1wX4yZ7aB0cD3eF6gH9
```

**ÖNEMLİ:** Yukarıdaki örneği kullanmayın! Kendi unique secret'ınızı oluşturun.

### Adım 6: Deploy

1. "Save" veya "Deploy" butonuna tıklayın
2. Railway otomatik olarak yeniden deploy edecek
3. Log'ları kontrol edin - artık hata olmamalı

## 📋 Tüm Gerekli Environment Variables

Railway'de şu environment variable'ların olması gerekiyor:

```env
NODE_ENV=production
PORT=5000

# JWT Secret - ZORUNLU!
JWT_SECRET=your-very-strong-random-secret-key-min-32-characters-long

# Database (Railway otomatik ekler)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USER=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_NAME=${{Postgres.PGDATABASE}}

# CORS (Frontend URL'inizi ekleyin)
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

## 🔍 Kontrol

Deploy sonrası log'ları kontrol edin:

1. Service → "Deployments" → En son deployment → "View logs"
2. Şu mesajı görmelisiniz:
   ```
   🚀 Backend server running on port 5000
   🔒 Production mode: Security checks enabled
   ```

## ⚠️ Güvenlik Uyarısı

- `JWT_SECRET`'ı asla commit etmeyin (zaten .gitignore'da)
- Her production ortamı için farklı bir secret kullanın
- Secret'ı düzenli olarak değiştirin (önerilen: 6 ayda bir)
- Secret'ı güvenli bir yerde saklayın (password manager)

## 🆘 Hala Çalışmıyor mu?

1. **Railway'de Variables'ı kontrol edin:**
   - Service → Variables → `JWT_SECRET` var mı?
   - Değer boş mu? (boş olmamalı)

2. **Redeploy yapın:**
   - Service → Settings → "Redeploy" butonuna tıklayın

3. **Log'ları kontrol edin:**
   - Service → Deployments → Latest → View logs
   - Hata mesajını paylaşın

