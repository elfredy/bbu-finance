import { Controller, Get } from '@nestjs/common';
import { UnmatchedPaymentService } from './unmatched-payment.service';

@Controller('api/unmatched-payments')
export class UnmatchedPaymentController {
  constructor(private readonly unmatchedPaymentService: UnmatchedPaymentService) {}

  @Get()
  async getAll() {
    return this.unmatchedPaymentService.findAll();
  }
}
