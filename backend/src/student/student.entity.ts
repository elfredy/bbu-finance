import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('students')
@Index(['fin'])
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  fin: string; // FIN kodu

  @Column({ nullable: true })
  adSoyad: string; // Ad Soyad

  @Column({ nullable: true })
  kurs: string; // Kurs

  @Column({ nullable: true })
  qrup: string; // Qrup

  @Column({ nullable: true })
  fakulte: string; // Fakultə

  @Column({ nullable: true })
  ixtisas: string; // İxtisas

  @Column({ nullable: true })
  qebulIli: string; // Qəbul ili

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, default: 0 })
  odemisMeblegi: number; // Ödəniş məbləği

  @Column({ nullable: true })
  illik: string; // İllik

  @Column({ type: 'boolean', default: true })
  active: boolean; // Aktif/Pasif durumu

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
