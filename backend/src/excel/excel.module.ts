import { Module, forwardRef } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { ExcelController } from './excel.controller';
import { StudentModule } from '../student/student.module';
import { PaymentModule } from '../payment/payment.module';
import { UnmatchedPaymentModule } from '../unmatched-payment/unmatched-payment.module';

@Module({
  imports: [
    forwardRef(() => StudentModule),
    forwardRef(() => PaymentModule),
    UnmatchedPaymentModule,
  ],
  controllers: [ExcelController],
  providers: [ExcelService],
  exports: [ExcelService],
})
export class ExcelModule {}
