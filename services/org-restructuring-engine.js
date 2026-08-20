import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Tái Cấu Trúc Tổ Chức & Tối Ưu Hóa Định Biên Nhân Sự (Organizational Restructuring & Headcount Engine)
 */
export class OrgRestructuringEngine {
  /**
   * Thiết lập kế hoạch tái cấu trúc bộ máy, tối ưu định biên nhân sự và quản trị sự thay đổi
   */
  async planRestructuring(orgContext, targetGoal = 'Tinh gọn bộ máy & Giảm 20% chi phí vận hành', timeline = '90 ngày') {
    if (!orgContext || typeof orgContext !== 'string') {
      return { success: false, error: 'Bối cảnh tổ chức không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Chuyển Đổi Tổ Chức & Cố Vấn Tái Cấu Trúc Cấp Cao (Chief Transformation Officer - CTO & Senior HR Restructuring Advisor).
Hãy lập một Kế Hoạch Tái Cấu Trúc Doanh Nghiệp & Tối Ưu Định Biên Nhân Sự (Corporate Restructuring & Headcount Plan) cho mô hình sau:

BỐI CẢNH TỔ CHỨC HIỆN TẠI:
"""
${orgContext}
"""
MỤC TIÊU TÁI CẤU TRÚC: ${targetGoal}
THỜI HẠN TRIỂN KHAI: ${timeline}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🏛️ MÔ HÌNH TỔ CHỨC MỚI (AS-IS VS TO-BE ORGANIZATIONAL ARCHITECTURE):
   - Tối ưu tầm hạn quản trị (Span of Control từ 1:4 lên 1:7)
   - Xóa bỏ các tầng trung gian và phòng ban chồng chéo chức năng
2. 👥 MA TRẬN ĐÁNH GIÁ & ĐỊNH BIÊN NHÂN SỰ (TALENT RETENTION & ROLE CONSOLIDATION):
   - Nhóm nhân sự cốt lõi bắt buộc giữ chân (Key Talent / Flight Risk)
   - Nhóm vị trí sáp nhập hoặc chuyển đổi sang tự động hóa / AI
3. 💰 DỰ BÁO CẮT GIẢM CHI PHÍ & DỰ PHÒNG CHÍNH SÁCH (COST SAVINGS & SEVERANCE SIMULATION)
4. 🗺️ LỘ TRÌNH TRUYỀN THÔNG NỘI BỘ 4 GIAI ĐOẠN (CHANGE MANAGEMENT & PSYCHOLOGICAL SAFETY):
   - Tránh gây hoang mang, duy trì năng suất của đội ngũ ở lại và bảo vệ văn hóa doanh nghiệp

Trình bày theo phong cách quản trị chiến lược cấp cao, nhân văn nhưng quyết đoán và bảo vệ an toàn tối đa cho sự tồn tại và phát triển của doanh nghiệp.`;

    try {
      const { text: restructText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        orgContext,
        targetGoal,
        plan: restructText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const orgRestructuring = new OrgRestructuringEngine();
