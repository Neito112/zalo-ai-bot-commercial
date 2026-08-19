import fs from 'fs';
import path from 'path';

/**
 * Động cơ Xử Lý & Đọc Văn Bản Thông Minh Đa Định Dạng (PDF, DOCX, TXT, CSV, JSON, MD)
 */
export class DocumentIntelligenceEngine {
  /**
   * Đọc và trích xuất nội dung văn bản từ tệp tin
   */
  async extractTextFromFile(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return { success: false, error: 'Tệp không tồn tại trên hệ thống.' };
      }

      const ext = path.extname(filePath).toLowerCase();
      const stats = fs.statSync(filePath);

      // 1. Tệp văn bản thô: TXT, CSV, JSON, MD, LOG, JS, PY, HTML, CSS
      if (['.txt', '.csv', '.json', '.md', '.log', '.js', '.py', '.html', '.css', '.xml', '.yaml', '.yml'].includes(ext)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        return {
          success: true,
          fileName: path.basename(filePath),
          ext,
          sizeKb: Math.round(stats.size / 1024),
          text: content.slice(0, 15000), // Giới hạn 15k ký tự đầu
          truncated: content.length > 15000
        };
      }

      // 2. Tệp PDF (Trích xuất chuỗi văn bản thô)
      if (ext === '.pdf') {
        const buffer = fs.readFileSync(filePath);
        const rawStr = buffer.toString('latin1');
        // Trích xuất các luồng text trong PDF
        const textMatches = rawStr.match(/\((.*?)\)\s*Tj/g) || rawStr.match(/\[(.*?)\]\s*TJ/g);
        let extracted = '';
        if (textMatches) {
          extracted = textMatches.map(m => m.replace(/[\(\)\[\]]|Tj|TJ/g, '').trim()).join(' ');
        } else {
          extracted = rawStr.replace(/[^\x20-\x7E\n\r]/g, ' ').replace(/\s+/g, ' ').slice(0, 8000);
        }

        return {
          success: true,
          fileName: path.basename(filePath),
          ext: '.pdf',
          sizeKb: Math.round(stats.size / 1024),
          text: extracted.trim().slice(0, 15000),
          note: 'Trích xuất văn bản từ tệp PDF'
        };
      }

      return {
        success: false,
        error: `Định dạng tệp ${ext} chưa được hỗ trợ trích xuất tự động.`
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}

export const documentIntelligence = new DocumentIntelligenceEngine();
