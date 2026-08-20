import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Tổng Hợp Biên Bản Cuộc Họp & Bóc Tách Kế Hoạch Hành Động (Meeting Minutes & Action Items)
 */
export class MeetingIntelligenceEngine {
  /**
   * Phân tích biên bản cuộc họp và trích xuất Action Items
   */
  async formatMeetingMinutes(rawNotes, meetingTitle = 'Cuộc Họp Chiến Lược') {
    if (!rawNotes || typeof rawNotes !== 'string') {
      return { success: false, error: 'Nội dung ghi chép cuộc họp không hợp lệ.' };
    }

    const prompt = `Bạn là Trợ Lý Điều Hành Cấp Cao (Executive Assistant).
Hãy tổng hợp đoạn ghi chép cuộc họp sau thành một Biên Bản Cuộc Họp (Meeting Minutes) chuyên nghiệp, chuẩn mực và sắc bén nhất.

TIÊU ĐỀ CUỘC HỌP: ${meetingTitle}
NỘI DUNG GHI CHÉP GỐC:
"""
${rawNotes}
"""

CẤU TRÚC BIÊN BẢN YÊU CẦU:
1. 🎯 MỤC TIÊU & BỐI CẢNH CHÍNH
2. 📌 CÁC QUYẾT ĐỊNH QUAN TRỌNG ĐÃ THỐNG NHẤT
3. 📋 BẢNG PHÂN CÔNG HÀNH ĐỘNG (ACTION ITEMS):
   - [Người phụ trách] -> [Đầu việc cụ thể] -> [Deadline / Kỳ vọng]
4. ⚠️ RỦI RO & LƯU Ý KỸ THUẬT/KINH DOANH

Hãy viết bằng văn phong súc tích, mạch lạc, trực diện, không có lời thừa.`;

    try {
      const { text: minutesText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        meetingTitle,
        minutes: minutesText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const meetingIntelligence = new MeetingIntelligenceEngine();
