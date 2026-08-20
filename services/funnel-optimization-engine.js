import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Tối Ưu Hóa Phễu Doanh Thu & Hành Trình Khách Hàng (Customer Journey & Revenue Funnel Engine)
 */
export class FunnelOptimizationEngine {
  /**
   * Phân tích hành trình khách hàng 5 giai đoạn, chuẩn đoán điểm rơi rớt và tối ưu tỷ lệ chuyển đổi CRO
   */
  async optimizeFunnel(funnelData, businessModel = 'B2B SaaS / Thương mại điện tử B2C / Dịch vụ tư vấn', trafficSource = 'Quảng cáo Meta/Google, SEO, Zalo OA, Referral') {
    if (!funnelData || typeof funnelData !== 'string') {
      return { success: false, error: 'Dữ liệu phễu chuyển đổi không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Tăng Trưởng & Chuyên Gia Tối Ưu Tỷ Lệ Chuyển Đổi (Chief Growth Officer - CGO & Conversion Rate Optimization Lead).
Hãy lập một Báo Cáo Chuẩn Đoán Hành Trình Khách Hàng & Kế Hoạch Tối Ưu Phễu Doanh Thu (Customer Journey & Revenue Funnel Audit) cho mô hình sau:

MÔ HÌNH KINH DOANH: ${businessModel}
NGUỒN LƯU LƯỢNG TRUY CẬP: ${trafficSource}
DỮ LIỆU PHỄU & ĐIỂM NGHẼN CHUYỂN ĐỔI:
"""
${funnelData}
"""

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🗺️ BẢN ĐỒ HÀNH TRÌNH KHÁCH HÀNG 5 GIAI ĐOẠN (5-STAGE CUSTOMER JOURNEY MAP):
   - Nhận biết (Awareness) -> Cân nhắc (Consideration) -> Chuyển đổi (Conversion) -> Giữ chân (Retention) -> Giới thiệu (Advocacy)
2. 🔍 CHUẨN ĐOÁN ĐIỂM RƠI RỚT TRỌNG YẾU (FUNNEL LEAKAGE & BOTTLENECK ANALYSIS):
   - Phân tích nguyên nhân rớt chuyển đổi ở từng nấc thang phễu (Landing Page UX, Ma sát thanh toán, Chăm sóc Lead chậm)
3. 🧪 4 GIẢ THUYẾT THỰC NGHIỆM TĂNG TỐC CRO (A/B TESTING & GROWTH EXPERIMENTS):
   - Thử nghiệm tiêu đề, lời kêu gọi hành động CTA, ưu đãi khẩn cấp và hiệu ứng bằng chứng xã hội Social Proof
4. ⚙️ QUY TRÌNH NUÔI DƯỠNG TỰ ĐỘNG ĐA KÊNH (AUTOMATED NURTURE SEQUENCE: EMAIL & ZALO WORKFLOW):
   - Kịch bản tin nhắn tự động kích hoạt chuyển đổi sau 1 giờ, 24 giờ và 3 ngày
5. 📈 DỰ BÁO TĂNG TRƯỞNG LỢI NHUẬN & GIÁ TRỊ VÒNG ĐỜI KHÁCH HÀNG (LTV/CAC EXPANSION)

Trình bày theo phong cách chuyên gia tăng trưởng doanh thu đỉnh cao của Thung lũng Silicon, thực chiến và dễ dàng triển khai ngay.`;

    try {
      const { text: funnelText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        funnelData,
        businessModel,
        report: funnelText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const funnelOptimization = new FunnelOptimizationEngine();
