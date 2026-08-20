import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Tái Tác Bản Quyền Nội Dung Đa Kênh (Multi-Channel Content Repurposing Engine)
 */
export class ContentRepurposingEngine {
  /**
   * Chuyển đổi một nội dung gốc thành 5 định dạng truyền thông đa kênh chuyên nghiệp
   */
  async repurposeContent(originalContent, primaryGoal = 'Thu hút khách hàng & Xây dựng thương hiệu') {
    if (!originalContent || typeof originalContent !== 'string') {
      return { success: false, error: 'Nội dung gốc không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Sáng Tạo Nội Dung & Tăng Trưởng Đa Kênh (Head of Content & Social Media Growth).
Hãy chuyển đổi nội dung gốc sau thành 5 định dạng truyền thông đa nền tảng tối ưu hóa thuật toán tương tác cao nhất.

MỤC TIÊU CHIẾN DỊCH: ${primaryGoal}
NỘI DUNG GỐC:
"""
${originalContent}
"""

CẤU TRÚC 5 ĐỊNH DẠNG YÊU CẦU:
1. 📘 BÀI VIẾT FACEBOOK / LINKEDIN (Hook giật tít thu hút, 3-4 luận điểm bullet points, CTA bình luận & chia sẻ)
2. 🎬 KỊCH BẢN VIDEO NGẮN 60S (TIKTOK / REELS / SHORTS):
   - [0-3s]: Visual Hook & Tiêu đề bùng nổ
   - [3-45s]: Nội dung cô đọng kèm chỉ dẫn góc máy/hình ảnh minh họa
   - [45-60s]: Kêu gọi hành động dứt khoát
3. 🧵 CHUỖI BÀI THREADS / X (5 bài tweet ngắn sắc bén liên kết mạch lạc)
4. ✉️ BẢN TIN EMAIL NEWSLETTER (Tiêu đề mở thư cao, lời mở đầu cá nhân hóa và nội dung tóm tắt)
5. 💬 BẢN TIN ZALO BROADCAST / OA (Ngắn gọn, súc tích, link xem chi tiết)

Trình bày theo phong cách chuyên nghiệp, sáng tạo, đúng chuẩn ngôn ngữ của từng nền tảng mạng xã hội.`;

    try {
      const { text: repurposedText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        primaryGoal,
        content: repurposedText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const contentRepurposing = new ContentRepurposingEngine();
