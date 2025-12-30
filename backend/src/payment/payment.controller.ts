import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ExcelService } from '../excel/excel.service';

@Controller('api/payments')
export class PaymentController {
  constructor(private readonly excelService: ExcelService) {}

  @Post('upload')
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
}
