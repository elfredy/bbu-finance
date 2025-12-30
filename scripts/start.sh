#!/bin/bash

# PostgreSQL'i Docker ile başlat
echo "🚀 PostgreSQL'i başlatıyorum..."
docker compose up -d

# PostgreSQL'in hazır olmasını bekle
echo "⏳ PostgreSQL'in hazır olmasını bekliyorum..."
sleep 5

# Backend'i başlat
echo "🚀 Backend'i başlatıyorum..."
cd backend
npm install
npm run start:dev &

# Frontend'i başlat
echo "🚀 Frontend'i başlatıyorum..."
cd ../frontend
npm install
npm run dev

