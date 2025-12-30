import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { StudentService } from '../student/student.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @Inject(forwardRef(() => StudentService))
    private studentService: StudentService,
  ) {}

  async createMany(payments: Partial<Payment>[]): Promise<Payment[]> {
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
      const result = await this.paymentRepository.save(chunk);
      saved.push(...result);
    }

    return saved;
  }

  async findByStudentId(studentId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { studentId },
      order: { paymentDate: 'DESC' },
    });
  }

  async findByBankUniqueId(bankUniqueId: string): Promise<Payment | null> {
    if (!bankUniqueId) {
      return null;
    }
    return this.paymentRepository.findOne({
      where: { bankUniqueId },
    });
  }

  async deleteByStudentId(studentId: number): Promise<void> {
    await this.paymentRepository.delete({ studentId });
  }

  async getTotalAmountByStudentId(studentId: number): Promise<number> {
    const result = await this.paymentRepository
      .createQueryBuilder('payment')
      .select('SUM(payment.amount)', 'total')
      .where('payment.studentId = :studentId', { studentId })
      .getRawOne();

    return parseFloat(result?.total || '0');
  }

  async clearAll(): Promise<{ deleted: number }> {
    const result = await this.paymentRepository
      .createQueryBuilder()
      .delete()
      .from(Payment)
      .execute();

    return { deleted: result.affected || 0 };
  }
}
