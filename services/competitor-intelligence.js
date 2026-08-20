import { generateContentWithFailover } from '../ai-agent.js';
import { searchWeb } from './web-research.js';

/**
 * Động cơ Phân Tích Đối Thủ Cạnh Tranh & Tình Báo Thị Trường (Competitor & Market Intelligence)
 */
export class CompetitorIntelligenceEngine {
  /**
   * Phân tích đối thủ cạnh tranh và lập ma trận định vị thị trường
   */
  async analyzeCompetitor(competitorName, industry = 'Công nghệ / Dịch vụ', focusArea = 'Sản phẩm & Giá cả') {
    if (!competitorName || typeof competitorName !== 'string') {
      return { success: false, error: 'Tên đối thủ cạnh tranh không hợp lệ.' };
    }

    // 1. Thu thập dữ liệu thực tế mới nhất trên Internet về đối thủ
    let liveWebData = '';
    try {
      liveWebData = await searchWeb(`${competitorName} ${industry} sản phẩm giá tin tức mới nhất`, 3);
    } catch (e) {}

    const prompt = `Bạn là Giám Đốc Chiến Lược & Chuyên Gia Tình Báo Thị Trường (Head of Market Intelligence).
Hãy lập một Báo Cáo Tình Báo Đối Thủ Cạnh Tranh sắc bén, toàn diện và thực chiến nhất về đối thủ: "${competitorName}".

LĨNH VỰC HOẠT ĐỘNG: ${industry}
TRỌNG TÂM PHÂN TÍCH: ${focusArea}
DỮ LIỆU THU THẬP THỜI GIAN THỰC TỪ INTERNET:
"""
${liveWebData || 'Dựa trên tri thức thị trường sẵn có'}
"""

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🏢 HỒ SƠ ĐỐI THỦ & MÔ HÌNH KINH DOANH (Sản phẩm chủ lực, phân khúc khách hàng, định giá)
2. ⚔️ MA TRẬN SWOT ĐỐI THỦ (Điểm mạnh cốt lõi, Điểm yếu/Lỗ hổng dịch vụ, Cơ hội chiếm thị phần, Mối đe dọa)
3. 🎯 PHÂN TÍCH LỢI THẾ CẠNH TRANH (USPs & Feature Gap Analysis)
4. 💡 ĐỀ XUẤT ĐÒN ĐÁNH CHIẾN LƯỢC CHO BAN LÃNH ĐẠO (3-4 chiến thuật khác biệt hóa và giành khách hàng)

Trình bày sắc bén, trực diện, không nói chung chung, mang tính ứng dụng thực chiến cao.`;

    try {
      const { text: reportText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        competitorName,
        industry,
        report: reportText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const competitorIntelligence = new CompetitorIntelligenceEngine();
