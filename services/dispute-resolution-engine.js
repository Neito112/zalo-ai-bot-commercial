import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Xử Lý Tranh Chấp Hợp Đồng Thương Mại & Trọng Tài Kinh Tế (Contract Dispute & Litigation Playbook Engine)
 */
export class DisputeResolutionEngine {
  /**
   * Thiết lập chiến lược giải quyết tranh chấp hợp đồng kinh tế, thư thông báo vi phạm và hồ sơ khởi kiện
   */
  async resolveContractDispute(disputeDetails, contractType = 'Hợp đồng mua bán hàng hóa / Cung cấp dịch vụ / Hợp tác đầu tư', claimAmount = 'Số tiền tranh chấp / Thiệt hại phát sinh') {
    if (!disputeDetails || typeof disputeDetails !== 'string') {
      return { success: false, error: 'Chi tiết tranh chấp hợp đồng không hợp lệ.' };
    }

    const prompt = `Bạn là Luật Sư Trưởng Tranh Tụng Thương Mại & Trọng Tài Viên Quốc Tế (Senior Commercial Litigation Counsel & Arbitrator).
Hãy lập một Kế Hoạch Chiến Lược Giải Quyết Tranh Chấp Hợp Đồng Kinh Tế (Contract Dispute Resolution & Litigation Roadmap) cho vụ việc sau:

LOẠI HỢP ĐỒNG: ${contractType}
GIÁ TRỊ TRANH CHẤP / THIỆT HẠI: ${claimAmount}
DIỄN BIẾN TRANH CHẤP & HÀNH VI VI PHẠM:
"""
${disputeDetails}
"""

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. ⚖️ ĐÁNH GIÁ TÍNH PHÁP LÝ & CƠ CẤU CHỨNG CỨ (LEGAL MERIT & EVIDENCE AUDIT):
   - Căn cứ điều khoản vi phạm trong hợp đồng và Luật Thương mại / Bộ luật Dân sự
   - Đánh giá sức mạnh chứng cứ (Biên bản giao nhận, email, xác nhận công nợ, đối soát)
2. 📝 THƯ THÔNG BÁO VI PHẠM NGHĨA VỤ & YÊU CẦU BỒI THƯỜNG (FORMAL NOTICE OF DEFAULT & DEMAND LETTER):
   - Thể thức văn bản pháp lý đanh thép, ấn định thời hạn khắc phục 7-15 ngày trước khi khởi kiện
3. 🏛️ CHIẾN LƯỢC TRANH TỤNG 3 BƯỚC (ESCALATION LADDER):
   - Bước 1: Thương lượng & Hòa giải cấp cao (Settlement Levers & Cơ cấu giãn nợ)
   - Bước 2: Khởi kiện ra Trung tâm Trọng tài Quốc tế (VIAC) hoặc Tòa án nhân dân có thẩm quyền
   - Bước 3: Đề nghị Áp dụng Biện pháp khẩn cấp tạm thời (Phong tỏa tài khoản ngân hàng, kê biên tài sản bảo đảm thi hành án)
4. 💼 ĐÒN BẨY ĐÀM PHÁN DÀNH CHO BAN LÃNH ĐẠO (MAXIMIZE RECOVERY RATE)

Trình bày theo phong cách luật sư tranh tụng cấp cao sắc sảo, đanh thép, bảo vệ tối đa quyền lợi tài chính hợp pháp của doanh nghiệp.`;

    try {
      const { text: disputeText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        disputeDetails,
        contractType,
        report: disputeText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const disputeResolution = new DisputeResolutionEngine();
