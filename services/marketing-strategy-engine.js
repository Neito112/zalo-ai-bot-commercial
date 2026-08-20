import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Chiến Lược Marketing & Chân Dung Khách Hàng (Marketing Strategy & Customer Persona Engine)
 */
export class MarketingStrategyEngine {
  /**
   * Thiết kế chiến dịch Marketing tổng thể và xây dựng chân dung khách hàng mục tiêu
   */
  async generateCampaign(productOrService, targetMarket = 'Việt Nam', budgetOrScale = 'Vừa & Nhỏ') {
    if (!productOrService || typeof productOrService !== 'string') {
      return { success: false, error: 'Thông tin sản phẩm/dịch vụ không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Marketing (CMO) & Chuyên Gia Tăng Trưởng (Growth Hacker) Cấp Cao.
Hãy lập một Kế Hoạch Chiến Dịch Marketing Thực Chiến (Go-To-Market & Growth Strategy) cho sản phẩm/dịch vụ sau:

SẢN PHẨM / DỊCH VỤ: "${productOrService}"
THỊ TRƯỜNG MỤC TIÊU: ${targetMarket}
QUY MÔ / NGÂN SÁCH DỰ KIẾN: ${budgetOrScale}

CẤU TRÚC KẾ HOẠCH YÊU CẦU:
1. 👤 CHÂN DUNG KHÁCH HÀNG MỤC TIÊU (BUYER PERSONA):
   - Nhân khẩu học, Nỗi đau sâu sắc (Pain Points), Động lực mua hàng (Buying Triggers)
2. 🎯 THÔNG ĐIỆP CỐT LÕI & ĐỊNH VỊ (CORE MESSAGE & UNIQUE SELLING PROPOSITION - USP)
3. 🚀 CHIẾN DỊCH GO-TO-MARKET 3 GIAI ĐOẠN:
   - Giai đoạn 1: Tạo tò mò & Thu hút (Awareness & Lead Magnet)
   - Giai đoạn 2: Nuôi dưỡng & Chuyển đổi (Nurturing & Irresistible Offer)
   - Giai đoạn 3: Giữ chân & Lan tỏa (Retention & Referral)
4. 📝 3 GÓC TIẾP CẬN QUẢNG CÁO ĐỘT PHÁ (HOOK - STORY - OFFER COPYWRITING ANGLES)
5. 📊 CHỈ SỐ KPI ĐO LƯỜNG HIỆU QUẢ (CAC, CPL, ROAS, Tỷ lệ chuyển đổi)

Trình bày theo phong cách sắc bén, tập trung vào tăng trưởng doanh thu và thực thi ngay lập tức.`;

    try {
      const { text: campaignText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        productOrService,
        targetMarket,
        campaign: campaignText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const marketingStrategy = new MarketingStrategyEngine();
