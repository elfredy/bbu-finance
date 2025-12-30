 import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Student } from '../student/student.entity';

@Entity('payments')
@Index(['studentId'])
@Index(['paymentDate'])
@Index(['bankUniqueId'], { unique: true, where: '"bankUniqueId" IS NOT NULL' })
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  studentId: number;

  @ManyToOne(() => Student, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'studentId' })
  student: Student;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'date' })
  paymentDate: Date;

  @Column({ nullable: true, unique: true })
  bankUniqueId: string; // BankUniqueId - duplicate kontrolü için

  @CreateDateColumn()
  createdAt: Date;
}
