import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Phân Bổ Vốn Đầu Tư & Đánh Giá Dự Án CAPEX vs OPEX (Capital Allocation & CAPEX Optimization Engine)
 */
export class CapitalAllocationEngine {
  /**
   * Đánh giá hiệu quả kinh tế dự án đầu tư CAPEX, tính toán NPV/IRR/Payback và so sánh mô hình Thuê vs Mua
   */
  async optimizeCapitalAllocation(investmentContext, discountRate = '10% (Chi phí sử dụng vốn WACC)', initialCapex = 'Tổng vốn đầu tư ban đầu', expectedCashFlows = 'Dòng tiền thuần dự kiến 3-5 năm') {
    if (!investmentContext || typeof investmentContext !== 'string') {
      return { success: false, error: 'Thông tin dự án đầu tư không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Đầu Tư Cấp Cao & Chuyên Gia Thẩm Định Dự Án Tài Chính (Chief Investment Officer - CIO & Capital Allocation Lead).
Hãy lập một Báo Cáo Thẩm Định Hiệu Quả Vốn Đầu Tư (Capital Budgeting & CAPEX Feasibility Report) cho dự án sau:

THÔNG TIN DỰ ÁN ĐẦU TƯ / MUA SẮM TÀI SẢN:
"""
${investmentContext}
"""
TỔNG VỐN ĐẦU TƯ BAN ĐẦU (CAPEX): ${initialCapex}
DÒNG TIỀN DỰ KIẾN: ${expectedCashFlows}
SUẤT CHIẾT KHẤU / WACC: ${discountRate}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 📊 BẢNG CHỈ SỐ TÀI CHÍNH DỰ ÁN (FINANCIAL INVESTMENT METRICS):
   - Giá trị hiện tại thuần (Net Present Value - NPV)
   - Tỷ suất hoàn vốn nội bộ (Internal Rate of Return - IRR vs Hurdle Rate)
   - Thời gian hoàn vốn có chiết khấu (Discounted Payback Period)
   - Chỉ số sinh lời (Profitability Index - PI)
2. 🔄 SO SÁNH PHƯƠNG ÁN MUA TÀI SẢN (CAPEX) VS THUÊ VẬN HÀNH (OPEX / LEASE VS BUY):
   - Tác động lên dòng tiền lưu động, khấu hao tài sản và thuế TNDN
3. 📉 THỬ TẢI NHẠY CẢM DÒNG TIỀN (SENSITIVITY STRESS TEST):
   - Kịch bản doanh thu giảm 10-20% hoặc chi phí vận hành tăng 15%
4. 🏆 KHUYẾN NGHỊ PHÂN BỔ NGUỒN VỐN DỨT KHOÁT DÀNH CHO HỘI ĐỒNG ĐẦU TƯ (INVESTMENT VERDICT)

Trình bày theo phong cách chuyên gia thẩm định tài chính đầu tư mạo hiểm và ngân hàng đầu tư phố Wall, chặt chẽ, khách quan và chuẩn xác.`;

    try {
      const { text: caText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        investmentContext,
        initialCapex,
        report: caText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const capitalAllocation = new CapitalAllocationEngine();
