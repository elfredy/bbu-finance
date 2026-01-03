import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS ayarları - production'da environment variable'dan, development'ta localhost
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000'];
  
  app.enableCors({
    origin: (origin, callback) => {
      // Production'da origin kontrolü yap
      if (process.env.NODE_ENV === 'production') {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('CORS policy violation'));
        }
      } else {
        // Development'ta tüm origin'lere izin ver
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  
  // Validation pipe - güvenlik için
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Sadece tanımlı property'leri kabul et
    forbidNonWhitelisted: true, // Tanımlı olmayan property'leri reddet
    transform: true, // Otomatik type dönüşümü
  }));

  // Production'da güvenlik kontrolleri
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET environment variable is required in production!');
    }
    if (process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
      throw new Error('JWT_SECRET must be changed from default value in production!');
    }
  }

  const port = process.env.PORT || 5001;
  await app.listen(port);
  console.log(`🚀 Backend server running on port ${port}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('🔒 Production mode: Security checks enabled');
  }
}
bootstrap();
