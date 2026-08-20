import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Xây Dựng Bản Chào Đầu Tư & Bản Ghi Nhớ Đầu Tư (Investment Memo & Deal Teaser Engine)
 */
export class InvestmentMemoEngine {
  /**
   * Soạn thảo bản chào đầu tư tóm tắt (1-Page Blind Teaser) và Bản ghi nhớ chào bán cổ phần chi tiết (Confidential Information Memorandum - CIM)
   */
  async generateInvestmentMemo(companyData, fundingGoal = 'Huy động 2,000,000 USD Series A / Thoái vốn M&A', investorTarget = 'Quỹ đầu tư mạo hiểm mảng Công nghệ & Đối tác chiến lược') {
    if (!companyData || typeof companyData !== 'string') {
      return { success: false, error: 'Thông tin công ty và thương vụ không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Ngân Hàng Đầu Tư & Chuyên Gia Cố Vấn Gọi Vốn M&A (Managing Director of Investment Banking & M&A Dealmaker).
Hãy lập một Bản Ghi Nhớ Đầu Tư & Bản Chào Thương Vụ Hoàn Chỉnh (Confidential Investment Memorandum - CIM & Deal Teaser) cho doanh nghiệp sau:

THÔNG TIN DOANH NGHIỆP & TÀI CHÍNH:
"""
${companyData}
"""
MỤC TIÊU HUY ĐỘNG VỐN / THƯƠNG VỤ: ${fundingGoal}
ĐỐI TƯỢNG NHÀ ĐẦU TƯ MỤC TIÊU: ${investorTarget}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 📄 BẢN CHÀO ĐẦU TƯ ẨN DANH 1 TRANG (1-PAGE BLIND TEASER):
   - Tổng quan ngành, điểm nổi bật tài chính (Doanh thu ARR, Biên lợi nhuận EBITDA)
   - Luận điểm đầu tư cốt lõi (Investment Highlights & Lợi thế hào kinh tế Moat) mà không tiết lộ tên công ty
2. 📑 BẢN GHI NHỚ ĐẦU TƯ BẢO MẬT CHI TIẾT (CONFIDENTIAL INFORMATION MEMORANDUM - CIM):
   - Hồ sơ năng lực ban sáng lập & Ban điều hành C-level
   - Phân tích thị trường TAM / SAM / SOM và động lực tăng trưởng ngành
   - Sức khỏe tài chính 3 năm lịch sử và dự phóng 3 năm tới (Historical & Projected Financials)
3. 🎯 KẾ HOẠCH PHÂN BỔ SỬ DỤNG VỐN ĐẦU TƯ (USE OF FUNDS BREAKDOWN):
   - Mở rộng thị trường, phát triển R&D sản phẩm và thu hút nhân tài
4. 💼 ĐỀ XUẤT CẤU TRÚC GIAO DỊCH & QUY TRÌNH TIẾP CẬN DỮ LIỆU THẨM ĐỊNH (VDR GATING)

Trình bày theo phong cách chuyên nghiệp, đẳng cấp của các hãng cố vấn tài chính quốc tế Goldman Sachs / Morgan Stanley, tối đa hóa sức hút đối với các quỹ đầu tư lớn.`;

    try {
      const { text: memoText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        companyData,
        fundingGoal,
        report: memoText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const investmentMemo = new InvestmentMemoEngine();
