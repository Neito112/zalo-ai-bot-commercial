import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Thương Mại Hóa & Khai Thác Danh Mục Bằng Sáng Chế / Sở Hữu Trí Tuệ (Enterprise Patent Portfolio & IP Monetization Engine)
 */
export class PatentMonetizationEngine {
  /**
   * Thẩm định giá trị tài sản trí tuệ, phân tích Freedom-to-Operate (FTO), thiết lập mô hình cấp phép bản quyền (Licensing) và thu phí Royalty
   */
  async monetizePatentPortfolio(ipContext, monetizationGoal = 'Cấp phép bản quyền (IP Licensing) & Thu phí Royalty hàng năm', industrySector = 'Công nghệ cao, Phần mềm / AI, Thiết bị điện tử hoặc Bán lẻ') {
    if (!ipContext || typeof ipContext !== 'string') {
      return { success: false, error: 'Thông tin tài sản sở hữu trí tuệ không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Khai Thác Sở Hữu Trí Tuệ & Luật Sư Sáng Chế Quốc Tế (Chief Intellectual Property Officer - CIPO & Registered Patent Attorney).
Hãy lập một Đề Án Thương Mại Hóa & Khai Thác Bằng Sáng Chế / Tài Sản Trí Tuệ (Enterprise IP & Patent Monetization Playbook) cho danh mục sau:

THÔNG TIN DANH MỤC SÁNG CHẾ / CÔNG NGHỆ ĐỘC QUYỀN (IP ASSETS):
"""
${ipContext}
"""
MỤC TIÊU THƯƠNG MẠI HÓA: ${monetizationGoal}
LĨNH VỰC NGÀNH NGHỀ: ${industrySector}

CẤU TRÚC ĐỀ ÁN YÊU CẦU:
1. 💡 ĐỊNH GIÁ TÀI SẢN TRÍ TUỆ & PHÂN TÍCH TỰ DO THƯƠNG MẠI HÓA (IP VALUATION & FREEDOM-TO-OPERATE - FTO):
   - Đánh giá sức mạnh bảo hộ của sáng chế/thuật toán (Claim Scope, Novelty, Non-obviousness)
   - Phân tích rủi ro FTO nhằm đảm bảo không xâm phạm quyền của bên thứ ba khi đưa ra thị trường
2. 📜 MÔ HÌNH CẤP PHÉP BẢN QUYỀN & ĐỊNH MỨC PHÍ ROYALTY (IP LICENSING & ROYALTY STRUCTURING):
   - So sánh cấp phép độc quyền (Exclusive) vs không độc quyền (Non-exclusive) vs cấp phép chéo (Cross-licensing)
   - Khung tính phí Royalty chuẩn ngành (Ví dụ: 3% - 7% Doanh thu thuần hoặc Phí cố định theo lượt sử dụng Per-unit)
   - Cấu trúc thanh toán: Phí trả trước (Upfront Fee) + Phí duy trì tối thiểu hàng năm (Minimum Annual Royalty)
3. 🛡️ CHIẾN LƯỢC BẢO VỆ PHÒNG THỦ & PHÁT HIỆN HÀNH VI XÂM PHẠM (DEFENSIVE IP & INFRINGEMENT ENFORCEMENT):
   - Quy trình rà soát sản phẩm đối thủ để phát hiện xâm phạm quyền (Reverse Engineering & Claim Charting)
   - Kịch bản gửi Thư Cảnh Cáo (Cease & Desist Letter) và đàm phán giải quyết hòa giải trước khi khởi kiện
4. 📈 LỘ TRÌNH KHAI THÁC DOANH THU TỪ SỞ HỮU TRÍ TUỆ TRONG 3 NĂM

Trình bày theo chuẩn pháp lý quốc tế (WIPO / USPTO), tách bạch ý nghĩa rõ ràng, số liệu minh bạch và mang lại giá trị thương mại hóa tối đa cho doanh nghiệp.`;

    try {
      const { text: ipText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        ipContext,
        monetizationGoal,
        report: ipText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const patentMonetization = new PatentMonetizationEngine();
