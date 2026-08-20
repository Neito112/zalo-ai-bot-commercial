import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Xây Dựng Hội Đồng Cố Vấn & Quản Trị HĐQT Độc Lập (Advisory Board & Governance Engine)
 */
export class AdvisoryBoardEngine {
  /**
   * Thiết lập cơ cấu Hội đồng Cố vấn chiến lược, ma trận kỹ năng KSAO, hợp đồng FAST Agreement và cơ chế thù lao cổ phần
   */
  async structureAdvisoryBoard(companyContext, strategicPriorities = 'Gọi vốn Series A/B, Mở rộng thị trường quốc tế, Đổi mới công nghệ AI, Quan hệ đối tác chiến lược', compensationModel = 'Cổ phần thưởng theo thỏa thuận FAST 0.25% - 1.0% vesting 2 năm') {
    if (!companyContext || typeof companyContext !== 'string') {
      return { success: false, error: 'Thông tin doanh nghiệp không hợp lệ.' };
    }

    const prompt = `Bạn là Chủ Tịch Hội Đồng Quản Trị Cấp Cao & Cố Vấn Quản Trị Doanh Nghiệp Toàn Cầu (Chairman of the Board & Corporate Governance Senior Advisor).
Hãy lập một Đề Án Xây Dựng Hội Đồng Cố Vấn Chiến Lược & Thành Viên HĐQT Độc Lập (Strategic Advisory Board & Independent Governance Framework) cho doanh nghiệp sau:

THÔNG TIN DOANH NGHIỆP & GIAI ĐOẠN PHÁT TRIỂN:
"""
${companyContext}
"""
ƯU TIÊN CHIẾN LƯỢC CẦN CỐ VẤN: ${strategicPriorities}
MÔ HÌNH ĐÃI NGỘ DỰ KIẾN: ${compensationModel}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 👥 MA TRẬN KỸ NĂNG CỐ VẤN CHIẾN LƯỢC (ADVISORY BOARD SKILLS MATRIX):
   - Cố vấn Công nghệ & Trí tuệ nhân tạo (AI/Tech Visionary)
   - Cố vấn Tài chính, M&A & Huy động vốn quỹ mạo hiểm (Finance & Capital Markets)
   - Cố vấn Mở rộng thị trường toàn cầu & GTM (Global Expansion & Enterprise Sales)
   - Cố vấn Quan hệ chính phủ & Pháp lý cấp cao (Government Relations & Regulatory)
2. 📜 KHUNG HỢP ĐỒNG CỐ VẤN CHUẨN FAST (FOUNDER ADVISOR STANDARD TEMPLATE):
   - Cam kết thời lượng tư vấn (Số giờ mỗi tháng / Tham gia họp chiến lược quý)
   - Điều khoản bảo mật NDA và không cạnh tranh (Non-compete)
3. 💎 CƠ CHẾ ĐÃI NGỘ CỔ PHẦN & THÙ LAO (EQUITY COMPENSATION & VESTING SCHEDULE):
   - Tỷ lệ % cổ phần thưởng theo giai đoạn doanh nghiệp (0.25% - 1.0%)
   - Lộ trình trao quyền sở hữu Vesting 1-2 năm gắn liền với cột mốc giá trị tạo ra (Milestone-based Vesting)
4. 🏛️ QUY CHẾ VẬN HÀNH HỌP HỘI ĐỒNG CỐ VẤN ĐỊNH KỲ (QUARTERLY ADVISORY CADENCE & CHARTER)

Trình bày theo phong cách chuyên nghiệp, đẳng cấp quản trị quốc tế, tạo đòn bẩy uy tín tối đa để nâng tầm vị thế doanh nghiệp trước các quỹ đầu tư và đối tác lớn.`;

    try {
      const { text: advText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        companyContext,
        strategicPriorities,
        report: advText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const advisoryBoard = new AdvisoryBoardEngine();
