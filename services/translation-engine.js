import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Dịch thuật & Bản địa hóa Văn bản Doanh nghiệp Chuyên sâu
 */
export class TranslationEngine {
  /**
   * Dịch thuật đa ngôn ngữ với văn phong doanh nghiệp / kỹ thuật chuẩn xác
   */
  async translateText(text, targetLang = 'tiếng Việt', tone = 'chuyên nghiệp') {
    if (!text || typeof text !== 'string') {
      return { success: false, error: 'Nội dung cần dịch không hợp lệ.' };
    }

    const prompt = `Bạn là Chuyên Gia Dịch Thuật & Bản Địa Hóa Cao Cấp (Senior Localization Specialist).
Nhiệm vụ: Dịch chính xác, tự nhiên, thoát ý và chuẩn xác thuật ngữ chuyên ngành sang ngôn ngữ: "${targetLang}".
Văn phong yêu cầu: ${tone}.

VĂN BẢN GỐC:
"""
${text}
"""

HƯỚNG DẪN DỊCH:
1. Đảm bảo đúng thuật ngữ kinh doanh, kỹ thuật, pháp lý nếu có.
2. Giữ nguyên cấu trúc định dạng, danh sách gạch đầu dòng hoặc mã số.
3. Không thêm các lời giải thích thừa ngoài bài dịch.

BẢN DỊCH HOÀN CHỈNH:`;

    try {
      const { text: translatedText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        originalTextLength: text.length,
        targetLang,
        translatedText: translatedText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const translationEngine = new TranslationEngine();
