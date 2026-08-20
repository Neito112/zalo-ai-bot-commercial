import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Thẩm Định Mô Hình Kinh Doanh & Unit Economics (Business Model Canvas & Unit Economics Engine)
 */
export class BusinessModelCanvasEngine {
  /**
   * Lập khung mô hình kinh doanh BMC 9 khối và thẩm định hiệu quả kinh tế trên từng đơn vị sản phẩm
   */
  async validateBusinessModel(businessIdea, targetMarket = 'Việt Nam', pricingModel = 'Thu phí định kỳ (Subscription) / Bán lẻ') {
    if (!businessIdea || typeof businessIdea !== 'string') {
      return { success: false, error: 'Ý tưởng kinh doanh không hợp lệ.' };
    }

    const prompt = `Bạn là Chuyên Gia Cố Vấn Khởi Nghiệp & Giám Đốc Đầu Tư Mạo Hiểm (Venture Capital Partner & Startup Advisor).
Hãy thẩm định và lập một Báo Cáo Khung Mô Hình Kinh Doanh (Business Model Canvas - BMC) & Đánh Giá Hiệu Quả Kinh Tế Đơn Vị (Unit Economics) cho ý tưởng sau:

Ý TƯỞNG KINH DOANH: "${businessIdea}"
THỊ TRƯỜNG MỤC TIÊU: ${targetMarket}
MÔ HÌNH THU PHÍ DỰ KIẾN: ${pricingModel}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🏢 KHUNG MÔ HÌNH KINH DOANH 9 KHỐI (BUSINESS MODEL CANVAS - BMC):
   - Phân khúc khách hàng (Customer Segments)
   - Tuyên ngôn giá trị độc nhất (Unique Value Proposition)
   - Kênh phân phối & tiếp cận (Channels)
   - Quan hệ khách hàng (Customer Relationships)
   - Dòng doanh thu chính (Revenue Streams)
   - Nguồn lực cốt lõi (Key Resources)
   - Hoạt động trọng yếu (Key Activities)
   - Đối tác chiến lược (Key Partnerships)
   - Cơ cấu chi phí (Cost Structure)
2. 💰 THẨM ĐỊNH HIỆU QUẢ KINH TẾ ĐƠN VỊ (UNIT ECONOMICS HEALTH CHECK):
   - Dự phóng LTV (Giá trị vòng đời khách hàng) & CAC (Chi phí sở hữu khách hàng)
   - Tỷ lệ LTV/CAC tối ưu & Thời gian thu hồi vốn (Payback Period)
   - Biên lợi nhuận đóng góp (Contribution Margin)
3. ⚠️ 3 RỦI RO CHẾT NGƯỜI & ĐIỂM YẾU TRONG MÔ HÌNH (DEAL-BREAKERS)
4. 💡 ĐỀ XUẤT CHIẾN LƯỢC TỐI ƯU HÓA ĐÒN BẨY KINH DOANH

Trình bày sắc bén, chuẩn ngôn ngữ tài chính và đầu tư mạo hiểm, giúp nhà sáng lập và lãnh đạo tự tin đưa ra quyết định giải ngân.`;

    try {
      const { text: bmcText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        businessIdea,
        targetMarket,
        analysis: bmcText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const businessModelCanvas = new BusinessModelCanvasEngine();
