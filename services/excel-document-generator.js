import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

const MEDIA_DIR = path.resolve('generated_media');
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

export class ExcelDocumentGenerator {
  /**
   * Tạo tệp Excel .xlsx thực tế từ mảng dữ liệu JSON
   */
  generateExcelFile(fileName, sheetName = 'Sheet1', dataRows = []) {
    try {
      const cleanFileName = (fileName || `Bang_Du_Lieu_${Date.now()}`).replace(/[^a-zA-Z0-9_\-]/g, '_') + '.xlsx';
      const filePath = path.join(MEDIA_DIR, cleanFileName);

      const worksheet = XLSX.utils.json_to_sheet(dataRows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

      XLSX.writeFile(workbook, filePath);

      return {
        success: true,
        filePath,
        fileName: cleanFileName,
        rowsCount: dataRows.length,
        message: `📊 Đã tạo file Excel thành công: ${cleanFileName} (${dataRows.length} dòng dữ liệu).`
      };
    } catch (err) {
      return {
        success: false,
        error: err.message,
        message: `❌ Lỗi tạo file Excel: ${err.message}`
      };
    }
  }
}

export const excelGenerator = new ExcelDocumentGenerator();
