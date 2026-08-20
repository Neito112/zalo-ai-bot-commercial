import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Danh Mục Sản Phẩm & Phân Bổ R&D Đổi Mới Sáng Tạo (Product Portfolio Management & R&D Allocation Engine)
 */
export class ProductPortfolioEngine {
  /**
   * Đánh giá danh mục sản phẩm theo Ma trận BCG / McKinsey 9-Box, tối ưu hóa phân bổ nguồn lực R&D (70-20-10 Rule) và hoạch định lộ trình khai tử sản phẩm (End-of-Life EOL)
   */
  async optimizeProductPortfolio(portfolioContext, allocationStrategy = 'Quy tắc 70/20/10 (70% Core, 20% Adjacent, 10% Transformational Innovation)', horizonYears = 'Kế hoạch 3 năm (2026 - 2029)') {
    if (!portfolioContext || typeof portfolioContext !== 'string') {
      return { success: false, error: 'Thông tin danh mục sản phẩm không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Sản Phẩm & Chiến Lược Đổi Mới Sáng Tạo Cấp Cao (Chief Product Officer & Head of Strategic Innovation).
Hãy lập một Đề Án Quản Trị Danh Mục Sản Phẩm & Phân Bổ Nguồn Lực R&D Đột Phá (Product Portfolio Management & R&D Resource Allocation Framework) cho doanh nghiệp sau:

THÔNG TIN DANH MỤC SẢN PHẨM HIỆN HỮU & DỰ ÁN R&D:
"""
${portfolioContext}
"""
CHIẾN LƯỢC PHÂN BỔ NGUỒN LỰC: ${allocationStrategy}
TẦM NHÌN LỘ TRÌNH: ${horizonYears}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 📊 PHÂN LOẠI DANH MỤC SẢN PHẨM THEO MA TRẬN BCG & MCKINSEY 9-BOX:
   - Ngôi sao (Stars - Tăng trưởng cao, thị phần lớn): Đầu tư bảo vệ vị thế dẫn đầu
   - Bò sữa (Cash Cows - Tăng trưởng thấp, thị phần lớn): Tối ưu hóa lợi nhuận để tài trợ R&D
   - Dấu hỏi (Question Marks - Tăng trưởng cao, thị phần nhỏ): Cần quyết định rót vốn hay rút lui
   - Chó mực (Dogs - Tăng trưởng thấp, thị phần nhỏ): Hoạch định lộ trình khai tử (End-of-Life - EOL)
2. 💡 PHÂN BỔ NGUỒN VỐN & NHÂN LỰC ĐỔI MỚI SÁNG TẠO (INNOVATION AMBIDEXTERITY 70/20/10):
   - 70% Core Products: Cải tiến sản phẩm chủ lực hiện tại (Incremental Innovation)
   - 20% Adjacent Expansion: Mở rộng thị trường và tính năng liền kề (Expansion Innovation)
   - 10% Transformational Moonshots: Nghiên cứu công nghệ tương lai đột phá (Breakthrough R&D)
3. 🚪 QUY TRÌNH SÀNG LỌC Ý TƯỞNG & ĐÁNH GIÁ CỔNG GIAI ĐOẠN (STAGE-GATE R&D PROCESS):
   - 5 Cổng Stage-Gate: Ý tưởng (Ideation) -> Khả thi (Scoping) -> Bản mẫu (Business Case) -> Phát triển (Development) -> Ra mắt (Launch)
   - Tiêu chí dừng dự án kịp thời (Kill-switch Criteria) để tránh lãng phí chi phí chìm (Sunk Cost Fallacy)
4. 📈 BẢNG CHỈ SỐ ĐO LƯỜNG HIỆU QUẢ R&D VÀ DOANH THU SẢN PHẨM MỚI (R&D ROI & VITALITY INDEX)

Trình bày theo phong cách chuyên gia quản trị sản phẩm hàng đầu (Silicon Valley Product Group / Bain & Company), chuẩn xác về chiến lược, tối ưu hóa biên lợi nhuận và kiến tạo lợi thế cạnh tranh dài hạn.`;

    try {
      const { text: pfText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        portfolioContext,
        allocationStrategy,
        report: pfText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const productPortfolio = new ProductPortfolioEngine();
