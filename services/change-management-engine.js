import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Chuyển Đổi Tổ Chức & Mô Hình ADKAR (Enterprise Change Management & ADKAR Engine)
 */
export class ChangeManagementEngine {
  /**
   * Thiết lập kế hoạch quản trị thay đổi tổ chức theo mô hình ADKAR, hóa giải lực cản và xây dựng mạng lưới Change Champions
   */
  async planChangeManagement(changeContext, scopeOfChange = 'Chuyển đổi số ERP / Áp dụng AI tự động hóa / Tái cấu trúc sáp nhập', affectedStakeholders = 'Toàn bộ nhân viên, Khối Vận hành, Quản lý cấp trung') {
    if (!changeContext || typeof changeContext !== 'string') {
      return { success: false, error: 'Thông tin dự án chuyển đổi không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Chuyển Đổi Chiến Lược & Chuyên Gia Quản Trị Thay Đổi Tổ Chức Cấp Cao (Chief Transformation Officer - CTO & Prosci Certified Change Master).
Hãy lập một Kế Hoạch Quản Trị Chuyển Đổi Tổ Chức Toàn Diện (Enterprise Change Management & ADKAR Roadmap) cho sáng kiến sau:

SÁNG KIẾN CHUYỂN ĐỔI:
"""
${changeContext}
"""
QUY MÔ & PHẠM VI ẢNH HƯỞNG: ${scopeOfChange}
ĐỐI TƯỢNG BỊ ẢNH HƯỞNG CHÍNH: ${affectedStakeholders}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🎯 BẢN ĐỒ LỘ TRÌNH 5 GIAI ĐOẠN THEO MÔ HÌNH ADKAR:
   - A (Awareness): Kế hoạch truyền thông giúp toàn thể nhân sự thấu hiểu lý do bắt buộc phải thay đổi
   - D (Desire): Chiến lược khơi gợi động lực cá nhân và câu trả lời "Tôi được lợi gì từ điều này?" (WIIFM)
   - K (Knowledge): Giáo trình đào tạo kỹ năng số và quy trình vận hành mới
   - A (Ability): Huấn luyện thực hành (Coaching), loại bỏ rào cản và cấp quyền thử nghiệm
   - R (Reinforcement): Cơ chế vinh danh, thưởng nóng và đo lường sự gắn kết lâu dài
2. 🛡️ MA TRẬN HÓA GIẢI LỰC CẢN THAY ĐỔI (STAKEHOLDER RESISTANCE MITIGATION):
   - Phân loại nhóm đối tượng (Ủng hộ nhiệt thành, Trung lập quan sát, Phản đối ngầm)
   - Kịch bản đối thoại 1-on-1 giải tỏa lo âu mất việc hoặc quá tải công việc
3. 🚀 MẠNG LƯỚI ĐẠI SỨ CHUYỂN ĐỔI TIÊN PHONG (CHANGE CHAMPIONS NETWORK):
   - Lựa chọn hạt nhân lãnh đạo không chức danh tại từng phòng ban để lan tỏa văn hóa đổi mới
4. 📈 BẢNG CHỈ SỐ ĐO LƯỜNG THÀNH CÔNG CHUYỂN ĐỔI (TRANSFORMATION SCORECARD & KPI)

Trình bày theo phong cách chuyên gia tư vấn chuyển đổi cấp cao McKinsey / Prosci, thuyết phục, thấu cảm và thúc đẩy sự chuyển mình đồng lòng của toàn thể tổ chức.`;

    try {
      const { text: changeText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        changeContext,
        scopeOfChange,
        report: changeText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const changeManagement = new ChangeManagementEngine();
