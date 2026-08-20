import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Soạn Thảo & Chuẩn Hóa Email Doanh Nghiệp Cấp Cao (Executive Email Composer)
 */
export class EmailComposerEngine {
  /**
   * Soạn thảo email doanh nghiệp sắc bén, chuẩn mực theo ngữ cảnh
   */
  async composeEmail(goal, recipientRole = 'Đối tác / Khách hàng', tone = 'trang trọng và ngoại giao', keyPoints = []) {
    if (!goal || typeof goal !== 'string') {
      return { success: false, error: 'Mục tiêu email không hợp lệ.' };
    }

    const prompt = `Bạn là Trợ Lý Điều Hành & Chuyên Gia Truyền Thông Doanh Nghiệp Cấp Cao.
Hãy soạn thảo một bức email doanh nghiệp hoàn chỉnh, sắc bén, thuyết phục và chuẩn mực nhất.

MỤC TIÊU EMAIL: ${goal}
ĐỐI TƯỢNG NHẬN: ${recipientRole}
VĂN PHONG YÊU CẦU: ${tone}
CÁC ĐIỂM CỐT LÕI CẦN ĐỀ CẬP: ${keyPoints.length > 0 ? keyPoints.join(', ') : 'Tự tối ưu theo ngữ cảnh'}

CẤU TRÚC EMAIL YÊU CẦU:
1. 📌 TIÊU ĐỀ EMAIL (SUBJECT LINE): Rõ ràng, chuyên nghiệp, tỷ lệ mở cao
2. ✍️ NỘI DUNG EMAIL (BODY):
   - Lời chào trang trọng
   - Đi thẳng vào trọng tâm công việc
   - Trình bày mạch lạc các luận điểm / đề xuất / yêu cầu
   - Lời kêu gọi hành động (Call To Action - CTA) rõ ràng kèm thời hạn (nếu có)
   - Lời kết và chữ ký chuyên nghiệp

Trình bày trực diện, khúc chiết, chuẩn mực ngữ pháp kinh doanh.`;

    try {
      const { text: emailContent } = await generateContentWithFailover(prompt);
      return {
        success: true,
        goal,
        recipientRole,
        tone,
        email: emailContent.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const emailComposer = new EmailComposerEngine();
