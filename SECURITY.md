# Güvenlik Rehberi

## Production Deployment Öncesi Kontrol Listesi

### 1. Environment Variables (Zorunlu)

Aşağıdaki environment variable'ları production'da mutlaka ayarlayın:

```bash
# JWT Secret - Güçlü bir random string kullanın (en az 32 karakter)
JWT_SECRET=your-very-strong-random-secret-key-min-32-chars

# Database
DB_HOST=your-db-host
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-strong-db-password
DB_NAME=your-db-name

# CORS - Frontend URL'lerini virgülle ayırarak ekleyin
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Node Environment
NODE_ENV=production

# JWT Expiration (opsiyonel, varsayılan 7d)
JWT_EXPIRES_IN=7d
```

### 2. Güvenlik Özellikleri

✅ **JWT Authentication** - Tüm API endpoint'leri korumalı
✅ **Role-Based Access Control** - Superadmin ve bbu-finance rolleri
✅ **Password Hashing** - Bcrypt ile şifre hash'leme
✅ **Input Validation** - Tüm input'lar validate ediliyor
✅ **CORS Protection** - Sadece izin verilen origin'ler
✅ **SQL Injection Protection** - TypeORM ile parametreli sorgular

### 3. Varsayılan Kullanıcılar

Sistem ilk başlatıldığında otomatik oluşturulan kullanıcılar:

- **superadmin** / `SuperAdmin@2024!Secure`
- **bbu-finance** / `BBUFinance@2024!Access`

**ÖNEMLİ:** Production'da bu şifreleri mutlaka değiştirin!

### 4. Güvenlik Önerileri

1. **HTTPS Kullanın** - Tüm trafik HTTPS üzerinden olmalı
2. **JWT_SECRET Güçlü Olmalı** - En az 32 karakter, random string
3. **Database Şifreleri Güçlü Olmalı** - En az 16 karakter
4. **CORS Sadece Gerekli Domain'ler** - Wildcard kullanmayın
5. **Rate Limiting** - Production'da rate limiting ekleyin (opsiyonel)
6. **Logging** - Tüm giriş denemelerini loglayın
7. **Backup** - Düzenli database backup'ları alın

### 5. Kullanıcı Yönetimi

- Her kullanıcıya kendi login bilgilerini verin
- Şifreleri düzenli olarak değiştirin
- Kullanılmayan hesapları devre dışı bırakın

### 6. Production Checklist

- [ ] JWT_SECRET ayarlandı ve güçlü
- [ ] Database şifreleri güçlü
- [ ] CORS sadece gerekli domain'ler
- [ ] HTTPS aktif
- [ ] Varsayılan şifreler değiştirildi
- [ ] NODE_ENV=production ayarlandı
- [ ] Database backup stratejisi hazır
- [ ] Error logging aktif

### 7. Güvenlik Açıkları Raporlama

Güvenlik açığı bulursanız lütfen hemen bildirin.

