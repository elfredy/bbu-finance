import { Controller, Get, Post, Query, Body, Param, Inject, forwardRef, UseGuards } from '@nestjs/common';
import { StudentService, StudentFilter } from './student.service';
import { PaymentService } from '../payment/payment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { UserRole } from '../user/user.entity';

@Controller('api/students')
export class StudentController {
  constructor(
    private readonly studentService: StudentService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
  ) {}

  @Get()
  // Ana sayfa - herkese açık (login gerekmez)
  async getStudents(
    @Query() filters: StudentFilter,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '100',
    @Query('onlyWithPayments') onlyWithPayments?: string,
  ) {
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 100;
    const skip = (pageNum - 1) * limitNum;
    
    // onlyWithPayments parametresini boolean'a çevir
    if (onlyWithPayments !== undefined) {
      filters.onlyWithPayments = onlyWithPayments === 'true' || onlyWithPayments === '1';
    }
    
    const students = await this.studentService.findByFilters(filters, skip, limitNum);
    const total = await this.studentService.countByFilters(filters);
    
    return {
      data: students,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  }

  @Get('filter-options')
  // Ana sayfa - herkese açık
  async getFilterOptions() {
    return this.studentService.getFilterOptions();
  }

  @Get('count')
  // Ana sayfa - herkese açık
  async getStudentCount() {
    const count = await this.studentService.getCount();
    return { count, message: `Veritabanında ${count} öğrenci kaydı var` };
  }

  @Get('groups')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async getAllGroups() {
    return this.studentService.getAllGroups();
  }

  @Post('groups/update-illik')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async updateGroupIllik(@Body() body: { qrup: string; mebleg: number }) {
    if (!body.qrup || body.mebleg === undefined) {
      throw new Error('Qrup ve məbləğ zorunludur');
    }
    return this.studentService.updateGroupIllik(body.qrup, body.mebleg);
  }

  @Post('groups/toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async toggleGroupActive(@Body() body: { qrup: string; active: boolean }) {
    if (!body.qrup || body.active === undefined) {
      throw new Error('Qrup ve active durumu zorunludur');
    }
    return this.studentService.toggleGroupActive(body.qrup, body.active);
  }

  @Get('groups/:qrup/students')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async getStudentsByGroup(@Param('qrup') qrup: string) {
    return this.studentService.getStudentsByGroup(qrup);
  }

  @Post('toggle-active')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async toggleStudentActive(@Body() body: { studentId: number; active: boolean }) {
    if (!body.studentId || body.active === undefined) {
      throw new Error('Öğrenci ID ve active durumu zorunludur');
    }
    return this.studentService.toggleStudentActive(body.studentId, body.active);
  }

  @Post('reset-odemis-meblegi')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  async resetAllOdemisMeblegi() {
    return this.studentService.resetAllOdemisMeblegi();
  }

  @Get(':id/payments')
  // Ana sayfa - herkese açık
  async getStudentPayments(@Param('id') id: string) {
    const studentId = parseInt(id);
    if (isNaN(studentId)) {
      throw new Error('Geçersiz öğrenci ID');
    }
    return this.paymentService.findByStudentId(studentId);
  }
}
