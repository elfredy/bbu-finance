import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('unmatched_payments')
@Index(['fin'])
@Index(['paymentRefNum'])
export class UnmatchedPayment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fin: string; // FIN kodu (eğer varsa)

  @Column({ nullable: true })
  senderName: string; // Gönderen adı

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number; // Məbləğ

  @Column({ type: 'date', nullable: true })
  paymentDate: Date; // Ödəniş tarihi

  @Column({ nullable: true, unique: true })
  paymentRefNum: string; // PaymentRefNum - duplicate kontrolü için

  @Column({ type: 'jsonb', nullable: true })
  paymentData: any; // Orijinal Excel satırı

  @CreateDateColumn()
  createdAt: Date;
}
