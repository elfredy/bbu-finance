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

    // Chunk'lara böl (1000'lik parçalara)
    const chunkSize = 1000;
    const chunks = [];
    for (let i = 0; i < payments.length; i += chunkSize) {
      chunks.push(payments.slice(i, i + chunkSize));
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

  async clearAll(): Promise<void> {
    await this.unmatchedPaymentRepository
      .createQueryBuilder()
      .delete()
      .from(UnmatchedPayment)
      .execute();
  }
}
