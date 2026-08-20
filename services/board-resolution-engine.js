import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Soạn Thảo Nghị Quyết Hội Đồng Quản Trị & Quản Trị Công Ty (Board Resolution & Governance Engine)
 */
export class BoardResolutionEngine {
  /**
   * Soạn thảo Nghị quyết Hội Đồng Quản Trị (HĐQT) / ĐHĐCĐ chuẩn pháp lý và điều lệ doanh nghiệp
   */
  async draftResolution(resolutionMatter, companyName = 'Công Ty Cổ Phần', meetingType = 'Hội Đồng Quản Trị (HĐQT) / ĐHĐCĐ') {
    if (!resolutionMatter || typeof resolutionMatter !== 'string') {
      return { success: false, error: 'Nội dung biểu quyết không hợp lệ.' };
    }

    const prompt = `Bạn là Thư Ký Hội Đồng Quản Trị & Luật Sư Cố Vấn Quản Trị Công Ty (Corporate Secretary & Senior Legal Governance Counsel).
Hãy soạn thảo một Bản Nghị Quyết Chính Thức (Formal Board of Directors Resolution) chuẩn mực theo Luật Doanh Nghiệp và Điều lệ cho sự việc sau:

TÊN DOANH NGHIỆP: ${companyName}
CƠ QUAN BAN HÀNH: ${meetingType}
NỘI DUNG BIỂU QUYẾT & THÔNG QUA:
"""
${resolutionMatter}
"""

CẤU TRÚC VĂN BẢN NGHỊ QUYẾT YÊU CẦU:
1. 🏛️ QUỐC HIỆU, TIÊU NGỮ & TIÊU ĐỀ NGHỊ QUYẾT (Số hiệu, Ngày tháng ban hành, Căn cứ pháp lý Luật Doanh nghiệp & Điều lệ công ty)
2. 📋 CÁC ĐIỀU KHOẢN NGHỊ QUYẾT THÔNG QUA (RESOLVED CLAUSES):
   - Điều 1: Thông qua nội dung phê duyệt cụ thể (Hạn mức, giá trị, quyền hạn)
   - Điều 2: Phân công trách nhiệm tổ chức thi hành (Giao Tổng Giám Đốc/Người đại diện pháp luật)
   - Điều 3: Quyền giám sát của Ban Kiểm Soát / Cổ đông
   - Điều 4: Hiệu lực thi hành và nơi nhận văn bản
3. 🗳️ BIÊN BẢN KIỂM PHIẾU BIỂU QUYẾT (Tỷ lệ tán thành 100% hoặc theo luật định)
4. ✍️ KHUNG CHỮ KÝ CỦA CHỦ TỊCH HỘI ĐỒNG QUẢN TRỊ & THƯ KÝ

Trình bày theo văn phong pháp lý hành chính nhà nước trang trọng, chuẩn mực, có thể in ấn và đóng dấu ban hành chính thức ngay lập tức.`;

    try {
      const { text: resolutionText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        companyName,
        resolutionMatter,
        document: resolutionText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const boardResolution = new BoardResolutionEngine();
