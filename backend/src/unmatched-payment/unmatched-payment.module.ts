import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnmatchedPayment } from './unmatched-payment.entity';
import { UnmatchedPaymentService } from './unmatched-payment.service';
import { UnmatchedPaymentController } from './unmatched-payment.controller';
import { StudentModule } from '../student/student.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnmatchedPayment]),
    forwardRef(() => StudentModule),
    forwardRef(() => PaymentModule),
  ],
  controllers: [UnmatchedPaymentController],
  providers: [UnmatchedPaymentService],
  exports: [UnmatchedPaymentService],
})
export class UnmatchedPaymentModule {}
