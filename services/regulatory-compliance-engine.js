import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Rủi Ro Pháp Lý & Tuân Thủ Quy Chuẩn Luật Định (Regulatory Compliance & Legal Risk Engine)
 */
export class RegulatoryComplianceEngine {
  /**
   * Đánh giá ma trận rủi ro tuân thủ pháp luật, rà soát giấy phép con ngành nghề và lập lộ trình khắc phục sai phạm
   */
  async auditRegulatoryCompliance(businessContext, industrySector = 'Công nghệ FinTech / Thương mại điện tử / Bất động sản / Sản xuất', jurisdiction = 'Việt Nam & Quốc tế') {
    if (!businessContext || typeof businessContext !== 'string') {
      return { success: false, error: 'Thông tin hoạt động doanh nghiệp không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Pháp Chế & Trưởng Ban Tuân Thủ Quy Chuẩn Tập Đoàn (General Counsel - GC & Chief Compliance Officer - CCO).
Hãy lập một Báo Cáo Thẩm Định & Ma Trận Quản Trị Rủi Ro Tuân Thủ Pháp Luật (Enterprise Regulatory Compliance & Legal Risk Audit) cho doanh nghiệp sau:

THÔNG TIN HOẠT ĐỘNG & MÔ HÌNH KINH DOANH:
"""
${businessContext}
"""
NGÀNH NGHỀ / LĨNH VỰC: ${industrySector}
KHU VỰC PHÁP LÝ ÁP DỤNG: ${jurisdiction}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🚦 MA TRẬN NHIỆT RỦI RO PHÁP LÝ 4 TRỤ CỘT (LEGAL RISK HEATMAP: Khả năng xảy ra vs Mức độ tổn thất):
   - Pháp chế doanh nghiệp & Đầu tư (Luật Doanh nghiệp, cơ cấu vốn, nghị quyết HĐQT)
   - Lao động & Chế độ phúc lợi (Hợp đồng lao động, bảo hiểm xã hội, rủi ro tranh chấp sa thải)
   - Thuế & Chống rửa tiền / Phòng chống gian lận (Thuế TNDN, AML/KYC, kê khai giá chuyển nhượng)
   - Bảo mật dữ liệu & An ninh mạng (Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân)
2. 📋 DANH MỤC RÀ SOÁT GIẤY PHÉP CON & ĐIỀU KIỆN KINH DOANH (SUB-LICENSES & REGULATORY PERMITS):
   - Giấy phép bắt buộc đối với ngành nghề kinh doanh có điều kiện
   - Nghĩa vụ báo cáo định kỳ với các cơ quan quản lý nhà nước
3. ⚡ 3 LỖ HỔNG PHÁP LÝ CỐT TỬ CẦN KHẮC PHỤC KHẨN CẤP (CRITICAL LEGAL DEFECTS & REMEDIATION):
   - Rủi ro bị đình chỉ hoạt động hoặc xử phạt vi phạm hành chính nặng
4. 📜 CHÍNH SÁCH TUÂN THỦ NỘI BỘ & CƠ CHẾ BẢO VỆ PHÁP LÝ CHO BAN ĐIỀU HÀNH (D&O LIABILITY PROTECTION)

Trình bày theo phong cách cố vấn pháp chế cao cấp, chuẩn xác về mặt luật học, bảo vệ an toàn tối đa cho pháp nhân và ban lãnh đạo doanh nghiệp.`;

    try {
      const { text: legalText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        businessContext,
        industrySector,
        report: legalText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const regulatoryCompliance = new RegulatoryComplianceEngine();
