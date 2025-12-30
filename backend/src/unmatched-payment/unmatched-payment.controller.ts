import { Controller, Get, Patch, Delete, Param, Body, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { UnmatchedPaymentService } from './unmatched-payment.service';
import { StudentService } from '../student/student.service';
import { PaymentService } from '../payment/payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '../user/user.entity';

@Controller('api/unmatched-payments')
export class UnmatchedPaymentController {
  constructor(
    private readonly unmatchedPaymentService: UnmatchedPaymentService,
    private readonly studentService: StudentService,
    private readonly paymentService: PaymentService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async getAll() {
    return this.unmatchedPaymentService.findAll();
  }

  @Patch(':id/fin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async updateFin(@Param('id') id: number, @Body() body: { fin: string }) {
    const { fin } = body;
    if (!fin || fin.trim() === '') {
      throw new Error('FIN boş olamaz');
    }

    // Unmatched payment'ı güncelle
    const updatedPayment = await this.unmatchedPaymentService.updateFin(id, fin);
    if (!updatedPayment) {
      throw new Error('Ödeme bulunamadı');
    }

    // Student'te bu FIN varsa amount'u güncelle
    const student = await this.studentService.findByFin(fin);
    if (student) {
      // Mevcut ödemelerin toplamını al
      const currentTotal = await this.paymentService.getTotalAmountByStudentId(student.id);
      // Yeni ödemeyi ekle
      const newTotal = currentTotal + Number(updatedPayment.amount);
      await this.studentService.updateOdemisMeblegi(student.id, newTotal);
      
      // Payment kaydı oluştur
      await this.paymentService.createMany([{
        studentId: student.id,
        amount: updatedPayment.amount,
        paymentDate: updatedPayment.paymentDate || new Date(),
        bankUniqueId: null,
      }]);
    }

    return updatedPayment;
  }

  @Delete('clear')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async clearAll() {
    try {
      await this.unmatchedPaymentService.clearAll();
      return {
        success: true,
        message: 'Bütün eşleşməyən ödənişlər silindi',
      };
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Eşleşmeyen ödemeler temizlenirken hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
