import { Controller, Post, Delete, UseInterceptors, UploadedFile, HttpException, HttpStatus, Body, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from '../excel/excel.service';
import { PaymentService } from './payment.service';
import { StudentService } from '../student/student.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '../user/user.entity';

@Controller('api/payments')
export class PaymentController {
  constructor(
    private readonly excelService: ExcelService,
    private readonly paymentService: PaymentService,
    private readonly studentService: StudentService,
  ) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPaymentFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('fileType') fileType?: string,
  ) {
    if (!file) {
      throw new HttpException('Dosya bulunamadı', HttpStatus.BAD_REQUEST);
    }

    try {
      // Dosya tipine göre işle (json veya excel)
      const isJson = fileType === 'json' || file.originalname.endsWith('.json') || file.originalname.endsWith('.txt');
      
      if (isJson) {
        const result = await this.excelService.processPaymentJsonFile(file);
        return result;
      } else {
        const result = await this.excelService.processPaymentFile(file);
        return result;
      }
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Dosya işlenirken hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('clear')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async clearAllPayments() {
    try {
      // Tüm ödemeleri temizle
      const result = await this.paymentService.clearAll();
      
      // Tüm öğrencilerin ödəniş məbləğini sıfırla
      await this.studentService.resetAllOdemisMeblegi();
      
      return {
        success: true,
        message: `${result.deleted} ödeme kaydı silindi ve tüm öğrencilerin ödəniş məbləği sıfırlandı`,
        deleted: result.deleted,
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Ödemeler temizlenirken hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
