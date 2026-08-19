/**
 * Persona & Emotional Intelligence Engine
 * Thổi hồn, nhận diện cảm xúc người dùng và điều chỉnh sắc thái giao tiếp
 */

export class PersonaEngine {
  constructor() {
    this.tones = {
      EMPATHETIC: 'Đồng cảm, ân cần, chia sẻ và xoa dịu',
      PROFESSIONAL: 'Chuyên nghiệp, sắc bén, ngắn gọn, tập trung vào hiệu suất',
      ENTHUSIASTIC: 'Hào hứng, nhiệt huyết, truyền cảm hứng và năng lượng tích cực',
      THOUGHTFUL: 'Sâu sắc, chu đáo, đưa ra góc nhìn đa chiều và gợi mở giải pháp'
    };
  }

  /**
   * Phân tích cảm xúc & ý định từ tin nhắn của người dùng
   */
  detectUserEmotion(text) {
    const lower = text.toLowerCase();

    // Dấu hiệu áp lực, căng thẳng, gấp gáp
    if (/gấp|ngay|khẩn|mệt|stress|chán|bực|áp lực|cháy|hỏng|toang|cứu/.test(lower)) {
      return {
        emotion: 'STRESSED_OR_URGENT',
        recommendedTone: this.tones.EMPATHETIC,
        guidance: 'Người dùng đang chịu áp lực hoặc cần xử lý gấp. Hãy trả lời cực kỳ nhanh gọn, rõ ràng, đưa ra giải pháp giải quyết ngay, thể hiện sự đồng hành vững chãi.'
      };
    }

    // Dấu hiệu vui vẻ, sáng tạo, khám phá
    if (/vui|tuyệt|hay quá|sáng tạo|vẽ|thơ|hài|thú vị|kể chuyện|ý tưởng/.test(lower)) {
      return {
        emotion: 'CREATIVE_OR_HAPPY',
        recommendedTone: this.tones.ENTHUSIASTIC,
        guidance: 'Người dùng đang trong tâm trạng thoải mái, tìm kiếm cảm hứng sáng tạo. Hãy giao tiếp cởi mở, sinh động, ngôn từ giàu hình ảnh và năng lượng tích cực.'
      };
    }

    // Dấu hiệu công việc, học tập, cần phân tích
    if (/báo cáo|tài liệu|email|lịch|kế hoạch|phân tích|nghiên cứu|thị trường|tại sao|như thế nào/.test(lower)) {
      return {
        emotion: 'ANALYTICAL_OR_WORK',
        recommendedTone: this.tones.THOUGHTFUL,
        guidance: 'Người dùng đang tập trung giải quyết công việc. Hãy đưa ra câu trả lời có cấu trúc rõ ràng, tư duy phản biện sắc bén, các đầu việc hành động cụ thể.'
      };
    }

    // Mặc định
    return {
      emotion: 'CASUAL_CONVERSATION',
      recommendedTone: this.tones.THOUGHTFUL,
      guidance: 'Trò chuyện tự nhiên, tinh tế, lịch thiệp, xưng hô gần gũi như một người trợ lý/đồng nghiệp đắc lực.'
    };
  }

  /**
   * Tạo chỉ dẫn cảm xúc động ghép vào Prompt của AI
   */
  getDynamicPersonaDirective(userPrompt, senderName) {
    const analysis = this.detectUserEmotion(userPrompt);

    return `
[CHỈ DẪN SẮC THÁI CẢM XÚC (EMOTION & PERSONA DIRECTIVE)]:
- Trạng thái người đối thoại (${senderName}): ${analysis.emotion}
- Tone giọng khuyến nghị: ${analysis.recommendedTone}
- Hướng dẫn tương tác: ${analysis.guidance}
- Quy tắc vàng: Tránh tuyệt đối giọng điệu máy móc vô cảm. Luôn trả lời có hồn, biết lắng nghe, biết thấu hiểu và tôn trọng thời gian của người dùng.
`;
  }
}

export const personaEngine = new PersonaEngine();
