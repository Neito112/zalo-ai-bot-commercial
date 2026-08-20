import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Rà Soát Hợp Đồng Thương Mại & Cảnh Báo Rủi Ro Pháp Lý (Contract & SLA Review Engine)
 */
export class ContractReviewEngine {
  /**
   * Phân tích, rà soát hợp đồng và đưa ra kiến nghị chỉnh sửa
   */
  async reviewContract(contractText, contractType = 'Hợp Đồng Kinh Tế / Dịch Vụ') {
    if (!contractText || typeof contractText !== 'string') {
      return { success: false, error: 'Nội dung hợp đồng không hợp lệ.' };
    }

    const prompt = `Bạn là Chuyên Gia Pháp Lý & Cố Vấn Hợp Đồng Doanh Nghiệp Cấp Cao (Senior Legal Counsel).
Hãy rà soát kỹ lưỡng văn bản hợp đồng sau đây và cung cấp một bản Báo Cáo Rà Soát Pháp Lý (Legal Review Report) sắc bén, thực chiến và chuẩn mực.

LOẠI HỢP ĐỒNG: ${contractType}
NỘI DUNG HỢP ĐỒNG:
"""
${contractText}
"""

CẤU TRÚC BÁO CÁO RÀ SOÁT:
1. 📑 TỔNG QUAN HỢP ĐỒNG & CÁC BÊN THAM GIA
2. ⚠️ ĐIỂM RỦI RO PHÁP LÝ & BẪY HỢP ĐỒNG (Cảnh báo mức độ: Cao/Trung bình/Thấp đối với các điều khoản Phạt vi phạm, Bồi thường, Chấm dứt, Bảo mật, Quyền sở hữu trí tuệ, Thanh toán)
3. 🛡️ KIẾN NGHỊ ĐIỀU CHỈNH CÂU TỪ (REDLINE / SUGGESTED CHANGES):
   - [Điều khoản hiện tại] -> [Nguy cơ] -> [Câu chữ đề xuất sửa lại]
4. ✅ KẾT LUẬN & KHUYẾN NGHỊ ĐÀM PHÁN

Trình bày trực diện, khúc chiết, bảo vệ tối đa quyền lợi và an toàn pháp lý cho người dùng.`;

    try {
      const { text: reviewText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        contractType,
        report: reviewText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const contractReviewEngine = new ContractReviewEngine();
