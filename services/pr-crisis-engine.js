import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Xử Lý Khủng Hoảng Truyền Thông & Phát Ngôn Báo Chí (Crisis PR & Media Engine)
 */
export class PrCrisisEngine {
  /**
   * Thiết lập kịch bản ứng phó khủng hoảng truyền thông và thông cáo phát ngôn khẩn cấp
   */
  async handlePrCrisis(crisisDetails, companyName = 'Doanh nghiệp', severity = 'Cấp 1 - Lan truyền mạnh trên mạng xã hội') {
    if (!crisisDetails || typeof crisisDetails !== 'string') {
      return { success: false, error: 'Chi tiết sự cố khủng hoảng không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Truyền Thông & Chuyên Gia Xử Lý Khủng Hoảng Báo Chí (Chief Communications Officer & Crisis PR Specialist).
Hãy lập một Kế Hoạch Ứng Phó Khủng Hoảng Truyền Thông Khẩn Cấp (Crisis PR & Media Response Plan) cho sự cố sau:

TÊN DOANH NGHIỆP: ${companyName}
MỨC ĐỘ NGHIÊM TRỌNG: ${severity}
CHI TIẾT SỰ CỐ / LÀN SÓNG DƯ LUẬN:
"""
${crisisDetails}
"""

CẤU TRÚC KỊCH BẢN YÊU CẦU:
1. ⏱️ THÔNG CÁO PHÁT NGÔN TẠM THỜI TRONG 60 PHÚT (HOLDING STATEMENT):
   - Ngắn gọn, thừa nhận sự việc, thể hiện tinh thần trách nhiệm và cam kết điều tra minh bạch
2. 📰 BỘ CÂU HỎI & TRẢ LỜI CHO BÁO CHÍ (PRESS Q&A - 3 KỊCH BẢN CHẤT VẤN HÓC BÚA):
   - Câu hỏi 1 -> Câu trả lời chuẩn mực không né tránh
   - Câu hỏi 2 -> ...
   - Câu hỏi 3 -> ...
3. ✉️ THƯ CHÍNH THỨC GỬI KHÁCH HÀNG & ĐỐI TÁC (FORMAL CUSTOMER LETTER & REMEDIATION):
   - Biện pháp khắc phục cụ thể và chính sách bồi thường thiệt hại
4. 🔒 HƯỚNG DẪN PHÁT NGÔN NỘI BỘ DÀNH CHO TOÀN BỘ NHÂN VIÊN (INTERNAL GAG ORDER / SOCIAL MEDIA POLICY):
   - Quy định bảo mật thông tin, không tự ý tranh cãi trên mạng xã hội

Trình bày sắc bén, chuẩn văn phong quan hệ công chúng (PR) cao cấp, dập tắt khủng hoảng và khôi phục niềm tin thương hiệu.`;

    try {
      const { text: crisisText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        companyName,
        severity,
        report: crisisText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const prCrisisEngine = new PrCrisisEngine();
