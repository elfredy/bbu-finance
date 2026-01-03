import { Controller, Post, Body, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    // Input validation
    if (!loginDto.username || !loginDto.password) {
      throw new BadRequestException('Kullanıcı adı ve şifre zorunludur');
    }

    if (typeof loginDto.username !== 'string' || typeof loginDto.password !== 'string') {
      throw new BadRequestException('Geçersiz veri formatı');
    }

    // Trim ve length kontrolü
    const username = loginDto.username.trim();
    const password = loginDto.password.trim();

    if (username.length === 0 || password.length === 0) {
      throw new BadRequestException('Kullanıcı adı ve şifre boş olamaz');
    }

    if (username.length > 100 || password.length > 200) {
      throw new BadRequestException('Kullanıcı adı veya şifre çok uzun');
    }

    const user = await this.authService.validateUser(username, password);
    if (!user) {
      // Aynı hata mesajı - timing attack'leri önlemek için
      throw new HttpException('Geçersiz kullanıcı adı veya şifre', HttpStatus.UNAUTHORIZED);
    }
    return this.authService.login(user);
  }
}


