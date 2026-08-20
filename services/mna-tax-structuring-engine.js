import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Thẩm Định Rủi Ro Pháp Lý & Tối Ưu Hóa Thuế Thương Vụ M&A (M&A Tax Structuring & Legal Due Diligence Engine)
 */
export class MnaTaxStructuringEngine {
  /**
   * Thiết lập cấu trúc giao dịch M&A tối ưu thuế (Asset Deal vs Stock Deal), điều khoản bảo vệ Indemnity/Escrow và thẩm định thuế
   */
  async structureMnaTaxDeal(dealContext, dealType = 'Mua bán cổ phần (Stock Deal) vs Chuyển nhượng tài sản (Asset Deal)', transactionSize = 'Doanh nghiệp SME / Doanh nghiệp tầm trung Middle-Market') {
    if (!dealContext || typeof dealContext !== 'string') {
      return { success: false, error: 'Thông tin thương vụ M&A không hợp lệ.' };
    }

    const prompt = `Bạn là Trưởng Ban Tư Vấn Cấu Trúc Giao Dịch M&A & Thuế Quốc Tế (M&A Tax Partner & Deal Structuring Lead).
Hãy lập một Bản Đề Án Cấu Trúc Thương Vụ M&A Tối Ưu Thuế & Quản Trị Rủi Ro Pháp Lý (M&A Tax Structuring & Risk Mitigation Framework) cho thương vụ sau:

BỐI CẢNH THƯƠNG VỤ M&A:
"""
${dealContext}
"""
LOẠI HÌNH GIAO DỊCH: ${dealType}
QUY MÔ GIAO DỊCH DỰ KIẾN: ${transactionSize}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. ⚖️ SO SÁNH CẤU TRÚC MUA CỔ PHẦN VS MUA TÀI SẢN (STOCK PURCHASE VS ASSET ACQUISITION):
   - Phân tích nghĩa vụ thuế Thu nhập doanh nghiệp (CIT), thuế GTGT (VAT) và Thuế chuyển nhượng vốn
   - Đánh giá khả năng chuyển lỗ tính thuế (Tax Loss Carryforward) và khấu hao lũy kế tài sản (Step-up in Basis)
2. 🛡️ ĐIỀU KHOẢN BẢO VỆ PHÁP LÝ & KÝ QUỸ TÀI TRỢ RỦI RO (INDEMNITY & ESCROW RETENTION):
   - Thiết lập tỷ lệ ký quỹ tài khoản phong tỏa (Escrow Account: 10% - 20% giá trị thương vụ giữ lại trong 12-24 tháng)
   - Giới hạn trách nhiệm bồi thường (Indemnity Cap) và ngưỡng kích hoạt bồi thường (Basket/Deductible)
3. 📜 ĐIỀU KHOẢN RÀNG BUỘC THANH TOÁN THEO KẾT QUẢ KINH DOANH (EARN-OUT STRUCTURE):
   - Công thức thanh toán trả chậm gắn liền với EBITDA / Doanh thu đạt được sau sáp nhập
   - Cơ chế bảo vệ ban điều hành sáng lập ở lại cống hiến
4. 🚦 MA TRẬN RỦI RO THUẾ TIỀM ẨN & KẾ HOẠCH BỌC LÓT HẬU M&A (POST-CLOSING TAX INTEGRATION)

Trình bày theo phong cách chuyên gia Big 4 M&A Tax / Magic Circle Law Firm, sắc bén, chuẩn mực pháp lý và tối ưu hóa tối đa giá trị sau thuế cho doanh nghiệp.`;

    try {
      const { text: mnaTaxText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        dealContext,
        dealType,
        report: mnaTaxText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const mnaTaxStructuring = new MnaTaxStructuringEngine();
