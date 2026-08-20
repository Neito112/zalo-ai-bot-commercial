import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Phòng Ngự Khủng Hoảng Thương Hiệu & Làn Sóng Tẩy Chay Mạng Xã Hội (Brand Crisis & Cancel Culture Shield Engine)
 */
export class CancelCultureShieldEngine {
  /**
   * Thiết lập kịch bản ứng phó khủng hoảng truyền thông mạng xã hội, dập tắt làn sóng tẩy chay (Cancel Culture), thông điệp 3A và khôi phục niềm tin thương hiệu
   */
  async mitigateCancelCultureCrisis(crisisContext, platformSpread = 'Mạng xã hội TikTok, Facebook, X (Twitter), Diễn đàn Threads & Báo chí điện tử', severityLevel = 'Cấp độ Khẩn cấp (Defcon 1 - Nguy cơ tẩy chay diện rộng & Tụt giảm doanh thu)') {
    if (!crisisContext || typeof crisisContext !== 'string') {
      return { success: false, error: 'Thông tin sự cố khủng hoảng không hợp lệ.' };
    }

    const prompt = `Bạn là Trưởng Ban Xử Lý Khủng Hoảng Truyền Thông Cấp Cao & Chuyên Gia Bảo Vệ Danh Tiếng Thương Hiệu Toàn Cầu (Chief Crisis Communications Strategist & Reputation Defense Counsel).
Hãy lập một Kịch Bản Ứng Phó Khẩn Cấp Phòng Ngự Khủng Hoảng Tẩy Chay Mạng Xã Hội (Social Media Outrage & Cancel Culture Defense Playbook) cho sự cố sau:

THÔNG TIN BỐI CẢNH SỰ CỐ & NGUY CƠ KHỦNG HOẢNG:
"""
${crisisContext}
"""
NỀN TẢNG LAN TRUYỀN CHÍNH: ${platformSpread}
MỨC ĐỘ NGHIÊM TRỌNG (SEVERITY LEVEL): ${severityLevel}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. ⏱️ KỊCH BẢN PHẢN ỨNG TRONG 3 GIỜ VÀNG (3-HOUR GOLDEN WINDOW RESPONSE):
   - Kích hoạt cơ chế dừng toàn bộ quảng cáo tự động (Paid Ad Blackout) để tránh phản cảm
   - Thông cáo báo chí khẩn cấp (Holding Statement) theo nguyên tắc 3A: Acknowledge (Ghi nhận nỗi bức xúc) - Apologize (Nhận trách nhiệm chân thành, không ngụy biện) - Action (Cam kết hành động khắc phục cụ thể)
2. 🛡️ QUY TRÌNH HÓA GIẢI LÀN SÓNG TẨY CHAY & ĐIỀU HƯỚNG DƯ LUẬN (DE-ESCALATION & NARRATIVE CONTROL):
   - Phương pháp tương tác với các thủ lĩnh dư luận (KOLs/Influencers) và báo chí chính thống
   - Kỹ thuật phân tách nhóm quá khích (Trolls) khỏi nhóm khách hàng có bức xúc chính đáng
3. 👥 QUY CHẾ ĐỒNG THUẬN NỘI BỘ & BẢO VỆ NHÂN VIÊN TUYẾN ĐẦU (INTERNAL ALIGNMENT & STAFF SHIELD):
   - Hướng dẫn phát ngôn nội bộ (Internal Talking Points) nghiêm cấm nhân viên tự ý tranh cãi trên mạng
   - Kế hoạch bảo vệ tâm lý cho đội ngũ Chăm sóc khách hàng tuyến đầu
4. 📈 LỘ TRÌNH 90 NGÀY TÁI TẠO DANH TIẾNG & KHÔI PHỤC NIỀM TIN (REPUTATION REPAIR & TRUST RECLAMATION ROADMAP)

Trình bày theo phong cách chuyên gia quản trị khủng hoảng quốc tế đỉnh cao, sắc lạnh, thấu cảm sâu sắc tâm lý đám đông và triệt tiêu tối đa rủi ro pháp lý lẫn thiệt hại tài chính.`;

    try {
      const { text: ccText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        crisisContext,
        platformSpread,
        report: ccText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const cancelCultureShield = new CancelCultureShieldEngine();
