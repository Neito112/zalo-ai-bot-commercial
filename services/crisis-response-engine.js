import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Xử Lý Khiếu Nại Cấp Cao & Khủng Hoảng Khách Hàng (Customer Escalation & Crisis Response Engine)
 */
export class CrisisResponseEngine {
  /**
   * Phân tích sự cố, lập kịch bản xoa dịu khách hàng và chiến lược bồi thường
   */
  async handleCrisis(complaintDetails, severity = 'Cao', customerTier = 'Khách hàng VIP / Doanh nghiệp') {
    if (!complaintDetails || typeof complaintDetails !== 'string') {
      return { success: false, error: 'Thông tin khiếu nại không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Trải Nghiệm Khách Hàng (Chief Customer Officer - CCO) & Chuyên Gia Xử Lý Khủng Hoảng Doanh Nghiệp.
Hãy phân tích sự cố/khiếu nại sau đây và lập Phương Án Xử Lý Khủng Hoảng & Phản Hồi Xoa Dịu (De-escalation Action Plan) chuẩn mực nhất.

MỨC ĐỘ NGHIÊM TRỌNG: ${severity}
PHÂN HẠNG KHÁCH HÀNG: ${customerTier}
CHI TIẾT KHIẾU NẠI / SỰ CỐ:
"""
${complaintDetails}
"""

CẤU TRÚC PHƯƠNG ÁN YÊU CẦU:
1. 🔍 ĐÁNH GIÁ MỨC ĐỘ RỦI RO & THIỆT HẠI (Rủi ro pháp lý, rủi ro truyền thông/mạng xã hội, nguy cơ mất khách hàng)
2. ✍️ BỨC THƯ / TIN NHẮN PHẢN HỒI XOA DỊU TRỰC TIẾP TỚI KHÁCH HÀNG:
   - Thể hiện sự thấu cảm sâu sắc, chịu trách nhiệm chuyên nghiệp, không đổ lỗi
   - Trình bày rõ nguyên nhân ngắn gọn và giải pháp khắc phục ngay lập tức
3. 🎁 PHƯƠNG ÁN BỒI THƯỜNG & KHẮC PHỤC HẬU QUẢ (Chính sách đền bù hợp lý, voucher, hoàn tiền hoặc nâng cấp dịch vụ)
4. 🛡️ BÁO CÁO NGUYÊN NHÂN GỐC RỄ (RCA) & BIỆN PHÁP PHÒNG NGỪA NỘI BỘ

Trình bày sắc bén, ngoại giao đỉnh cao, bảo vệ uy tín thương hiệu và giữ chân khách hàng.`;

    try {
      const { text: responsePlan } = await generateContentWithFailover(prompt);
      return {
        success: true,
        complaintDetails,
        severity,
        customerTier,
        plan: responsePlan.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const crisisResponseEngine = new CrisisResponseEngine();
