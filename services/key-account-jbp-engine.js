import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Khách Hàng Trọng Điểm & Kế Hoạch Kinh Doanh Đồng Thuận (Key Account Management & Joint Business Planning Engine)
 */
export class KeyAccountJbpEngine {
  /**
   * Thiết lập kế hoạch kinh doanh đồng thuận JBP 3 năm cho khách hàng VIP Enterprise, sơ đồ cổ đông đa tầng và bảo vệ tái ký hợp đồng nhiều năm
   */
  async structureKeyAccountJbp(accountContext, contractValue = '$100,000 - $1,000,000+ ARR / Khách hàng Top 5% doanh thu', renewalTimeline = 'Kỳ tái ký hợp đồng 180 ngày tới kèm mục tiêu mở rộng quy mô (Land & Expand)') {
    if (!accountContext || typeof accountContext !== 'string') {
      return { success: false, error: 'Thông tin tài khoản khách hàng trọng điểm không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Quản Trị Khách Hàng Trọng Điểm Doanh Nghiệp Toàn Cầu (VP of Strategic Key Accounts & Enterprise Client Success Partner).
Hãy lập một Đề Án Quản Trị Khách Hàng Trọng Điểm & Kế Hoạch Kinh Doanh Đồng Thuận (Enterprise Key Account Management & Joint Business Plan - JBP) cho tài khoản sau:

THÔNG TIN TÀI KHOẢN KHÁCH HÀNG & MỐI QUAN HỆ HIỆN TẠI:
"""
${accountContext}
"""
QUY MÔ HỢP ĐỒNG (CONTRACT VALUE): ${contractValue}
LỘ TRÌNH TÁI KÝ & MỞ RỘNG (RENEWAL & EXPANSION): ${renewalTimeline}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🤝 TẦM NHÌN KINH DOANH ĐỒNG THUẬN 3 NĂM & CHỈ SỐ KPI CHUNG (3-YEAR JOINT VALUE HORIZON & SHARED KPIS):
   - Định nghĩa giá trị cốt lõi mang lại cho khách hàng (Cost Savings, Revenue Acceleration, Digital Agility)
   - Bảng chỉ số đo lường hiệu quả thành công chung (Shared Metrics Scorecard)
2. 🗺️ MA TRẬN QUAN HỆ ĐA TẦNG & BẢO ĐẢM NHÀ TÀI TRỢ CẤP CAO (MULTI-THREADED STAKEHOLDER MAPPING):
   - Bản đồ các bên liên quan: Executive Sponsor (C-Level), Economic Buyer, Technical Evaluator, Champion & Procurement
   - Chiến lược xây dựng mối quan hệ đa điểm chạm để triệt tiêu rủi ro khi Champion nội bộ chuyển việc (De-risking Single Point of Failure)
3. 🛡️ CHIẾN LƯỢC BẢO VỆ TÁI KÝ 180 NGÀY & KHÓA HỢP ĐỒNG NHIỀU NĂM (PROACTIVE RENEWAL DEFENSE & MULTI-YEAR LOCK-IN):
   - Lộ trình chuẩn bị tái ký trước 180 ngày - 90 ngày - 30 ngày (Early Renewal Playbook)
   - Đề xuất hợp đồng dài hạn 3 năm kèm điều khoản bảo lưu giá & chiết khấu thanh toán trước (Multi-Year Contract Lock)
4. 📈 LỘ TRÌNH MỞ RỘNG TÀI KHOẢN ĐA PHÒNG BAN & NHỊP ĐỘ QUẢN TRỊ (LAND & EXPAND PLAYBOOK & EXECUTIVE QBR CADENCE)

Trình bày theo phong cách chuyên gia Key Account Management hàng đầu (Gartner / McKinsey Sales Practice), sâu sắc về quan hệ đối tác chiến lược, bảo vệ tối đa doanh thu định kỳ NRR > 130%.`;

    try {
      const { text: jbpText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        accountContext,
        contractValue,
        report: jbpText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const keyAccountJbp = new KeyAccountJbpEngine();
