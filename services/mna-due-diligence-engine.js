import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Thẩm Định Mua Bán Sáp Nhập M&A & Hiệu Ứng Cộng Hưởng (M&A Due Diligence & Synergy Engine)
 */
export class MnaDueDiligenceEngine {
  /**
   * Lập bảng checklist thẩm định M&A toàn diện và phân tích hiệu ứng cộng hưởng (Synergy)
   */
  async conductDueDiligence(targetCompanyInfo, dealType = 'Mua lại cổ phần chi phối (Majority Acquisition / 51-100%)', strategicGoal = 'Mở rộng thị phần & Tận dụng tệp khách hàng') {
    if (!targetCompanyInfo || typeof targetCompanyInfo !== 'string') {
      return { success: false, error: 'Thông tin doanh nghiệp mục tiêu không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Đầu Tư M&A & Trưởng Ban Thẩm Định Mua Bán Sáp Nhập (Head of M&A and Deal Structuring).
Hãy lập một Báo Cáo Thẩm Định Doanh Nghiệp Toàn Diện (M&A Due Diligence Checklist & Synergy Analysis) cho thương vụ sau:

THÔNG TIN DOANH NGHIỆP MỤC TIÊU (TARGET COMPANY):
"""
${targetCompanyInfo}
"""
LOẠI HÌNH GIAO DỊCH: ${dealType}
MỤC TIÊU CHIẾN LƯỢC CỦA THƯƠNG VỤ: ${strategicGoal}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🔍 CHECKLIST THẨM ĐỊNH 4 TRỤ CỘT CỐT LÕI (DUE DILIGENCE PILLARS):
   - Thẩm định Tài chính & Thuế (Chất lượng doanh thu QoE, nợ ẩn, công nợ xấu)
   - Thẩm định Pháp lý & Giấy phép (Sở hữu trí tuệ IP, tranh chấp hợp đồng, rủi ro cổ đông)
   - Thẩm định Thương mại & Thị trường (Mức độ tập trung top khách hàng, rủi ro rời bỏ)
   - Thẩm định Công nghệ & Vận hành (Nợ công nghệ Technical Debt, an ninh dữ liệu, phụ thuộc nhân sự chủ chốt)
2. ⚡ PHÂN TÍCH HIỆU ỨNG CỘNG HƯỞNG (DEAL SYNERGIES):
   - Cộng hưởng chi phí (Cost Synergies: Giảm trừ phòng ban trùng lặp, tối ưu chi phí mua hàng)
   - Cộng hưởng doanh thu (Revenue Synergies: Bán chéo Cross-sell sản phẩm vào tệp khách hàng mới)
3. 🚨 3 CỜ ĐỎ CẢNH BÁO RỦI RO CHẾT NGƯỜI (RED FLAGS / DEAL-KILLERS)
4. 🗺️ LỘ TRÌNH TÍCH HỢP HẬU SÁP NHẬP 100 NGÀY ĐẦU TIÊN (100-DAY POST-MERGER INTEGRATION - PMI)

Trình bày theo phong cách sắc bén của ngân hàng đầu tư quốc tế, bảo vệ quyền lợi tối đa cho bên mua.`;

    try {
      const { text: mnaText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        targetCompanyInfo,
        dealType,
        report: mnaText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const mnaDueDiligence = new MnaDueDiligenceEngine();
