import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Mô Phỏng Cap Table & Thỏa Thuận Cổ Đông SHA (Cap Table & Shareholders Agreement Engine)
 */
export class CapTableEngine {
  /**
   * Mô phỏng bảng cơ cấu sở hữu cổ phần Cap Table và điều khoản thỏa thuận cổ đông
   */
  async simulateCapTable(equityContext, fundingRound = 'Vòng Hạt Giống / Series A', investmentAmount = '500,000 USD', preMoneyValuation = '2,500,000 USD') {
    if (!equityContext || typeof equityContext !== 'string') {
      return { success: false, error: 'Dữ liệu cổ phần không hợp lệ.' };
    }

    const prompt = `Bạn là Luật Sư Cố Vấn Đầu Tư Mạo Hiểm & Chuyên Gia Cấu Trúc Vốn Doanh Nghiệp (Venture Capital Legal Counsel & Equity Strategist).
Hãy lập một Báo Cáo Mô Phỏng Cơ Cấu Cổ Phần (Cap Table Dilution Simulation) & Các Điều Khoản Thỏa Thuận Cổ Đông (Shareholders Agreement - SHA) cho thương vụ sau:

CƠ CẤU CỔ ĐÔNG HIỆN TẠI:
"""
${equityContext}
"""
VÒNG GỌI VỐN: ${fundingRound}
SỐ TIỀN ĐẦU TƯ: ${investmentAmount}
ĐỊNH GIÁ TRƯỚC RÓT VỐN (PRE-MONEY): ${preMoneyValuation}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 📊 BẢNG CAP TABLE TRƯỚC VÀ SAU GỌI VỐN (PRE VS POST-ROUND EQUITY DILUTION):
   - Tỷ lệ sở hữu của Sáng lập viên (Founders)
   - Quỹ cổ phần thưởng nhân viên (ESOP Pool tạo mới 10-15%)
   - Tỷ lệ sở hữu của Nhà đầu tư mới (New Investors)
   - Định giá sau rót vốn (Post-Money Valuation) & Giá trên mỗi cổ phần (Price per Share)
2. ⚖️ 4 ĐIỀU KHOẢN CỐT TỬ TRONG THỎA THUẬN CỔ ĐÔNG (SHA CLAUSES):
   - Quyền ưu tiên thanh lý tài sản (Liquidation Preference 1x Non-Participating)
   - Quyền kéo theo & Đi theo (Drag-Along & Tag-Along Rights)
   - Quyền ưu tiên mua trước (Right of First Refusal - ROFR) & Chống pha loãng (Anti-Dilution Weighted Average)
   - Lộ trình trao quyền sở hữu cổ phần theo thời gian (Founder Vesting 4 năm + 1 năm Cliff)
3. 🚨 3 BẪY MẤT QUYỀN KIỂM SOÁT DOANH NGHIỆP CẦN TRÁNH CHO NHÀ SÁNG LẬP

Trình bày theo phong cách chuyên gia pháp lý và tài chính đầu tư mạo hiểm sắc sảo, bảo vệ tối đa quyền biểu quyết và quyền lợi kinh tế của ban sáng lập.`;

    try {
      const { text: capText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        equityContext,
        fundingRound,
        report: capText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const capTableEngine = new CapTableEngine();
