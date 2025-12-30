import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // CORS ayarları - production'da environment variable'dan, development'ta localhost
  const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000'];
  
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });
  
  // Validation pipe
  app.useGlobalPipes(new ValidationPipe());

  const port = process.env.PORT || 5001;
  await app.listen(port);
  console.log(`🚀 Backend server running on port ${port}`);
}
bootstrap();
