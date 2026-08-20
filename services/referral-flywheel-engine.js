import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Xây Dựng Bánh Đà Giới Thiệu & Kích Hoạt Khách Hàng Ủng Hộ (Customer Advocacy & Referral Flywheel Engine)
 */
export class ReferralFlywheelEngine {
  /**
   * Thiết lập chiến lược bánh đà giới thiệu (Referral Flywheel), phân loại NPS Promoters, chính sách thưởng 2 chiều và Hội đồng khách hàng VIP CAB
   */
  async buildReferralFlywheel(customerBaseContext, incentiveType = 'Thưởng hoa hồng định kỳ 2 chiều (Double-sided Credits/Cashback) + Đặc quyền VIP', targetKFactor = 'Hệ số lan truyền K-Factor > 1.2x') {
    if (!customerBaseContext || typeof customerBaseContext !== 'string') {
      return { success: false, error: 'Thông tin tập khách hàng không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Trải Nghiệm & Phát Triển Khách Hàng Trung Thành Toàn Cầu (Chief Customer Officer & Viral Referral Architect).
Hãy lập một Đề Án Xây Dựng Bánh Đà Giới Thiệu & Kích Hoạt Khách Hàng Ủng Hộ (Customer Advocacy Program & Referral Flywheel Architecture) cho doanh nghiệp sau:

THÔNG TIN SẢN PHẨM & TẬP KHÁCH HÀNG:
"""
${customerBaseContext}
"""
CHÍNH SÁCH THƯỞNG GIỚI THIỆU: ${incentiveType}
MỤC TIÊU HỆ SỐ LAN TRUYỀN: ${targetKFactor}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🌟 PHÂN TẦNG KHÁCH HÀNG NPS & KỊCH BẢN KÍCH HOẠT PROMOTERS (NPS PROMOTER ACTIVATION):
   - Quy trình tự động gửi lời mời giới thiệu đến nhóm Promoters (Điểm NPS 9-10) ngay sau thời khắc hài lòng nhất (Post-Value Delivery)
   - Kịch bản phản hồi chuyển hóa nhóm trung lập Passives (7-8) thành người ủng hộ trung thành
2. 🎁 THIẾT KẾ CƠ CHẾ THƯỞNG 2 CHIỀU HẤP DẪN (DOUBLE-SIDED REFERRAL INCENTIVES):
   - Phần thưởng cho Người giới thiệu (Advocate: Giảm 20% phí thuê bao hàng tháng hoặc nhận thưởng tiền mặt)
   - Phần thưởng cho Người được giới thiệu (Friend: Miễn phí dùng thử gói VIP và tặng Credit khởi đầu)
3. 👑 HỘI ĐỒNG KHÁCH HÀNG CỐ VẤN ĐẶC QUYỀN (CUSTOMER ADVISORY BOARD - CAB):
   - Thành lập cộng đồng 1% khách hàng doanh nghiệp VIP để đồng sáng tạo tính năng (Co-Innovation)
   - Đặc quyền gặp gỡ ban điều hành C-level, trải nghiệm sớm tính năng Beta và tham gia sự kiện thường niên độc quyền
4. 📈 CÔNG THỨC ĐO LƯỜNG HỆ SỐ LAN TRUYỀN & PHỄU CHUYỂN ĐỔI (VIRAL COEFFICIENT K-FACTOR & ADVOCACY METRICS)

Trình bày theo phong cách chuyên gia tăng trưởng lan truyền (Dropbox, Airbnb, Figma), sắc sảo, truyền cảm hứng và biến khách hàng thành đội ngũ đại sứ bán hàng tự nguyện hùng hậu nhất.`;

    try {
      const { text: refText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        customerBaseContext,
        incentiveType,
        report: refText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const referralFlywheel = new ReferralFlywheelEngine();
