import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Rủi Ro & Kế Hoạch Ứng Phó Khẩn Cấp Doanh Nghiệp (Risk Management & Business Continuity Engine)
 */
export class RiskManagementEngine {
  /**
   * Đánh giá rủi ro doanh nghiệp toàn diện và lập ma trận phòng ngừa sự cố
   */
  async generateRiskMatrix(businessContext, riskCategory = 'Toàn diện (Tài chính, Vận hành, Công nghệ, Pháp lý)') {
    if (!businessContext || typeof businessContext !== 'string') {
      return { success: false, error: 'Bối cảnh doanh nghiệp không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Quản Trị Rủi Ro (Chief Risk Officer - CRO) & Chuyên Gia Duy Trì Hoạt Động Kinh Doanh (Business Continuity Planning - BCP).
Hãy lập một Báo Cáo Đánh Giá Rủi Ro & Ma Trận Phòng Ngừa Sự Cố (Enterprise Risk Matrix & Contingency Plan) cho mô hình sau:

BỐI CẢNH DOANH NGHIỆP / DỰ ÁN:
"""
${businessContext}
"""
DANH MỤC TRỌNG TÂM: ${riskCategory}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🛡️ MA TRẬN ĐÁNH GIÁ RỦI RO 4 CỘT (Xác suất xảy ra, Mức độ thiệt hại, Mức rủi ro: Cao/Trung bình/Thấp):
   - Rủi ro Tài chính & Dòng tiền
   - Rủi ro Gián đoạn Vận hành & Hạ tầng Công nghệ (Server down, Data breach)
   - Rủi ro Pháp lý, Hợp đồng & Tuân thủ
   - Rủi ro Đối tác, Chuỗi cung ứng & Thị trường
2. ⚠️ KỊCH BẢN ỨNG PHÓ KHẨN CẤP (DISASTER RECOVERY & CONTINGENCY PROTOCOL):
   - Quy trình kích hoạt khi xảy ra sự cố cấp 1 (Khẩn cấp)
   - Phân công chỉ huy và thời gian khôi phục mục tiêu (RTO / RPO)
3. 💡 3 BIỆN PHÁP PHÒNG NGỪA CHỦ ĐỘNG (PROACTIVE MITIGATION) DÀNH CHO BAN GIÁM ĐỐC

Trình bày theo phong cách sắc bén, tập trung vào an toàn hoạt động và bảo vệ tài sản doanh nghiệp.`;

    try {
      const { text: riskText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        businessContext,
        riskCategory,
        report: riskText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const riskManagement = new RiskManagementEngine();
