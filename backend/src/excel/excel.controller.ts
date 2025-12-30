import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from './excel.service';

@Controller('api')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('upload-students')
  @UseInterceptors(FileInterceptor('file'))
  async uploadStudents(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('Dosya bulunamadı', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.excelService.processStudentFile(file);
      return result;
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Dosya işlenirken hata oluştu',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
