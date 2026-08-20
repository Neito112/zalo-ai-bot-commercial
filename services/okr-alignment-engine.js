import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Thiết Lập & Căn Chỉnh Mục Tiêu Chiến Lược OKR / KPI (OKR & KPI Alignment Engine)
 */
export class OkrAlignmentEngine {
  /**
   * Thiết lập hệ thống mục tiêu OKR và chỉ số KPI đo lường theo quý
   */
  async generateOkrFramework(strategicGoal, department = 'Toàn công ty', timeHorizon = 'Quý tiếp theo (Q+1)') {
    if (!strategicGoal || typeof strategicGoal !== 'string') {
      return { success: false, error: 'Mục tiêu chiến lược không hợp lệ.' };
    }

    const prompt = `Bạn là Chuyên Gia Cố Vấn Quản Trị Mục Tiêu Doanh Nghiệp (Senior OKR Master & Strategy Alignment Consultant).
Hãy thiết lập một Hệ Thống Mục Tiêu & Kết Quả Then Chốt (OKRs) & Chỉ Số Hiệu Suất (KPIs) chuẩn mực cho mục tiêu sau:

MỤC TIÊU CHIẾN LƯỢC: "${strategicGoal}"
PHÒNG BAN / PHẠM VI: ${department}
KHUNG THỜI GIAN: ${timeHorizon}

CẤU TRÚC HỆ THỐNG OKR YÊU CẦU:
1. 🎯 MỤC TIÊU ĐỊNH TÍNH TRỌNG TÂM (OBJECTIVES - O): Truyền cảm hứng, tham vọng và rõ ràng
2. 📊 3-4 KẾT QUẢ THEN CHỐT ĐỊNH LƯỢNG (KEY RESULTS - KRs CHUẨN SMART):
   - KR1: [Định lượng từ X -> Y] -> [Chỉ số dẫn dắt/Leading Indicator] -> [Người chịu trách nhiệm chính]
   - KR2: ...
   - KR3: ...
3. 📈 BẢNG PHÂN RÃ KPI CHO TỪNG PHÒNG BAN LIÊN QUAN (Marketing, Sales, Tech, Operations)
4. ⏱️ NHỊP ĐIỆU THEO DÕI & ĐÁNH GIÁ (WEEKLY CHECK-IN & CONFIDENCE SCORING 0.0 - 1.0)
5. ⚠️ CÁC SÁNG KIẾN ĐỘT PHÁ (INITIATIVES) CẦN TRIỂN KHAI NGAY TUẦN 1

Trình bày theo phong cách sắc bén, tập trung vào kết quả định lượng, giúp ban giám đốc và đội ngũ cùng hướng về một mục tiêu duy nhất.`;

    try {
      const { text: okrText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        strategicGoal,
        department,
        timeHorizon,
        framework: okrText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const okrAlignmentEngine = new OkrAlignmentEngine();
