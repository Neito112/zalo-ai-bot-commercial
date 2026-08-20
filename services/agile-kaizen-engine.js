import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Họp Cải Tiến Liên Tục Kaizen & Tổng Kết Sprint Agile (Agile Retrospective & Kaizen Engine)
 */
export class AgileKaizenEngine {
  /**
   * Đánh giá hiệu suất Sprint, phân tích nguyên nhân gốc rễ 5 Whys và xây dựng kế hoạch cải tiến Kaizen
   */
  async conductRetrospective(sprintContext, teamType = 'Đội ngũ Công nghệ / Marketing / Vận hành chuỗi', retrospectiveFramework = '4Ls (Liked, Learned, Lacked, Longed for) & 5 Whys') {
    if (!sprintContext || typeof sprintContext !== 'string') {
      return { success: false, error: 'Dữ liệu tổng kết Sprint không hợp lệ.' };
    }

    const prompt = `Bạn là Chuyên Gia Agile Coach Cấp Cao & Trưởng Ban Cải Tiến Tinh Gọn Kaizen (Senior Enterprise Agile Coach & Lean Kaizen Master).
Hãy lập một Báo Cáo Tổng Kết Sprint & Kế Hoạch Cải Tiến Liên Tục (Sprint Retrospective & Kaizen Action Plan) cho đội ngũ sau:

BỐI CẢNH SPRINT / CÁC SỰ CỐ & THÀNH QUẢ VỪA QUA:
"""
${sprintContext}
"""
LOẠI HÌNH ĐỘI NGŨ: ${teamType}
KHUNG PHÂN TÍCH: ${retrospectiveFramework}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🎯 BẢNG ĐÁNH GIÁ HIỆU SUẤT THEO KHUNG 4Ls (LIKED - LEARNED - LACKED - LONGED FOR):
   - Những điểm làm tốt cần nhân rộng (Liked)
   - Những bài học xương máu rút ra (Learned)
   - Những thiếu sót/điểm nghẽn làm chậm tiến độ (Lacked)
   - Những kỳ vọng và công cụ mong muốn bổ sung (Longed for)
2. 🔍 PHÂN TÍCH NGUYÊN NHÂN GỐC RỄ 5 WHYS CHO VẤN ĐỀ NGHIÊM TRỌNG NHẤT:
   - Why 1 -> Why 2 -> Why 3 -> Why 4 -> Nguyên nhân gốc rễ cốt tử (Root Cause)
3. ⚡ 3 HÀNH ĐỘNG CẢI TIẾN TINH GỌN KAIZEN (ACTION ITEMS GÁN TRÁCH NHIỆM RÕ RÀNG):
   - Hành động 1: Mục tiêu SMART, Người phụ trách (Owner), Hạn chót (Deadline)
   - Hành động 2: ...
   - Hành động 3: ...
4. 📈 ĐÒN BẨY TĂNG TỐC VẬN TỐC LÀM VIỆC CỦA ĐỘI NGŨ (TEAM VELOCITY MULTIPLIER)

Trình bày theo phong cách Agile Coach hàng đầu thế giới, mang tính xây dựng, gắn kết đội ngũ và chuyển hóa ngay thành kết quả thực chiến trong Sprint kế tiếp.`;

    try {
      const { text: retroText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        sprintContext,
        teamType,
        report: retroText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const agileKaizen = new AgileKaizenEngine();
