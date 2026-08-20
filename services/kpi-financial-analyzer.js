import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Phân Tích Báo Cáo Tài Chính, Chỉ Số KPI & Sức Khỏe Doanh Nghiệp (Financial Statement & KPI Analyzer)
 */
export class KpiFinancialAnalyzerEngine {
  /**
   * Phân tích báo cáo tài chính, chỉ số KPI và đưa ra nhận định điều hành
   */
  async analyzeFinancialData(financialDataText, companyType = 'Doanh nghiệp thương mại / Công nghệ') {
    if (!financialDataText || typeof financialDataText !== 'string') {
      return { success: false, error: 'Dữ liệu tài chính không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Tài Chính (CFO) & Chuyên Gia Phân Tích Dữ Liệu Doanh Nghiệp Cấp Cao.
Hãy phân tích các số liệu tài chính / KPI sau đây và lập một Báo Cáo Chẩn Đoán Tài Chính & Chiến Lược Điều Hành sắc bén nhất.

MÔ HÌNH DOANH NGHIỆP: ${companyType}
DỮ LIỆU TÀI CHÍNH / SỐ LIỆU ĐẦU VÀO:
"""
${financialDataText}
"""

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 📊 BẢNG TỔNG HỢP CÁC CHỈ SỐ CỐT LÕI (Doanh thu, Biên lợi nhuận gộp/ròng, Chi phí OPEX, Tốc độ tăng trưởng)
2. 🔍 ĐÁNH GIÁ SỨC KHỎE TÀI CHÍNH & HIỆU SUẤT (Điểm mạnh, Dấu hiệu cảnh báo lãng phí/dòng tiền, Tỷ lệ đốt tiền/Burn rate nếu có)
3. 💡 CHIẾN LƯỢC TỐI ƯU HÓA CHI PHÍ & TĂNG TRƯỞNG (Khuyến nghị 3-4 giải pháp cụ thể giúp ban lãnh đạo ra quyết định)
4. 📈 DỰ BÁO XU HƯỚNG & KỊCH BẢN KINH DOANH

Trình bày theo phong cách sắc bén, tập trung vào con số, trực diện và có tính ứng dụng điều hành cao.`;

    try {
      const { text: analysisReport } = await generateContentWithFailover(prompt);
      return {
        success: true,
        companyType,
        report: analysisReport.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const kpiFinancialAnalyzer = new KpiFinancialAnalyzerEngine();
