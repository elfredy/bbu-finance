#!/bin/bash

echo "🔍 Port 5000'i kullanan process'leri arıyorum..."

# Port 5000'i kullanan tüm process'leri bul ve durdur
PIDS=$(lsof -ti:5000 2>/dev/null)

if [ -z "$PIDS" ]; then
    echo "✅ Port 5000 boş, hiçbir process bulunamadı"
    exit 0
fi

echo "⚠️  Port 5000'de çalışan process'ler bulundu:"
for PID in $PIDS; do
    echo "   PID: $PID"
    ps -p $PID -o command= 2>/dev/null || echo "   (Process bilgisi alınamadı)"
done

echo ""
echo "🛑 Process'ler durduruluyor..."
for PID in $PIDS; do
    kill -9 $PID 2>/dev/null && echo "   ✅ PID $PID durduruldu" || echo "   ❌ PID $PID durdurulamadı"
done

sleep 1

# Tekrar kontrol et
REMAINING=$(lsof -ti:5000 2>/dev/null)
if [ -z "$REMAINING" ]; then
    echo ""
    echo "✅ Port 5000 başarıyla temizlendi!"
else
    echo ""
    echo "⚠️  Bazı process'ler hala çalışıyor: $REMAINING"
    echo "   Manuel olarak durdurmak için: kill -9 $REMAINING"
fi




