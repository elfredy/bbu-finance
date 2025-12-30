#!/bin/bash

echo "🔍 Port 5000'i kullanan process'leri kontrol ediyorum..."
PORT_PID=$(lsof -ti:5000 2>/dev/null)

if [ ! -z "$PORT_PID" ]; then
    echo "⚠️  Port 5000'de process bulundu (PID: $PORT_PID). Durduruluyor..."
    kill -9 $PORT_PID 2>/dev/null
    echo "✅ Process durduruldu"
else
    echo "✅ Port 5000 boş"
fi

echo ""
echo "🐘 PostgreSQL'i kontrol ediyorum..."
if docker compose ps postgres 2>/dev/null | grep -q "Up"; then
    echo "✅ PostgreSQL çalışıyor"
else
    echo "⚠️  PostgreSQL çalışmıyor. Başlatılıyor..."
    docker compose up -d postgres
    echo "⏳ PostgreSQL'in hazır olması bekleniyor (5 saniye)..."
    sleep 5
    echo "✅ PostgreSQL hazır"
fi

echo ""
echo "✅ Hazır! Backend'i başlatabilirsiniz:"
echo "   cd backend && npm run start:dev"




