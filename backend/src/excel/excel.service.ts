import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { StudentService } from '../student/student.service';
import { PaymentService } from '../payment/payment.service';
import { UnmatchedPaymentService } from '../unmatched-payment/unmatched-payment.service';
import { Student } from '../student/student.entity';
import { Payment } from '../payment/payment.entity';

@Injectable()
export class ExcelService {
  constructor(
    private readonly studentService: StudentService,
    @Inject(forwardRef(() => PaymentService))
    private readonly paymentService: PaymentService,
    private readonly unmatchedPaymentService: UnmatchedPaymentService,
  ) {}

  async processStudentFile(file: Express.Multer.File): Promise<{
    success: boolean;
    count: number;
    message: string;
  }> {
    try {
      // Önce eşleşmeyen kayıtları temizle
      await this.unmatchedPaymentService.clearAll();

      // Excel dosyasını oku
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // JSON'a çevir
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      if (!jsonData || jsonData.length === 0) {
        throw new Error('Excel dosyası boş veya veri bulunamadı');
      }

      console.log(`📊 Excel dosyasından ${jsonData.length} satır okundu`);
      console.log('📋 İlk satır örneği:', jsonData[0]);

      // İlk satırdan kolon isimlerini al
      const firstRow = jsonData[0] as any;
      const columnNames = Object.keys(firstRow);
      console.log('📝 Kolon isimleri:', columnNames);

      // Kolon isimlerini normalize et (büyük/küçük harf, boşluk, Türkçe karakter)
      const normalizeColumnName = (name: string): string => {
        return name
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, ' ')
          .replace(/ə/g, 'e')
          .replace(/ı/g, 'i')
          .replace(/ş/g, 's')
          .replace(/ğ/g, 'g')
          .replace(/ü/g, 'u')
          .replace(/ö/g, 'o')
          .replace(/ç/g, 'c');
      };

      // Kolon eşleştirmeleri
      const findColumn = (searchTerms: string[]): string | null => {
        for (const term of searchTerms) {
          for (const colName of columnNames) {
            const normalized = normalizeColumnName(colName);
            if (normalized.includes(term.toLowerCase())) {
              return colName;
            }
          }
        }
        return null;
      };

      const finColumn = findColumn(['fin', 'fın', 'fin kodu']);
      const adSoyadColumn = findColumn(['ad soyad', 'adsoyad', 'ad_soyad', 'ad', 'name', 'adı']);
      const kursColumn = findColumn(['kurs', 'course']);
      const qrupColumn = findColumn(['qrup', 'grup', 'group']);
      const fakulteColumn = findColumn(['fakulte', 'fakultə', 'fakultе', 'faculty']);
      const ixtisasColumn = findColumn(['ixtisas', 'ixdisas', 'specialty', 'speciality']);
      const qebulIliColumn = findColumn(['qebul ili', 'qebulili', 'qəbul ili', 'qebul_ili', 'admission year', 'qebul']);
      const odemisMeblegiColumn = findColumn(['odemis meblegi', 'odəniş məbləği', 'odemis mebleg', 'payment amount', 'mebleg', 'məbləğ']);
      const illikColumn = findColumn(['illik', 'illiy', 'annual', 'yearly']);

      console.log('🔍 Bulunan kolonlar:', {
        fin: finColumn,
        adSoyad: adSoyadColumn,
        kurs: kursColumn,
        qrup: qrupColumn,
        fakulte: fakulteColumn,
        ixtisas: ixtisasColumn,
        qebulIli: qebulIliColumn,
        odemisMeblegi: odemisMeblegiColumn,
        illik: illikColumn,
      });

      if (!finColumn) {
        throw new Error('FIN kolonu bulunamadı! Excel dosyasında FIN kolonu olmalıdır.');
      }

      // Öğrenci verilerini hazırla
      const students: Partial<Student>[] = [];

      jsonData.forEach((row: any, index: number) => {
        const fin = row[finColumn]?.toString().trim().toUpperCase();
        
        if (!fin || fin === '' || fin === 'FIN' || fin === 'FIN KODU') {
          return; // FIN yoksa atla
        }

        // Ödəniş məbləğini parse et
        let odemisMeblegi: number = 0;
        if (odemisMeblegiColumn && row[odemisMeblegiColumn]) {
          const meblegValue = row[odemisMeblegiColumn];
          if (typeof meblegValue === 'number') {
            odemisMeblegi = meblegValue;
          } else if (typeof meblegValue === 'string') {
            const cleanValue = meblegValue.toString().replace(/[^\d.,-]/g, '').replace(',', '.');
            const parsed = parseFloat(cleanValue);
            if (!isNaN(parsed)) {
              odemisMeblegi = parsed;
            }
          }
        }

        const student: Partial<Student> = {
          fin,
          adSoyad: adSoyadColumn ? (row[adSoyadColumn]?.toString().trim() || null) : null,
          kurs: kursColumn ? (row[kursColumn]?.toString().trim() || null) : null,
          qrup: qrupColumn ? (row[qrupColumn]?.toString().trim() || null) : null,
          fakulte: fakulteColumn ? (row[fakulteColumn]?.toString().trim() || null) : null,
          ixtisas: ixtisasColumn ? (row[ixtisasColumn]?.toString().trim() || null) : null,
          qebulIli: qebulIliColumn ? (row[qebulIliColumn]?.toString().trim() || null) : null,
          odemisMeblegi: odemisMeblegi || 0,
          illik: illikColumn ? (row[illikColumn]?.toString().trim() || null) : null,
        };

        students.push(student);
      });

      console.log(`✅ ${students.length} öğrenci verisi hazırlandı`);

      // Veritabanına kaydet
      const saved = await this.studentService.createMany(students);
      console.log(`✅ ${saved.length} öğrenci başarıyla kaydedildi`);

      return {
        success: true,
        count: saved.length,
        message: `${saved.length} öğrenci başarıyla yüklendi`,
      };
    } catch (error: any) {
      console.error('❌ Excel işleme hatası:', error);
      throw new Error(`Excel işleme hatası: ${error.message}`);
    }
  }

  async processPaymentFile(file: Express.Multer.File): Promise<{
    success: boolean;
    matchedCount: number;
    totalPayments: number;
    unmatchedCount: number;
    skippedCount: number;
    message: string;
  }> {
    try {
      // Eşleşmeyen kayıtları temizleme - artık tüm kayıtları saklıyoruz
      
      // Excel dosyasını oku
      const workbook = XLSX.read(file.buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // JSON'a çevir
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      if (!jsonData || jsonData.length === 0) {
        throw new Error('Excel dosyası boş veya veri bulunamadı');
      }

      console.log(`📊 Payment Excel dosyasından ${jsonData.length} satır okundu`);
      console.log('📋 İlk satır örneği:', jsonData[0]);

      // İlk satırdan kolon isimlerini al
      const firstRow = jsonData[0] as any;
      const columnNames = Object.keys(firstRow);
      console.log('📝 Kolon isimleri:', columnNames);

      // Kolon isimlerini normalize et
      const normalizeColumnName = (name: string): string => {
        return name
          .toString()
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '_')
          .replace(/[^a-z0-9_]/g, '');
      };

      // Kolon eşleştirmeleri
      const findColumn = (searchTerms: string[]): string | null => {
        for (const term of searchTerms) {
          for (const colName of columnNames) {
            const normalized = normalizeColumnName(colName);
            if (normalized === term.toLowerCase() || normalized.includes(term.toLowerCase())) {
              return colName;
            }
          }
        }
        return null;
      };

      const senderDocumentDataColumn = findColumn(['sender_document_data', 'senderdocumentdata', 'fin', 'fın']);
      const amountColumn = findColumn(['amount', 'məbləğ', 'mebləğ', 'məbləg', 'mebləg', 'mebleg', 'mebleg_azn']);
      const paymentDateColumn = findColumn(['payment_date', 'paymentdate', 'date', 'tarih', 'tarix']);
      const senderNameColumn = findColumn(['sender_name', 'sendername', 'ad', 'name']);
      const bankUniqueIdColumn = findColumn(['bank_unique_id', 'bankuniqueid', 'unique_id', 'uniqueid']);
      const paymentRefNumColumn = findColumn(['payment_ref_num', 'paymentrefnum', 'ref_num', 'refnum']);

      console.log('🔍 Bulunan payment kolonlar:', {
        senderDocumentData: senderDocumentDataColumn,
        amount: amountColumn,
        paymentDate: paymentDateColumn,
        senderName: senderNameColumn,
        bankUniqueId: bankUniqueIdColumn,
        paymentRefNum: paymentRefNumColumn,
      });

      if (!senderDocumentDataColumn) {
        throw new Error('SENDER_DOCUMENT_DATA kolonu bulunamadı!');
      }

      if (!amountColumn) {
        throw new Error('Amount kolonu bulunamadı!');
      }

      // FIN bazlı ödeme verilerini topla
      const paymentMap = new Map<string, Array<{ amount: number; paymentDate: Date; bankUniqueId: string | null; rowData: any }>>();
      const unmatchedPayments: Array<{ fin: string | null; senderName: string | null; amount: number; paymentDate: Date; paymentRefNum: string | null; rowData: any }> = [];

      jsonData.forEach((row: any) => {
        const fin = row[senderDocumentDataColumn]?.toString().trim().toUpperCase();
        
        // BankUniqueId parse et
        let bankUniqueId: string | null = null;
        if (bankUniqueIdColumn && row[bankUniqueIdColumn]) {
          bankUniqueId = row[bankUniqueIdColumn]?.toString().trim() || null;
        }
        
        // PaymentRefNum parse et
        let paymentRefNum: string | null = null;
        if (paymentRefNumColumn && row[paymentRefNumColumn]) {
          paymentRefNum = row[paymentRefNumColumn]?.toString().trim() || null;
        }
        
        // FIN yoksa veya boşsa eşleşmeyen olarak işaretle
        if (!fin || fin === '' || fin === 'SENDER_DOCUMENT_DATA' || fin === 'FIN') {
          // Amount parse et
          let amount: number = 0;
          const amountValue = row[amountColumn];
          if (typeof amountValue === 'number') {
            amount = amountValue;
          } else if (typeof amountValue === 'string') {
            const cleanValue = amountValue.replace(/[^\d.,-]/g, '').replace(',', '.');
            const parsed = parseFloat(cleanValue);
            if (!isNaN(parsed)) {
              amount = parsed;
            }
          }

          if (amount > 0) {
            // Payment date parse et
            let paymentDate: Date = new Date();
            if (paymentDateColumn && row[paymentDateColumn]) {
              const dateValue = row[paymentDateColumn];
              if (dateValue instanceof Date) {
                paymentDate = dateValue;
              } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
                const parsedDate = new Date(dateValue);
                if (!isNaN(parsedDate.getTime())) {
                  paymentDate = parsedDate;
                }
              }
            }

            // Sender name bul
            let senderName: string | null = null;
            if (senderNameColumn && row[senderNameColumn]) {
              senderName = row[senderNameColumn]?.toString().trim() || null;
            }

            unmatchedPayments.push({
              fin: null,
              senderName,
              amount,
              paymentDate,
              paymentRefNum,
              rowData: row,
            });
          }
          return;
        }

        // Amount parse et
        let amount: number = 0;
        const amountValue = row[amountColumn];
        if (typeof amountValue === 'number') {
          amount = amountValue;
        } else if (typeof amountValue === 'string') {
          const cleanValue = amountValue.replace(/[^\d.,-]/g, '').replace(',', '.');
          const parsed = parseFloat(cleanValue);
          if (!isNaN(parsed)) {
            amount = parsed;
          }
        }

        if (amount <= 0) {
          return; // Geçersiz amount atla
        }

        // Payment date parse et
        let paymentDate: Date = new Date();
        if (paymentDateColumn && row[paymentDateColumn]) {
          const dateValue = row[paymentDateColumn];
          if (dateValue instanceof Date) {
            paymentDate = dateValue;
          } else if (typeof dateValue === 'string' || typeof dateValue === 'number') {
            const parsedDate = new Date(dateValue);
            if (!isNaN(parsedDate.getTime())) {
              paymentDate = parsedDate;
            }
          }
        }

        // FIN'e göre grupla
        if (!paymentMap.has(fin)) {
          paymentMap.set(fin, []);
        }
        paymentMap.get(fin)!.push({ amount, paymentDate, bankUniqueId, rowData: row });
      });

      console.log(`✅ ${paymentMap.size} farklı FIN için ödeme bulundu, ${unmatchedPayments.length} FIN'siz kayıt bulundu`);

      // Her FIN için student bul ve payment kaydet
      let matchedCount = 0;
      let totalPayments = 0;
      let skippedCount = 0;
      const paymentsToSave: Partial<Payment>[] = [];
      const studentsToUpdate: Array<{ id: number; totalAmount: number }> = [];

      for (const [fin, payments] of paymentMap.entries()) {
        // Student bul
        const normalizedFin = fin.toUpperCase().trim();
        console.log(`🔍 FIN aranıyor: "${normalizedFin}" (orijinal: "${fin}")`);
        const student = await this.studentService.findByFin(normalizedFin);
        if (!student) {
          console.log(`⚠️ FIN bulunamadı: ${normalizedFin}`);
          // Eşleşmeyen olarak kaydet
          for (const payment of payments) {
            // Sender name bul
            let senderName: string | null = null;
            if (senderNameColumn && payment.rowData[senderNameColumn]) {
              senderName = payment.rowData[senderNameColumn]?.toString().trim() || null;
            }

            // PaymentRefNum bul
            let paymentRefNum: string | null = null;
            if (paymentRefNumColumn && payment.rowData[paymentRefNumColumn]) {
              paymentRefNum = payment.rowData[paymentRefNumColumn]?.toString().trim() || null;
            }

            unmatchedPayments.push({
              fin,
              senderName,
              amount: payment.amount,
              paymentDate: payment.paymentDate,
              paymentRefNum,
              rowData: payment.rowData,
            });
          }
          continue;
        }

        console.log(`✅ FIN bulundu: ${normalizedFin} -> Student ID: ${student.id}, Payment sayısı: ${payments.length}`);
        
        // Aynı FIN için tüm ödemeleri işle (BankUniqueId kontrolü ile)
        let totalAmount = 0;
        let skippedCountForStudent = 0;
        
        // Payment kayıtlarını ekle (BankUniqueId kontrolü ile)
        for (const payment of payments) {
          // Eğer BankUniqueId varsa, daha önce kaydedilmiş mi kontrol et
          if (payment.bankUniqueId) {
            const existingPayment = await this.paymentService.findByBankUniqueId(payment.bankUniqueId);
            if (existingPayment) {
              console.log(`⏭️ BankUniqueId zaten var, atlanıyor: ${payment.bankUniqueId} (FIN: ${normalizedFin})`);
              skippedCountForStudent++;
              skippedCount++;
              continue; // Bu ödemeyi atla
            }
          }
          
          paymentsToSave.push({
            studentId: student.id,
            amount: payment.amount,
            paymentDate: payment.paymentDate,
            bankUniqueId: payment.bankUniqueId || null,
          });
          totalAmount += payment.amount;
          totalPayments++;
        }

        console.log(`💰 FIN ${normalizedFin} için toplam məbləğ: ${totalAmount} (${skippedCountForStudent} ödeme atlandı)`);

        // Eğer ödeme eklendiyse student'i güncelle
        if (totalAmount > 0) {
          // Student'in ödəniş məbləğini güncellemek için listeye ekle
          studentsToUpdate.push({
            id: student.id,
            totalAmount,
          });
          matchedCount++;
        }
      }

      // Eski payment kayıtlarını sil ve yenilerini ekle
      for (const studentUpdate of studentsToUpdate) {
        await this.paymentService.deleteByStudentId(studentUpdate.id);
      }

      // Yeni payment kayıtlarını ekle
      if (paymentsToSave.length > 0) {
        await this.paymentService.createMany(paymentsToSave);
      }

      // Student'lerin ödəniş məbləğini güncelle (mevcut toplama ekle)
      for (const studentUpdate of studentsToUpdate) {
        // Önce mevcut ödemelerin toplamını al
        const currentTotal = await this.paymentService.getTotalAmountByStudentId(studentUpdate.id);
        // Yeni ödemeler eklendikten sonra toplamı güncelle
        await this.studentService.updateOdemisMeblegi(studentUpdate.id, currentTotal + studentUpdate.totalAmount);
      }

      // Eşleşmeyen kayıtları kaydet
      let unmatchedCount = 0;
      if (unmatchedPayments.length > 0) {
        const unmatchedToSave = unmatchedPayments.map(up => ({
          fin: up.fin,
          senderName: up.senderName,
          amount: up.amount,
          paymentDate: up.paymentDate,
          paymentRefNum: up.paymentRefNum,
          paymentData: up.rowData,
        }));
        const saved = await this.unmatchedPaymentService.createMany(unmatchedToSave);
        unmatchedCount = saved.length;
        console.log(`⚠️ ${unmatchedCount} eşleşmeyen kayıt kaydedildi (${unmatchedPayments.length - unmatchedCount} duplicate atlandı)`);
      }

      console.log(`✅ ${matchedCount} öğrenci eşleştirildi, ${totalPayments} ödeme kaydedildi, ${skippedCount} ödeme atlandı (duplicate), ${unmatchedCount} eşleşmeyen kayıt`);

      return {
        success: true,
        matchedCount,
        totalPayments,
        unmatchedCount,
        skippedCount,
        message: `${matchedCount} öğrenci eşleştirildi, ${totalPayments} ödeme kaydedildi, ${skippedCount} ödeme atlandı (duplicate), ${unmatchedCount} eşleşmeyen kayıt`,
      };
    } catch (error: any) {
      console.error('❌ Payment Excel işleme hatası:', error);
      throw new Error(`Payment Excel işleme hatası: ${error.message}`);
    }
  }

  async processPaymentJsonFile(file: Express.Multer.File): Promise<{
    success: boolean;
    matchedCount: number;
    totalPayments: number;
    unmatchedCount: number;
    skippedCount: number;
    message: string;
  }> {
    try {
      // Eşleşmeyen kayıtları temizleme - artık tüm kayıtları saklıyoruz
      
      // JSON dosyasını parse et
      const jsonString = file.buffer.toString('utf-8');
      const jsonData: any[] = JSON.parse(jsonString);

      if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
        throw new Error('JSON dosyası boş veya geçersiz format');
      }

      console.log(`📊 Payment JSON dosyasından ${jsonData.length} kayıt okundu`);

      // FIN bazlı ödeme verilerini topla
      const paymentMap = new Map<string, Array<{ 
        amount: number; 
        paymentDate: Date; 
        bankUniqueId: string | null;
        senderName: string | null;
        rowData: any;
      }>>();
      const unmatchedPayments: Array<{ fin: string | null; senderName: string | null; amount: number; paymentDate: Date; paymentRefNum: string | null; rowData: any }> = [];

      jsonData.forEach((row: any) => {
        // JSON formatında: SenderDocData -> FIN
        const fin = row.SenderDocData?.toString().trim().toUpperCase();
        const bankUniqueId = row.BankUniqueId?.toString().trim() || null;
        const paymentRefNum = row.PaymentRefNum?.toString().trim() || null;
        const amount = typeof row.Amount === 'number' ? row.Amount : parseFloat(row.Amount || '0');
        const senderName = row.SenderName?.toString().trim() || null;
        
        // Payment date parse et
        let paymentDate: Date = new Date();
        if (row.PaymentDate) {
          const parsedDate = new Date(row.PaymentDate);
          if (!isNaN(parsedDate.getTime())) {
            paymentDate = parsedDate;
          }
        }

        // FIN yoksa veya boşsa eşleşmeyen olarak işaretle
        if (!fin || fin === '' || fin === 'SENDER_DOCUMENT_DATA' || fin === 'FIN') {
          if (amount > 0) {
            unmatchedPayments.push({
              fin: null,
              senderName,
              amount,
              paymentDate,
              paymentRefNum,
              rowData: row,
            });
          }
          return;
        }

        if (amount <= 0) {
          return; // Geçersiz amount atla
        }

        // FIN'e göre grupla
        if (!paymentMap.has(fin)) {
          paymentMap.set(fin, []);
        }
        paymentMap.get(fin)!.push({ amount, paymentDate, bankUniqueId, senderName, rowData: row });
      });

      console.log(`✅ ${paymentMap.size} farklı FIN için ödeme bulundu, ${unmatchedPayments.length} FIN'siz kayıt bulundu`);

      // Her FIN için student bul ve payment kaydet
      let matchedCount = 0;
      let totalPayments = 0;
      let skippedCount = 0;
      const paymentsToSave: Partial<Payment>[] = [];
      const studentsToUpdate: Array<{ id: number; totalAmount: number }> = [];

      for (const [fin, payments] of paymentMap.entries()) {
        // Student bul
        const normalizedFin = fin.toUpperCase().trim();
        console.log(`🔍 FIN aranıyor: "${normalizedFin}" (orijinal: "${fin}")`);
        const student = await this.studentService.findByFin(normalizedFin);
        if (!student) {
          console.log(`⚠️ FIN bulunamadı: ${normalizedFin}`);
          // Eşleşmeyen olarak kaydet
          for (const payment of payments) {
            // PaymentRefNum bul
            const paymentRefNum = payment.rowData.PaymentRefNum?.toString().trim() || null;
            
            unmatchedPayments.push({
              fin,
              senderName: payment.senderName,
              amount: payment.amount,
              paymentDate: payment.paymentDate,
              paymentRefNum,
              rowData: payment.rowData,
            });
          }
          continue;
        }

        console.log(`✅ FIN bulundu: ${normalizedFin} -> Student ID: ${student.id}, Payment sayısı: ${payments.length}`);
        
        // Aynı FIN için tüm ödemeleri topla (BankUniqueId kontrolünden sonra)
        let totalAmount = 0;
        
        // Payment kayıtlarını ekle (BankUniqueId kontrolü ile)
        for (const payment of payments) {
          // Eğer BankUniqueId varsa, daha önce kaydedilmiş mi kontrol et
          if (payment.bankUniqueId) {
            const existingPayment = await this.paymentService.findByBankUniqueId(payment.bankUniqueId);
            if (existingPayment) {
              console.log(`⏭️ BankUniqueId zaten var, atlanıyor: ${payment.bankUniqueId} (FIN: ${normalizedFin})`);
              skippedCount++;
              continue; // Bu ödemeyi atla
            }
          }
          
          paymentsToSave.push({
            studentId: student.id,
            amount: payment.amount,
            paymentDate: payment.paymentDate,
            bankUniqueId: payment.bankUniqueId || null,
          });
          totalAmount += payment.amount;
          totalPayments++;
        }

        // Eğer ödeme eklendiyse student'i güncelle
        if (totalAmount > 0) {
          // Student'in ödəniş məbləğini güncellemek için listeye ekle
          studentsToUpdate.push({
            id: student.id,
            totalAmount,
          });
          matchedCount++;
        }
      }

      // Eski payment kayıtlarını sil ve yenilerini ekle
      for (const studentUpdate of studentsToUpdate) {
        // Önce mevcut ödemelerin toplamını al
        const currentTotal = await this.paymentService.getTotalAmountByStudentId(studentUpdate.id);
        // Yeni ödemeler eklendikten sonra toplamı güncelle
        await this.studentService.updateOdemisMeblegi(studentUpdate.id, currentTotal + studentUpdate.totalAmount);
      }

      // Yeni payment kayıtlarını ekle
      if (paymentsToSave.length > 0) {
        await this.paymentService.createMany(paymentsToSave);
      }

      // Eşleşmeyen kayıtları kaydet
      let unmatchedCount = 0;
      if (unmatchedPayments.length > 0) {
        const unmatchedToSave = unmatchedPayments.map(up => ({
          fin: up.fin,
          senderName: up.senderName,
          amount: up.amount,
          paymentDate: up.paymentDate,
          paymentRefNum: up.paymentRefNum,
          paymentData: up.rowData,
        }));
        const saved = await this.unmatchedPaymentService.createMany(unmatchedToSave);
        unmatchedCount = saved.length;
        console.log(`⚠️ ${unmatchedCount} eşleşmeyen kayıt kaydedildi (${unmatchedPayments.length - unmatchedCount} duplicate atlandı)`);
      }

      console.log(`✅ ${matchedCount} öğrenci eşleştirildi, ${totalPayments} ödeme kaydedildi, ${skippedCount} ödeme atlandı (duplicate), ${unmatchedCount} eşleşmeyen kayıt`);

      return {
        success: true,
        matchedCount,
        totalPayments,
        unmatchedCount,
        skippedCount,
        message: `${matchedCount} öğrenci eşleştirildi, ${totalPayments} ödeme kaydedildi, ${skippedCount} ödeme atlandı (duplicate), ${unmatchedCount} eşleşmeyen kayıt`,
      };
    } catch (error: any) {
      console.error('❌ Payment JSON işleme hatası:', error);
      throw new Error(`Payment JSON işleme hatası: ${error.message}`);
    }
  }
}
