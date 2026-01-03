import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { StudentModule } from './student/student.module';
import { ExcelModule } from './excel/excel.module';
import { PaymentModule } from './payment/payment.module';
import { UnmatchedPaymentModule } from './unmatched-payment/unmatched-payment.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Student } from './student/student.entity';
import { Payment } from './payment/payment.entity';
import { UnmatchedPayment } from './unmatched-payment/unmatched-payment.entity';
import { User } from './user/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'business_finance',
      entities: [Student, Payment, UnmatchedPayment, User],
      synchronize: process.env.NODE_ENV !== 'production', // Production'da false olmalı
      logging: process.env.NODE_ENV === 'development',
    }),
    UserModule,
    AuthModule,
    StudentModule,
    ExcelModule,
    PaymentModule,
    UnmatchedPaymentModule,
  ],
})
export class AppModule {}
