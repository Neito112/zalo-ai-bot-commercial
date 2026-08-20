import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Đánh Giá Ứng Viên Tuyển Dụng & Lập Phiếu Phỏng Vấn (HR Candidate & Interview Assessment Engine)
 */
export class HrInterviewEngine {
  /**
   * Đánh giá hồ sơ và câu trả lời phỏng vấn của ứng viên, lập Scorecard tuyển dụng
   */
  async evaluateCandidate(candidateInfo, jobPosition = 'Vị trí chuyên môn', interviewNotes = '') {
    if (!candidateInfo || typeof candidateInfo !== 'string') {
      return { success: false, error: 'Thông tin ứng viên không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Nhân Sự (Chief Human Resources Officer - CHRO) & Chuyên Gia Tuyển Dụng Cao Cấp.
Hãy lập một Phiếu Đánh Giá Ứng Viên & Scorecard Phỏng Vấn (Talent Assessment Scorecard) chuẩn mực cho ứng viên sau:

VỊ TRÍ ỨNG TUYỂN: ${jobPosition}
HỒ SƠ / KINH NGHIỆM ỨNG VIÊN:
"""
${candidateInfo}
"""
GHI CHÉP BUỔI PHỎNG VẤN (NẾU CÓ):
"""
${interviewNotes || 'Dựa trên hồ sơ năng lực'}
"""

CẤU TRÚC PHIẾU ĐÁNH GIÁ YÊU CẦU:
1. 👤 TỔNG QUAN HỒ SƠ & TRẢI NGHIỆM LIÊN QUAN
2. 🎯 ĐÁNH GIÁ NĂNG LỰC CỐT LÕI (THANG ĐIỂM 1 - 10):
   - Năng lực chuyên môn & Kỹ thuật (Hard Skills): [Điểm]/10
   - Kỹ năng mềm, Giải quyết vấn đề & Giao tiếp (Soft Skills): [Điểm]/10
   - Khả năng thích ứng & Độ phù hợp văn hóa doanh nghiệp (Culture Fit): [Điểm]/10
3. ⚖️ PHÂN TÍCH ĐIỂM MẠNH NỔI BẬT & ĐIỂM CẦN LƯU Ý / RỦI RO
4. 💡 GỢI Ý 3 CÂU HỎI ĐÀO SÂU CHO VÒNG PHỎNG VẤN TIẾP THEO
5. 🏆 ĐỀ XUẤT TUYỂN DỤNG CỦA HỘI ĐỒNG: [TUYỂN THẲNG / CẦN THỬ THÁCH THÊM / TỪ CHỐI] kèm lý giải thuyết phục

Trình bày theo phong cách khách quan, công tâm, chuyên nghiệp và có tính ứng dụng cao cho ban giám đốc.`;

    try {
      const { text: assessmentText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        jobPosition,
        scorecard: assessmentText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const hrInterviewEngine = new HrInterviewEngine();
