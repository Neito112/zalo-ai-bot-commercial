import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Cuộc Họp Hội Đồng Quản Trị & Đại Hội Đồng Cổ Đông (Enterprise Boardroom Governance & AGM Engine)
 */
export class BoardroomGovernanceEngine {
  /**
   * Thiết lập chương trình họp HĐQT/ĐHĐCĐ, tài liệu Board Pack, ma trận quyền biểu quyết Reserved Matters và cơ chế giám sát giao dịch bên liên quan RPT
   */
  async orchestrateBoardroomMeeting(meetingContext, meetingType = 'Họp Hội Đồng Quản Trị Định Kỳ (Quarterly Board Meeting)', governanceTarget = 'Tuân thủ Luật Doanh nghiệp 2020 & Bộ Nguyên tắc Quản trị Công ty OECD/G20') {
    if (!meetingContext || typeof meetingContext !== 'string') {
      return { success: false, error: 'Thông tin cuộc họp quản trị không hợp lệ.' };
    }

    const prompt = `Bạn là Thư Ký Công Ty Cấp Cao & Chuyên Gia Quản Trị Doanh Nghiệp Quốc Tế (Chartered Corporate Secretary & Corporate Governance Specialist).
Hãy lập một Bộ Tài Liệu Điều Hành Cuộc Họp HĐQT / ĐHĐCĐ (Executive Boardroom Governance Pack) cho cuộc họp sau:

THÔNG TIN NỘI DUNG CUỘC HỌP & BỐI CẢNH DOANH NGHIỆP:
"""
${meetingContext}
"""
LOẠI HÌNH CUỘC HỌP: ${meetingType}
TIÊU CHUẨN QUẢN TRỊ (GOVERNANCE TARGET): ${governanceTarget}

CẤU TRÚC BỘ TÀI LIỆU YÊU CẦU:
1. 🏛️ CHƯƠNG TRÌNH NGHỊ SỰ CHIẾN LƯỢC & HỒ SƠ HĐQT (STRATEGIC AGENDA & BOARD PACK):
   - Phân bổ thời lượng họp 70% cho thảo luận chiến lược & quản trị rủi ro, 30% cho phê duyệt báo cáo vận hành
   - Danh mục tài liệu đính kèm gửi trước 7 ngày (Executive Summary, Báo cáo KPI tài chính, Tờ trình đầu tư CAPEX)
2. ⚖️ MA TRẬN VẤN ĐỀ BẢO LƯU & TỶ LỆ BIỂU QUYẾT ĐẶC BIỆT (RESERVED MATTERS & SUPERMAJORITY VOTING):
   - Danh sách các vấn đề thuộc thẩm quyền tuyệt đối của HĐQT/ĐHĐCĐ (Tăng vốn, Phát hành cổ phần, Mua bán sáp nhập M&A, Thay đổi ngành nghề)
   - Tỷ lệ thông qua bắt buộc (Đa số thông thường 51% vs Đa số đặc biệt 65% - 75%)
3. 🛡️ KIỂM SOÁT XUNG ĐỘT LỢI ÍCH & GIAO DỊCH VỚI BÊN LIÊN QUAN (CONFLICT OF INTEREST - COI & RELATED-PARTY TRANSACTIONS - RPT):
   - Quy trình công bố lợi ích của Thành viên HĐQT / Ban Tổng Giám đốc
   - Cơ chế loại trừ quyền biểu quyết (Voting Recusal) của thành viên có liên quan để bảo vệ cổ đông thiểu số
4. 📜 MẪU BIÊN BẢN HỌP HĐQT & BẢNG THEO DÕI NGHỊ QUYẾT (FORMAL BOARD MINUTES & ACTION ITEMS TRACKER)

Trình bày chuẩn mực quản trị doanh nghiệp niêm yết, tách bạch ý nghĩa rõ ràng, ngôn từ pháp lý chặt chẽ và tạo nền tảng vững chắc cho sự đồng thuận giữa các cổ đông.`;

    try {
      const { text: boardText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        meetingContext,
        meetingType,
        report: boardText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const boardroomGovernance = new BoardroomGovernanceEngine();
