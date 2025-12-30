# Business Finance - Öğrenci Ödeme Takip Sistemi

## 📋 Proje Açıklaması

Bu proje, öğrenci ödeme takibi için geliştirilmiş bir web uygulamasıdır. İki Excel dosyasını karşılaştırarak FIN numaralarına göre eşleştirme yapar.

### Özellikler

1. **Ana DB Yükleme**: Öğrenci bilgilerini içeren Excel dosyası (grup, kurs, fakülte, FIN, ad, soyad) PostgreSQL'e kaydedilir
2. **Ödeme Dosyası İşleme**: Ödeme bilgilerini içeren Excel dosyasını yükleyerek FIN'lere göre eşleştirme yapılır
3. **FIN Eşleştirme**: İki dosyadaki FIN numaralarını eşleştirerek sonuçları gösterir
4. **Modern UI**: Tailwind CSS ile güzel ve kullanıcı dostu arayüz

## 🛠️ Teknolojiler

- **Frontend**: Next.js 14+ (TypeScript, Tailwind CSS)
- **Backend**: NestJS (TypeScript, Express)
- **Database**: PostgreSQL
- **Excel İşleme**: xlsx

## 📁 Proje Yapısı

```
businnes-finance/
├── frontend/          # Next.js frontend uygulaması
│   ├── app/          # Next.js app directory
│   └── package.json
├── backend/           # NestJS backend API
│   ├── src/
│   │   ├── excel/    # Excel işleme modülü
│   │   ├── student/  # Öğrenci entity ve service
│   │   └── main.ts   # Uygulama giriş noktası
│   └── package.json
└── excel-files/       # Test Excel dosyaları için (opsiyonel)
```

## 🚀 Kurulum ve Çalıştırma

### Ön Gereksinimler

- Node.js 18+ 
- Docker ve Docker Compose (PostgreSQL için)
- npm veya yarn

### 1. PostgreSQL Veritabanı Kurulumu (Docker ile)

```bash
# Docker Compose ile PostgreSQL'i başlat
docker compose up -d

# PostgreSQL'in hazır olup olmadığını kontrol et
docker compose ps
```

**Not:** Docker Compose v2 kullanılıyorsa `docker compose` (boşlukla) komutunu kullanın. Eski versiyonlarda `docker-compose` (tire ile) kullanılır.

PostgreSQL `localhost:5432` adresinde çalışacak.

**Not:** Eğer Docker kullanmak istemiyorsanız, yerel PostgreSQL kurulumu yapabilirsiniz:
```bash
# Homebrew ile PostgreSQL kurulumu (Mac)
brew install postgresql@15
brew services start postgresql@15

# Veritabanı oluştur
createdb business_finance
```

### 2. Backend Kurulumu

```bash
cd backend

# Bağımlılıkları yükle
npm install

# .env dosyası zaten oluşturulmuş (Docker için hazır)
# Eğer yerel PostgreSQL kullanıyorsanız, .env dosyasını düzenleyin

# Backend'i başlat (development mode)
npm run start:dev
```

**Önemli:** Backend'i başlatmadan önce `docker compose up -d` ile PostgreSQL'in çalıştığından emin olun!

Backend `http://localhost:5001` adresinde çalışacak.

### 3. Frontend Kurulumu

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Frontend'i başlat
npm run dev
```

Frontend `http://localhost:3000` adresinde çalışacak.

## 📊 Excel Dosya Formatı

### Ana DB Excel (main_db.xlsx)

Sütunlar (büyük/küçük harf duyarsız):
- **Grup** (veya Group)
- **Kurs** (veya Course)
- **Fakülte** (veya Faculty)
- **FIN** (zorunlu)
- **Ad** (veya Name, Firstname)
- **Soyad** (veya Surname, Lastname)

### Ödeme Excel (payment.xlsx)

Sütunlar (büyük/küçük harf duyarsız):
- **FIN** (zorunlu, eşleştirme için kullanılır)
- **Ad** (opsiyonel)
- **Soyad** (opsiyonel)
- **Ödeme** (veya diğer ödeme bilgileri - opsiyonel)

## 🎯 Kullanım

1. Tarayıcıda `http://localhost:3000` adresine gidin
2. Ana veritabanı Excel dosyasını yükleyin
3. Ödeme Excel dosyasını yükleyin
4. Eşleşen kayıtlar otomatik olarak tabloda gösterilir

## 🔧 API Endpoints

- `POST /api/upload-main-db` - Ana DB Excel dosyasını yükle
- `POST /api/process-payment-file` - Ödeme Excel dosyasını işle ve eşleştir
- `GET /api/main-db-info` - Ana DB bilgilerini getir

## 📝 Notlar

- FIN numaraları otomatik olarak normalize edilir (büyük harf, boşluk temizleme)
- Sütun isimleri büyük/küçük harf ve boşluk duyarsızdır
- Ana DB yüklendiğinde mevcut kayıtlar temizlenir (sadece son yüklenen dosya kalır)
