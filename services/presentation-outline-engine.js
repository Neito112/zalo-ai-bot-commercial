import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Lập Dàn Ý Slide & Lời Thoại Thuyết Trình Cấp Cao (Executive Presentation & Pitch Deck Engine)
 */
export class PresentationOutlineEngine {
  /**
   * Tạo dàn ý slide thuyết trình chuyên nghiệp kèm gợi ý trực quan và lời thoại diễn thuyết
   */
  async generatePresentation(topic, targetAudience = 'Ban Giám Đốc / Nhà Đầu Tư', slideCount = 6) {
    if (!topic || typeof topic !== 'string') {
      return { success: false, error: 'Chủ đề thuyết trình không hợp lệ.' };
    }

    const prompt = `Bạn là Chuyên Gia Cố Vấn Truyền Thông & Thiết Kế Thuyết Trình Cấp Cao (Executive Pitch Deck Consultant).
Hãy lập một Dàn Ý Bài Thuyết Trình Chuẩn Quốc Tế (Slide-by-Slide Presentation Deck) cho chủ đề sau:

CHỦ ĐỀ THUYẾT TRÌNH: "${topic}"
ĐỐI TƯỢNG NGƯỜI NGHE: ${targetAudience}
SỐ LƯỢNG SLIDE YÊU CẦU: ${slideCount} slides

CẤU TRÚC TỪNG SLIDE YÊU CẦU:
Với mỗi slide từ 1 đến ${slideCount}, hãy trình bày rõ:
- 📌 **Slide [Số]: [Tiêu đề Slide ngắn gọn, thu hút]**
- 🎨 **Gợi ý trực quan / Hình ảnh / Biểu đồ (Visual Cue):** (Ví dụ: Biểu đồ cột tăng trưởng, ảnh mockup sản phẩm...)
- 📝 **3 Luận điểm cốt lõi trên Slide (Bullet Points):** Ngắn gọn, số liệu ấn tượng
- 🎙️ **Lời thoại thuyết trình của diễn giả (Speaker Script):** 2-3 câu diễn giải tự nhiên, cuốn hút và thuyết phục

Trình bày theo phong cách chuyên nghiệp, gãy gọn, logic mạch lạc và tạo ấn tượng mạnh mẽ cho người nghe.`;

    try {
      const { text: deckText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        topic,
        targetAudience,
        slideCount,
        deck: deckText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const presentationOutline = new PresentationOutlineEngine();
