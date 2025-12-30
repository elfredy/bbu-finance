import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnmatchedPayment } from './unmatched-payment.entity';
import { UnmatchedPaymentService } from './unmatched-payment.service';
import { UnmatchedPaymentController } from './unmatched-payment.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UnmatchedPayment])],
  controllers: [UnmatchedPaymentController],
  providers: [UnmatchedPaymentService],
  exports: [UnmatchedPaymentService],
})
export class UnmatchedPaymentModule {}
