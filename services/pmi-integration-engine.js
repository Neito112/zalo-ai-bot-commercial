import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Tích Hợp Sau Mua Bán Sáp Nhập 100 Ngày (Post-Merger Integration - PMI Engine)
 */
export class PmiIntegrationEngine {
  /**
   * Thiết lập kế hoạch tích hợp sau sáp nhập 100 ngày đầu tiên (First 100-Day PMI Plan) và hợp nhất văn hóa
   */
  async planPostMergerIntegration(dealContext, acquirerTargetNames = 'Bên thâu tóm vs Công ty mục tiêu', integrationScope = 'Tài chính ERP, Công nghệ, Nhân sự chủ chốt, Khách hàng') {
    if (!dealContext || typeof dealContext !== 'string') {
      return { success: false, error: 'Thông tin thương vụ M&A không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Ban Chỉ Đạo Tích Hợp Sau Sáp Nhập & Cố Vấn Tái Cấu Trúc Toàn Cầu (Head of Post-Merger Integration - IMO Lead & Managing Director).
Hãy lập một Kế Hoạch 100 Ngày Tích Hợp Doanh Nghiệp Sau Sáp Nhập (First 100-Day PMI Master Plan) cho thương vụ sau:

BỐI CẢNH THƯƠNG VỤ & QUY MÔ:
"""
${dealContext}
"""
CÁC BÊN THAM GIA: ${acquirerTargetNames}
PHẠM VI TÍCH HỢP: ${integrationScope}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🏁 CHECKLIST SẴN SÀNG NGÀY ĐẦU TIÊN (DAY 1 READINESS CHECKLIST):
   - Bàn giao quyền điều hành pháp lý & tài khoản ngân hàng
   - Thông điệp truyền thông trấn an khách hàng, đối tác và toàn thể nhân viên
2. 🔄 4 DÒNG CÔNG VIỆC TÍCH HỢP TRỌNG YẾU (4 PMI CORE WORKSTREAMS):
   - Tài chính & Kế toán ERP: Hợp nhất báo cáo tài chính, chuẩn hóa phần mềm kế toán và phê duyệt chi tiêu
   - Nhân sự & Văn hóa: Chính sách giữ chân nhân sự cốt cán (Retention Bonuses) và lộ trình hòa hợp văn hóa
   - Công nghệ & Sản phẩm: Đồng bộ hạ tầng dữ liệu, kiểm soát an ninh mạng và tích hợp tính năng sản phẩm
   - Thương mại & Khách hàng: Cam kết chất lượng dịch vụ SLA và triển khai chiến dịch bán chéo (Cross-Selling)
3. 🗓️ LỘ TRÌNH TRIỂN KHAI 100 NGÀY (PHASED TIMELINE: Ngày 1-30, Ngày 31-60, Ngày 61-100)
4. 🚨 3 CỜ ĐỎ THẤT BẠI TRONG TÍCH HỢP SAU M&A & CƠ CHẾ BAN CHỈ ĐẠO IMO QUẢN TRỊ

Trình bày theo phong cách chuyên gia tái cấu trúc cấp cao McKinsey/Bain, bảo toàn giá trị thâu tóm và hiện thực hóa trọn vẹn hiệu ứng cộng hưởng (Synergies).`;

    try {
      const { text: pmiText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        dealContext,
        acquirerTargetNames,
        report: pmiText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const pmiIntegration = new PmiIntegrationEngine();
