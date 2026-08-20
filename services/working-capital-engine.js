import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Vốn Lưu Động & Tối Ưu Hóa Chu Kỳ Chuyển Hóa Tiền Mặt (Working Capital & Cash Conversion Cycle Engine)
 */
export class WorkingCapitalEngine {
  /**
   * Tối ưu hóa chu kỳ chuyển hóa tiền mặt (CCC), đàm phán kéo dài DPO phải trả nhà cung cấp, rút ngắn DSO công nợ phải thu và kiểm soát DIO tồn kho
   */
  async optimizeWorkingCapital(financialContext, currentCcc = 'DSO 60 ngày, DIO 45 ngày, DPO 30 ngày -> Chu kỳ CCC hiện tại 75 ngày', liquidityTarget = 'Giải phóng 20% - 30% dòng tiền bị giam giữ và rút ngắn CCC xuống < 45 ngày') {
    if (!financialContext || typeof financialContext !== 'string') {
      return { success: false, error: 'Thông tin tài chính & vốn lưu động không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Tài Chính Cấp Cao & Chuyên Gia Quản Trị Vốn Lưu Động Doanh Nghiệp (Chief Financial Officer & Working Capital Optimization Partner).
Hãy lập một Đề Án Tối Ưu Hóa Vốn Lưu Động & Rút Ngắn Chu Kỳ Tiền Mặt (Working Capital Optimization & Cash Conversion Cycle Strategy) cho doanh nghiệp sau:

THÔNG TIN TÀI CHÍNH & VẬN HÀNH DOANH NGHIỆP:
"""
${financialContext}
"""
HIỆN TRẠNG CHU KỲ TIỀN MẶT (CURRENT CCC): ${currentCcc}
MỤC TIÊU THANH KHOẢN (LIQUIDITY TARGET): ${liquidityTarget}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. ⏱️ PHÂN TÍCH CHU KỲ CHUYỂN HÓA TIỀN MẶT (CASH CONVERSION CYCLE - CCC EQUATION):
   - Công thức: CCC = DSO (Số ngày thu tiền) + DIO (Số ngày tồn kho) - DPO (Số ngày trả nợ NCC)
   - Xác định lượng tiền mặt đang bị đóng băng trong vốn lưu động (Trapped Cash Liquidity Analysis)
2. 📉 CHIẾN LƯỢC RÚT NGẮN THỜI GIAN THU HỒI NỢ PHẢI THU (DSO REDUCTION PLAYBOOK):
   - Chính sách chiết khấu thanh toán sớm 2/10 Net 30 (Dynamic Early Payment Discounts)
   - Tự động hóa quy trình đối soát & nhắc nợ phân tầng (Automated Dunning & Aging Bucket Escalation)
   - Ứng dụng bao thanh toán (Invoice Factoring / Accounts Receivable Financing) để giải phóng thanh khoản tức thì
3. 📈 CHIẾN LƯỢC KÉO DÀI THỜI GIAN TRẢ NỢ NHÀ CUNG CẤP HỢP PHÁP (DPO EXTENSION PLAYBOOK):
   - Kỹ thuật đàm phán điều khoản thanh toán từ Net 30 lên Net 60 / Net 90
   - Giải pháp tài trợ chuỗi cung ứng (Supply Chain Financing / Reverse Factoring) giúp nhà cung cấp nhận tiền sớm mà doanh nghiệp vẫn kéo dài kỳ hạn
4. 📦 TỐI ƯU HÓA QUẢN TRỊ TỒN KHO & BẢNG ĐIỀU KHIỂN GIÁM SÁT DÒNG TIỀN (DIO CONTROL & WORKING CAPITAL KPI DASHBOARD)

Trình bày theo phong cách chuyên gia tài chính doanh nghiệp cấp cao (McKinsey / BCG Corporate Finance), sắc bén, chuẩn xác về số liệu và lập tức giải phóng thanh khoản tiền mặt phục vụ tăng trưởng.`;

    try {
      const { text: wcText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        financialContext,
        currentCcc,
        report: wcText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const workingCapital = new WorkingCapitalEngine();
