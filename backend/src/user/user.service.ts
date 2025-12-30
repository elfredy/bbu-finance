import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async createUser(username: string, password: string, role: UserRole): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.userRepository.create({
      username,
      password: hashedPassword,
      role,
    });
    return this.userRepository.save(user);
  }

  async initializeDefaultUsers(): Promise<void> {
    // Superadmin kullanıcısını kontrol et ve oluştur
    const superadmin = await this.findByUsername('superadmin');
    if (!superadmin) {
      // Güvenli şifre: SuperAdmin@2024!Secure
      await this.createUser('superadmin', 'SuperAdmin@2024!Secure', UserRole.SUPERADMIN);
      console.log('✅ Superadmin kullanıcısı oluşturuldu');
      console.log('   Username: superadmin');
      console.log('   Password: SuperAdmin@2024!Secure');
    }

    // bbu-finance kullanıcısını kontrol et ve oluştur
    const bbuFinance = await this.findByUsername('bbu-finance');
    if (!bbuFinance) {
      // Güvenli şifre: BBUFinance@2024!Access
      await this.createUser('bbu-finance', 'BBUFinance@2024!Access', UserRole.BBU_FINANCE);
      console.log('✅ bbu-finance kullanıcısı oluşturuldu');
      console.log('   Username: bbu-finance');
      console.log('   Password: BBUFinance@2024!Access');
    }
  }
}

