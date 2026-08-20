import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Ngân Khí Doanh Nghiệp & Tối Ưu Thanh Khoản Nhàn Rỗi (Enterprise Treasury Management & Corporate Liquidity Engine)
 */
export class TreasuryLiquidityEngine {
  /**
   * Tối ưu hóa quản trị ngân quỹ, tập trung tiền mặt đa thực thể (Cash Sweeping), phân tầng thanh khoản 3 lớp và tối đa hóa lợi suất tiền nhàn rỗi
   */
  async optimizeTreasuryLiquidity(treasuryContext, currentIdleCash = '10 - 100 Tỷ VNĐ', targetYieldStrategy = 'Bảo toàn vốn gốc 100% + Lợi suất thực dương vượt lạm phát') {
    if (!treasuryContext || typeof treasuryContext !== 'string') {
      return { success: false, error: 'Thông tin quản trị ngân quỹ không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Quản Trị Ngân Khí Toàn Cầu & Chuyên Gia Tài Chính Doanh Nghiệp Cấp Cao (Certified Treasury Professional - CTP & Corporate Treasurer).
Hãy lập một Đề Án Quản Trị Ngân Khí & Phân Bổ Tiền Mặt Nhàn Rỗi (Enterprise Treasury & Corporate Liquidity Strategy) cho doanh nghiệp sau:

THÔNG TIN DÒNG TIỀN & HIỆN TRẠNG NGÂN KHÍ:
"""
${treasuryContext}
"""
QUY MÔ TIỀN MẶT NHÀN RỖI (IDLE CASH): ${currentIdleCash}
MỤC TIÊU LỢI SUẤT & AN TOÀN VỐN: ${targetYieldStrategy}

CẤU TRÚC ĐỀ ÁN YÊU CẦU:
1. 🏦 TẬP TRUNG TIỀN MẶT ĐA THỰC THỂ & TỰ ĐỘNG QUÉT DÒNG TIỀN (CASH SWEEPING & ZERO BALANCE ACCOUNTS - ZBA):
   - Cấu trúc tài khoản tập trung (Cash Concentration Structure) kết nối công ty mẹ và các chi nhánh/công ty con
   - Quy trình quét tự động cuối ngày (End-of-day Sweep) về tài khoản mẹ để tối ưu hạn mức tín dụng và giảm lãi vay thấu chi
2. 💎 CHIẾN LƯỢC PHÂN BỔ 3 TẦNG THANH KHOẢN (3-TIER LIQUIDITY FRAMEWORK):
   - Tầng 1 (Operational Cash - 0 đến 30 ngày): Chi trả lương, thuế, OPEX bằng tài khoản thanh toán lãi suất thả nổi hoặc Sweep qua đêm
   - Tầng 2 (Reserve Buffer - 30 đến 90 ngày): Tiền gửi có kỳ hạn ngắn linh hoạt rút gốc, Chứng chỉ tiền gửi (CDs) ngân hàng Big 4
   - Tầng 3 (Strategic Yield - 90 đến 360 ngày): Trái phiếu chính phủ, T-bills, Quỹ thị trường tiền tệ (MMFs) lãi suất cố định
3. ⚖️ QUẢN TRỊ RỦI RO ĐỐI TÁC NGÂN HÀNG & HẠN MỨC TIỀN GỬI (COUNTERPARTY RISK & BANK LIMITS):
   - Phân bổ rủi ro không tập trung quá 30-40% tiền mặt tại một định chế tài chính
   - Thiết lập hạn mức tín nhiệm dựa trên hệ số an toàn vốn CAR và xếp hạng tín nhiệm quốc tế (Moody's/S&P/Fitch)
4. 📈 BẢNG TÍNH LỢI NHUẬN DỰ KIẾN TỪ TIỀN NHÀN RỖI & LỊCH TRÌNH DÒNG TIỀN ĐIỀU HÀNH 12 THÁNG

Trình bày theo phong cách chuyên gia tài chính cấp cao, phân tích số liệu tách bạch, rõ ràng, tính thực chiến cao và mang lại lợi nhuận tài chính an toàn tuyệt đối cho doanh nghiệp.`;

    try {
      const { text: treasuryText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        treasuryContext,
        currentIdleCash,
        report: treasuryText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const treasuryLiquidity = new TreasuryLiquidityEngine();
