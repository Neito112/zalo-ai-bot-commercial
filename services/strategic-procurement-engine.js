import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Đấu Thầu Chiến Lược & Chấm Điểm Hồ Sơ Mua Hàng Doanh Nghiệp (Enterprise Strategic Procurement & RFP Scoring Engine)
 */
export class StrategicProcurementEngine {
  /**
   * Thiết lập hồ sơ yêu cầu báo giá/đấu thầu (RFP), ma trận chấm điểm nhà thầu có trọng số, mô hình tổng chi phí sở hữu TCO và chiến lược đàm phán BAFO
   */
  async structureStrategicRfp(procurementContext, procurementScale = 'Hợp đồng chiến lược 500K$ - 5M$ / 3 năm', evaluationCriteria = 'Chất lượng kỹ thuật 40%, Tổng chi phí sở hữu TCO 35%, Uy tín nhà thầu & SLA 25%') {
    if (!procurementContext || typeof procurementContext !== 'string') {
      return { success: false, error: 'Thông tin hồ sơ mua sắm đấu thầu không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Mua Sắm Chiến Lược Toàn Cầu & Trọng Tài Đấu Thầu Cấp Cao (Chief Procurement Officer - CPO & Certified Sourcing Professional).
Hãy lập một Bộ Hồ Sơ Đấu Thầu Chiến Lược & Cẩm Nang Đàm Phán Nhà Thầu (Enterprise Strategic RFP & Vendor Negotiation Playbook) cho gói thầu sau:

THÔNG TIN GÓI THẦU / DỊCH VỤ CẦN MUA SẮM (PROCUREMENT CONTEXT):
"""
${procurementContext}
"""
QUY MÔ GÓI THẦU (ESTIMATED SCALE): ${procurementScale}
TIÊU CHÍ ĐÁNH GIÁ (EVALUATION CRITERIA): ${evaluationCriteria}

CẤU TRÚC ĐỀ ÁN YÊU CẦU:
1. 📋 ĐẶC TẢ YÊU CẦU KỸ THUẬT & TIÊU CHUẨN DỊCH VỤ (RFP SPECIFICATIONS & SLA REQUIREMENTS):
   - Phạm vi công việc SOW (Scope of Work) và các mốc bàn giao Milestone bắt buộc
   - Cam kết mức độ dịch vụ SLA (Service Level Agreement): Uptime 99.9%+, Thời gian phản hồi sự cố MTTR < 15 phút, hình phạt giảm trừ thanh toán khi vi phạm (SLA Penalty & Service Credits)
2. ⚖️ MA TRẬN CHẤM ĐIỂM CÓ TRỌNG SỐ & MÔ HÌNH TỔNG CHI PHÍ SỞ HỮU (WEIGHTED VENDOR SCORING & 3-YEAR TCO):
   - Bảng tiêu chí chấm điểm 100 điểm (Tính năng kỹ thuật, An ninh bảo mật, Năng lực đội ngũ, Tổng chi phí 3 năm TCO)
   - Phân tích chi phí ẩn: Chi phí bản quyền, chi phí tích hợp Onboarding, chi phí đào tạo và chi phí nâng cấp hàng năm
3. 💼 CHIẾN LƯỢC ĐÀM PHÁN BAFO & PHÒNG NGỪA BẪY TRÓI BUỘC (BEST & FINAL OFFER - BAFO & VENDOR LOCK-IN DEFENSE):
   - Kịch bản đàm phán 2 vòng: Vòng sơ loại kỹ thuật ➡️ Vòng đấu giá ngược BAFO ép giá 15-25%
   - Điều khoản giải thoát (Exit Clause & Data Portability): Quyền đơn phương chấm dứt hợp đồng và nhà thầu phải hỗ trợ bàn giao dữ liệu sạch không tính phí
4. 📜 KHUNG ĐIỀU KHOẢN HỢP ĐỒNG KHUNG (MASTER SERVICES AGREEMENT - MSA) & BẢO ĐẢM THỰC HIỆN HỢP ĐỒNG

Trình bày theo chuẩn mua sắm doanh nghiệp quốc tế, tách bạch ý nghĩa rõ ràng, số liệu minh bạch và mang lại lợi thế đàm phán áp đảo cho bên mua.`;

    try {
      const { text: rfpText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        procurementContext,
        procurementScale,
        report: rfpText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const strategicProcurement = new StrategicProcurementEngine();
