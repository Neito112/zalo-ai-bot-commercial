import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Thẩm Định Chỉ Số Kinh Tế Đơn Vị SaaS & Tăng Trưởng Doanh Thu (SaaS Metrics & Unit Economics Engine)
 */
export class SaasMetricsEngine {
  /**
   * Đánh giá toàn diện chỉ số kinh tế đơn vị SaaS, Quy tắc 40 (Rule of 40), Magic Number và phân tích Cohort
   */
  async auditSaasMetrics(saasFinancialData, targetStage = 'Series A / Series B / Chuẩn bị IPO', benchmarkComparison = 'So sánh chuẩn mực B2B SaaS quốc tế P75') {
    if (!saasFinancialData || typeof saasFinancialData !== 'string') {
      return { success: false, error: 'Dữ liệu chỉ số SaaS không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Tài Chính Công Nghệ SaaS & Chuyên Gia Thẩm Định Quỹ Đầu Tư Mạo Hiểm (SaaS CFO & Growth Equity Partner).
Hãy lập một Báo Cáo Thẩm Định Sức Khỏe Kinh Tế Đơn Vị & Đòn Bẩy Tăng Trưởng SaaS (SaaS Unit Economics & Cohort Retention Audit) cho doanh nghiệp sau:

DỮ LIỆU TÀI CHÍNH & VẬN HÀNH SAAS:
"""
${saasFinancialData}
"""
GIAI ĐOẠN PHÁT TRIỂN: ${targetStage}
CHUẨN SO SÁNH: ${benchmarkComparison}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 📊 BẢNG 6 CHỈ SỐ KINH TẾ ĐƠN VỊ CỐT LÕI (SAAS UNIT ECONOMICS SCORECARD):
   - Doanh thu định kỳ hàng năm / tháng (ARR / MRR & Net New ARR Breakdown)
   - Tỷ lệ LTV / CAC (Customer Lifetime Value / CAC Target > 3.0x)
   - Thời gian thu hồi chi phí bán hàng CAC Payback Period (Target < 12 tháng)
   - Quy tắc 40 (Rule of 40: Tốc độ tăng trưởng % + Biên dòng tiền tự do FCF %)
   - Chỉ số hiệu quả bán hàng SaaS Magic Number (Net New ARR / S&M Spend)
   - Tỷ lệ duy trì doanh thu thuần (Net Revenue Retention - NRR Target > 115%)
2. 👥 MA TRẬN DUY TRÌ THEO NHÓM KHÁCH HÀNG (COHORT RETENTION & CHURN ANALYSIS):
   - Phân tích độ dốc suy giảm người dùng (Logo Churn) và doanh thu ròng (Gross vs Net Churn)
3. 🚀 3 ĐÒN BẨY TỐI ƯU HÓA HIỆU QUẢ VỐN ĐỂ GỌI VỐN ĐỊNH GIÁ CAO (CAPITAL EFFICIENCY LEVERS):
   - Tối ưu hóa phễu chuyển đổi Product-Led Growth (PLG) và bán hàng doanh nghiệp Enterprise
4. 🏆 BẢN ĐÁNH GIÁ SẴN SÀNG HUY ĐỘNG VỐN QUỸ ĐẦU TƯ (VENTURE CAPITAL READINESS VERDICT)

Trình bày theo phong cách chuyên gia tài chính tăng trưởng Thung lũng Silicon (Bessemer Cloud Index / OpenView), sắc bén, chuẩn mực và định hướng hành động dứt khoát.`;

    try {
      const { text: saasText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        saasFinancialData,
        targetStage,
        report: saasText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const saasMetrics = new SaasMetricsEngine();
