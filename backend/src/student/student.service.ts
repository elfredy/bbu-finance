import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.entity';

export interface StudentFilter {
  kurs?: string;
  qrup?: string;
  fakulte?: string;
  qebulIli?: string;
  fin?: string;
  onlyWithPayments?: boolean;
}

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async findAll(): Promise<Student[]> {
    return this.studentRepository.find({
      order: { fin: 'ASC' },
    });
  }

  async findByFilters(filters: StudentFilter, skip: number = 0, take: number = 100): Promise<Student[]> {
    const query = this.studentRepository.createQueryBuilder('student');

    // Sadece aktif öğrencileri getir
    query.where('student.active = :active', { active: true });

    // Sadece ödemesi olan öğrencileri getir
    if (filters.onlyWithPayments) {
      query.andWhere('student.odemisMeblegi IS NOT NULL AND student.odemisMeblegi > 0');
    }

    if (filters.kurs) {
      query.andWhere('student.kurs = :kurs', { kurs: filters.kurs });
    }

    if (filters.qrup) {
      query.andWhere('student.qrup = :qrup', { qrup: filters.qrup });
    }

    if (filters.fakulte) {
      query.andWhere('student.fakulte = :fakulte', { fakulte: filters.fakulte });
    }

    if (filters.qebulIli) {
      query.andWhere('student.qebulIli = :qebulIli', { qebulIli: filters.qebulIli });
    }

    if (filters.fin) {
      query.andWhere('student.fin ILIKE :fin', { fin: `%${filters.fin.toUpperCase()}%` });
    }

    return query.skip(skip).take(take).orderBy('student.fin', 'ASC').getMany();
  }

  async countByFilters(filters: StudentFilter): Promise<number> {
    const query = this.studentRepository.createQueryBuilder('student');

    // Sadece aktif öğrencileri say
    query.where('student.active = :active', { active: true });

    // Sadece ödemesi olan öğrencileri say
    if (filters.onlyWithPayments) {
      query.andWhere('student.odemisMeblegi IS NOT NULL AND student.odemisMeblegi > 0');
    }

    if (filters.kurs) {
      query.andWhere('student.kurs = :kurs', { kurs: filters.kurs });
    }

    if (filters.qrup) {
      query.andWhere('student.qrup = :qrup', { qrup: filters.qrup });
    }

    if (filters.fakulte) {
      query.andWhere('student.fakulte = :fakulte', { fakulte: filters.fakulte });
    }

    if (filters.qebulIli) {
      query.andWhere('student.qebulIli = :qebulIli', { qebulIli: filters.qebulIli });
    }

    if (filters.fin) {
      query.andWhere('student.fin ILIKE :fin', { fin: `%${filters.fin.toUpperCase()}%` });
    }

    return query.getCount();
  }

  async createMany(students: Partial<Student>[]): Promise<Student[]> {
    // FIN'leri normalize et ve duplicate'leri filtrele
    const studentsMap = new Map<string, Partial<Student>>();
    
    students.forEach(s => {
      const fin = s.fin?.toString().toUpperCase().trim();
      if (fin) {
        studentsMap.set(fin, {
          ...s,
          fin,
        });
      }
    });
    
    const uniqueStudents = Array.from(studentsMap.values());
    
    if (uniqueStudents.length === 0) {
      return [];
    }
    
    // Chunk'lara böl (1000'lik parçalara)
    const chunkSize = 1000;
    const chunks = [];
    for (let i = 0; i < uniqueStudents.length; i += chunkSize) {
      chunks.push(uniqueStudents.slice(i, i + chunkSize));
    }
    
    const saved = [];
    for (const chunk of chunks) {
      const result = await this.studentRepository.save(chunk);
      saved.push(...result);
    }
    
    return saved;
  }

  async clearAll(): Promise<void> {
    await this.studentRepository
      .createQueryBuilder()
      .delete()
      .from(Student)
      .execute();
  }

  async getCount(): Promise<number> {
    return this.studentRepository.count();
  }

  async findByFin(fin: string): Promise<Student | null> {
    return this.studentRepository.findOne({ where: { fin: fin.toUpperCase().trim() } });
  }

  async updateOdemisMeblegi(studentId: number, amount: number): Promise<void> {
    await this.studentRepository
      .createQueryBuilder()
      .update(Student)
      .set({ odemisMeblegi: amount })
      .where('id = :id', { id: studentId })
      .execute();
  }

  // Filtre seçeneklerini getir (kategorize edilmiş) - sadece aktif öğrenciler
  async getFilterOptions(): Promise<{
    kurs: string[];
    qrup: string[];
    fakulte: string[];
    qebulIli: string[];
  }> {
    const students = await this.studentRepository.find({
      where: { active: true },
      order: { fin: 'ASC' },
    });

    const kursSet = new Set<string>();
    const qrupSet = new Set<string>();
    const fakulteSet = new Set<string>();
    const qebulIliSet = new Set<string>();

    students.forEach((student) => {
      if (student.kurs) kursSet.add(student.kurs);
      if (student.qrup) qrupSet.add(student.qrup);
      if (student.fakulte) fakulteSet.add(student.fakulte);
      if (student.qebulIli) qebulIliSet.add(student.qebulIli);
    });

    return {
      kurs: Array.from(kursSet).sort(),
      qrup: Array.from(qrupSet).sort(),
      fakulte: Array.from(fakulteSet).sort(),
      qebulIli: Array.from(qebulIliSet).sort(),
    };
  }

  // Tüm qrupları getir (qrup adı, öğrenci sayısı ve aktif durumu ile)
  async getAllGroups(): Promise<Array<{ qrup: string; studentCount: number; activeCount: number; isActive: boolean }>> {
    const students = await this.studentRepository.find();
    
    const groupMap = new Map<string, { total: number; active: number }>();
    
    students.forEach((student) => {
      if (student.qrup) {
        const current = groupMap.get(student.qrup) || { total: 0, active: 0 };
        current.total++;
        if (student.active) {
          current.active++;
        }
        groupMap.set(student.qrup, current);
      }
    });

    return Array.from(groupMap.entries())
      .map(([qrup, counts]) => ({ 
        qrup, 
        studentCount: counts.total,
        activeCount: counts.active,
        isActive: counts.active > 0 // Qrup aktif kabul edilir eğer en az 1 aktif öğrenci varsa
      }))
      .sort((a, b) => a.qrup.localeCompare(b.qrup));
  }

  // Bir qrupun tüm öğrencilerini aktif/pasif yap
  async toggleGroupActive(qrup: string, active: boolean): Promise<{ updated: number }> {
    const result = await this.studentRepository
      .createQueryBuilder()
      .update(Student)
      .set({ active })
      .where('qrup = :qrup', { qrup })
      .execute();

    return { updated: result.affected || 0 };
  }

  // Bir qrupun öğrencilerini getir
  async getStudentsByGroup(qrup: string): Promise<Student[]> {
    return this.studentRepository.find({
      where: { qrup },
      order: { fin: 'ASC' },
    });
  }

  // Bir öğrenciyi aktif/pasif yap
  async toggleStudentActive(studentId: number, active: boolean): Promise<{ updated: number }> {
    const result = await this.studentRepository
      .createQueryBuilder()
      .update(Student)
      .set({ active })
      .where('id = :id', { id: studentId })
      .execute();

    return { updated: result.affected || 0 };
  }

  // Bir qrupun tüm öğrencilerinin illik məbləğini güncelle
  async updateGroupIllik(qrup: string, mebleg: number): Promise<{ updated: number }> {
    const result = await this.studentRepository
      .createQueryBuilder()
      .update(Student)
      .set({ 
        illik: mebleg.toString()
      })
      .where('qrup = :qrup', { qrup })
      .execute();

    return { updated: result.affected || 0 };
  }

  // Tüm öğrencilerin ödəniş məbləğini sıfırla
  async resetAllOdemisMeblegi(): Promise<{ updated: number }> {
    const result = await this.studentRepository
      .createQueryBuilder()
      .update(Student)
      .set({ odemisMeblegi: 0 })
      .execute();

    return { updated: result.affected || 0 };
  }
}
