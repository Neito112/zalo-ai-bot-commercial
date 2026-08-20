import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Lập Kế Hoạch Kế Vị Lãnh Đạo & Giữ Chân Nhân Tài Cốt Lõi (Executive Succession & Key Talent Retention Engine)
 */
export class SuccessionPlanningEngine {
  /**
   * Thiết lập bản đồ quy hoạch đội ngũ kế cận C-level, ma trận 9-Box Grid, kế hoạch chuyển giao quyền lực và gói thưởng Retention Golden Handcuffs
   */
  async planExecutiveSuccession(companyContext, criticalRoles = 'CEO, CFO, CTO, CPO, Trưởng phòng Kinh doanh', timeHorizon = 'Kế hoạch kế vị 1 - 3 năm') {
    if (!companyContext || typeof companyContext !== 'string') {
      return { success: false, error: 'Thông tin doanh nghiệp không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Nhân Sự Cấp Cao & Cố Vấn Quy Hoạch Kế Vị Ban Điều Hành Tập Đoàn (Chief Human Resources Officer - CHRO & Executive Succession Partner).
Hãy lập một Đề Án Quy Hoạch Kế Vị Lãnh Đạo & Giữ Chân Nhân Tài Cốt Lõi (Executive Succession Planning & Key Talent Retention Framework) cho doanh nghiệp sau:

THÔNG TIN DOANH NGHIỆP & BỐI CẢNH VẬN HÀNH:
"""
${companyContext}
"""
CÁC VỊ TRÍ TRỌNG YẾU CẦN QUY HOẠCH: ${criticalRoles}
KHUNG THỜI GIAN KẾ VỊ DỰ KIẾN: ${timeHorizon}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 👑 BẢN ĐỒ KẾ CẬN BAN ĐIỀU HÀNH & MA TRẬN 9-BOX GRID (EXECUTIVE 9-BOX TALENT GRID):
   - Đánh giá tiềm năng phát triển (Potential) vs Hiệu suất công việc thực tế (Performance)
   - Phân loại 3 mức độ sẵn sàng kế vị: Sẵn sàng ngay lập tức (Ready Now), Sẵn sàng trong 1-2 năm (Ready in 1-2 Years), Cần đào tạo thêm (Emergency Backup)
2. 🚀 LỘ TRÌNH ĐÀO TẠO & HUẤN LUYỆN NÂNG CẤP NĂNG LỰC (EXECUTIVE DEVELOPMENT ACCELERATOR):
   - Huấn luyện kèm cặp 1-on-1 (Executive Coaching), luân chuyển phòng ban và giao quyền thử lửa các dự án sống còn
3. 💎 GÓI ĐÃI NGỘ CỐNG HIẾN "CÒNG TAY VÀNG" (GOLDEN HANDCUFFS RETENTION PACKAGE):
   - Thiết kế thưởng giữ chân dài hạn (Long-term Retention Bonus / Shadow Equity)
   - Điều khoản bảo vệ khi lãnh đạo nghỉ việc (Non-solicitation, Non-compete, Non-disclosure)
4. 🛡️ QUY TRÌNH ỨNG PHÓ KHỦNG HOẢNG KHI LÃNH ĐẠO CẤP CAO ĐỘT NGỘT TỪ NHIỆM (EMERGENCY SUCCESSION PROTOCOL):
   - Kế hoạch chỉ định quyền điều hành tạm thời (Interim Executive) trong vòng 24 - 48 giờ

Trình bày theo phong cách chuyên gia nhân sự chiến lược đẳng cấp Korn Ferry / Egon Zehnder, bảo mật tuyệt đối, đảm bảo tính liên tục và sự ổn định dài lâu cho doanh nghiệp.`;

    try {
      const { text: succText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        companyContext,
        criticalRoles,
        report: succText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const successionPlanning = new SuccessionPlanningEngine();
