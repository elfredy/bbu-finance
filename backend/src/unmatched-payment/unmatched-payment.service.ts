import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UnmatchedPayment } from './unmatched-payment.entity';

@Injectable()
export class UnmatchedPaymentService {
  constructor(
    @InjectRepository(UnmatchedPayment)
    private unmatchedPaymentRepository: Repository<UnmatchedPayment>,
  ) {}

  async createMany(payments: Partial<UnmatchedPayment>[]): Promise<UnmatchedPayment[]> {
    if (payments.length === 0) {
      return [];
    }

    // PaymentRefNum ile duplicate kontrolü yap
    const uniquePayments: Partial<UnmatchedPayment>[] = [];
    for (const payment of payments) {
      if (payment.paymentRefNum) {
        // PaymentRefNum ile kontrol et
        const existing = await this.unmatchedPaymentRepository.findOne({
          where: { paymentRefNum: payment.paymentRefNum },
        });
        if (existing) {
          console.log(`⏭️ PaymentRefNum zaten var, atlanıyor: ${payment.paymentRefNum}`);
          continue; // Bu ödemeyi atla
        }
      }
      uniquePayments.push(payment);
    }

    if (uniquePayments.length === 0) {
      return [];
    }

    // Chunk'lara böl (1000'lik parçalara)
    const chunkSize = 1000;
    const chunks = [];
    for (let i = 0; i < uniquePayments.length; i += chunkSize) {
      chunks.push(uniquePayments.slice(i, i + chunkSize));
    }

    const saved = [];
    for (const chunk of chunks) {
      const result = await this.unmatchedPaymentRepository.save(chunk);
      saved.push(...result);
    }

    return saved;
  }

  async findAll(): Promise<UnmatchedPayment[]> {
    return this.unmatchedPaymentRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async updateFin(id: number, fin: string): Promise<UnmatchedPayment | null> {
    const payment = await this.unmatchedPaymentRepository.findOne({ where: { id } });
    if (!payment) {
      return null;
    }
    payment.fin = fin.toUpperCase().trim();
    return this.unmatchedPaymentRepository.save(payment);
  }

  async clearAll(): Promise<void> {
    await this.unmatchedPaymentRepository
      .createQueryBuilder()
      .delete()
      .from(UnmatchedPayment)
      .execute();
  }
}
