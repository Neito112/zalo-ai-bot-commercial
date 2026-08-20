import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Xây Dựng Bản Thuyết Trình Gọi Vốn Quỹ Mạo Hiểm (Venture Capital Pitch Deck & Investor Narrative Engine)
 */
export class PitchDeckEngine {
  /**
   * Soạn thảo cấu trúc bộ Slide thuyết trình gọi vốn 12 trang chuẩn Sequoia Capital / Y Combinator
   */
  async designPitchDeck(ventureData, fundingRound = 'Seed / Pre-Series A / Series A', targetAsk = '1.000.000 USD - 5.000.000 USD') {
    if (!ventureData || typeof ventureData !== 'string') {
      return { success: false, error: 'Thông tin dự án gọi vốn không hợp lệ.' };
    }

    const prompt = `Bạn là Đối Tác Quỹ Đầu Tư Mạo Hiểm Hàng Đầu & Chuyên Gia Huấn Luyện Thuyết Trình Gọi Vốn (Venture Capital General Partner & Pitch Coach).
Hãy lập một Bộ Kịch Bản Thuyết Trình Gọi Vốn 12 Slide Chuẩn Quốc Tế (Institutional 12-Slide VC Pitch Deck & Narrative) cho dự án sau:

THÔNG TIN DỰ ÁN & MÔ HÌNH KINH DOANH:
"""
${ventureData}
"""
VÒNG GỌI VỐN: ${fundingRound}
QUY MÔ VỐN CẦN HUY ĐỘNG: ${targetAsk}

CẤU TRÚC 12 SLIDE BẮT BUỘC CHUẨN SEQUOIA / Y COMBINATOR:
1. 🎯 Slide 1: Tiêu đề & Cú móc thu hút (The Hook & One-Liner Elevator Pitch)
2. ⚠️ Slide 2: Vấn đề nhức nhối của thị trường (The Urgent & Underserved Problem)
3. 💡 Slide 3: Giải pháp đột phá (The Breakthrough Solution & Value Proposition)
4. 🌍 Slide 4: Quy mô thị trường khổng lồ (Market Size: TAM, SAM, SOM)
5. 🚀 Slide 5: Sản phẩm & Lợi thế công nghệ độc quyền (Product Demo & Unfair Advantage Moat)
6. 💰 Slide 6: Mô hình kinh doanh & Kinh tế đơn vị (Business Model & Unit Economics)
7. 📈 Slide 7: Dấu ấn tăng trưởng thực tế (Traction, MoM Growth & Key Metrics)
8. 🎯 Slide 8: Chiến lược chiếm lĩnh thị trường (Go-To-Market Strategy & CAC Engine)
9. ⚔️ Slide 9: Ma trận cạnh tranh & Hào kinh tế phòng thủ (Competitive Landscape & Moat)
10. 📊 Slide 10: Dự phóng tài chính 3-5 năm (Financial Projections & Unit Economics)
11. 👥 Slide 11: Đội ngũ sáng lập & Năng lực thực chiến (Rockstar Founding Team)
12. 💎 Slide 12: Kêu gọi đầu tư & Phân bổ nguồn vốn (The Ask, Milestones & Use of Funds)

Trình bày theo phong cách chuyên gia đầu tư Silicon Valley, lập luận sắc bén, số liệu thuyết phục và truyền cảm hứng mãnh liệt cho các quỹ đầu tư.`;

    try {
      const { text: deckText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        ventureData,
        fundingRound,
        report: deckText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const pitchDeck = new PitchDeckEngine();
