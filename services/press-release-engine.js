import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Soạn Thảo Thông Cáo Báo Chí & Bài Viết Truyền Thông (Press Release & PR Engine)
 */
export class PressReleaseEngine {
  /**
   * Tạo thông cáo báo chí chuẩn mực báo chí quốc tế và truyền thông doanh nghiệp
   */
  async generatePressRelease(eventOrNews, companyName = 'Doanh nghiệp', keyQuoteSpeaker = 'Tổng Giám Đốc') {
    if (!eventOrNews || typeof eventOrNews !== 'string') {
      return { success: false, error: 'Nội dung sự kiện/tin tức không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Truyền Thông & Quan Hệ Báo Chí (Head of Corporate Communications / PR Director).
Hãy soạn thảo một bản Thông Cáo Báo Chí (Press Release) chuẩn mực theo phong cách báo chí chuyên nghiệp cho sự kiện sau:

DOANH NGHIỆP PHÁT HÀNH: ${companyName}
NGƯỜI PHÁT NGÔN / TRÍCH DẪN: ${keyQuoteSpeaker}
SỰ KIỆN / TIN TỨC TRỌNG TÂM:
"""
${eventOrNews}
"""

CẤU TRÚC THÔNG CÁO BÁO CHÍ YÊU CẦU:
1. 📢 TIÊU ĐỀ BÁO CHÍ (FOR IMMEDIATE RELEASE - HEADLINE): Giật tít chuyên nghiệp, mang tính thời sự cao
2. 📍 ĐỊA ĐIỂM & THỜI GIAN PHÁT HÀNH (DATELINE): [HÀ NỘI / TP.HCM, NGÀY/THÁNG/NĂM]
3. 📰 ĐOẠN DẪN CỐT LÕI (LEAD PARAGRAPH - 5W1H): Trả lời ngay Ai, Việc gì, Khi nào, Ở đâu, Tại sao, Như thế nào
4. 📝 NỘI DUNG CHI TIẾT & TÁC ĐỘNG THỊ TRƯỜNG: Số liệu minh chứng, giá trị mang lại cho khách hàng/xã hội
5. 💬 TRÍCH DẪN LỜI PHÁT NGÔN CỦA BAN LÃNH ĐẠO (EXECUTIVE QUOTE): Tầm nhìn chiến lược và cam kết tương lai
6. 🏢 GIỚI THIỆU VỀ CÔNG TY (ABOUT BOILERPLATE) & THÔNG TIN LIÊN HỆ BÁO CHÍ (MEDIA CONTACT)

Trình bày theo phong cách trung lập, trang trọng, chuẩn mực văn phong báo chí để các tòa soạn có thể đăng tải ngay.`;

    try {
      const { text: prText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        companyName,
        eventOrNews,
        pressRelease: prText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const pressReleaseEngine = new PressReleaseEngine();
