import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Chiến Lược Thâm Nhập Thị Trường Quốc Tế & Mở Rộng Toàn Cầu (Global Market Entry Strategy Engine)
 */
export class MarketEntryEngine {
  /**
   * Thiết lập chiến lược mở rộng thị trường xuyên biên giới, lựa chọn mô hình thâm nhập và lộ trình GTM
   */
  async planMarketEntry(productService, targetCountry = 'Đông Nam Á (Singapore/Indonesia) / Mỹ / Nhật Bản', entryMode = 'Thương mại điện tử xuyên biên giới / Thành lập công ty con WOS / Liên doanh JV') {
    if (!productService || typeof productService !== 'string') {
      return { success: false, error: 'Thông tin sản phẩm/dịch vụ không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Mở Rộng Thị Trường Quốc Tế & Cố Vấn Đầu Tư Toàn Cầu (Head of International Expansion & Cross-Border Strategy).
Hãy lập một Kế Hoạch Chiến Lược Thâm Nhập Thị Trường Nước Ngoài (Global Market Entry & Localization Plan) cho sản phẩm sau:

SẢN PHẨM / DỊCH VỤ:
"""
${productService}
"""
QUỐC GIA / KHU VỰC MỤC TIÊU: ${targetCountry}
MÔ HÌNH THÂM NHẬP DỰ KIẾN: ${entryMode}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🌍 PHÂN TÍCH MÔI TRƯỜNG THỊ TRƯỜNG & RÀO CẢN ĐỊA PHƯƠNG (PESTEL & TARIFF BARRIERS):
   - Quy định pháp lý sở tại, rào cản thuế quan/hải quan và giấy phép nhập khẩu/kinh doanh
   - Hành vi người tiêu dùng, văn hóa thanh toán và kênh phân phối thống trị địa phương
2. 🚀 SO SÁNH & LỰA CHỌN MÔ HÌNH THÂM NHẬP TỐI ƯU (ENTRY MODE SELECTION):
   - Xuất khẩu trực tiếp qua E-Commerce (Amazon FBA, TikTok Shop Global, Shopee)
   - Thiết lập pháp nhân công ty con sở hữu 100% (WOS) vs Hợp tác liên doanh với đối tác bản địa (JV)
3. 🎯 CHIẾN LƯỢC BẢN ĐỊA HÓA SẢN PHẨM & MARKETING (PRODUCT LOCALIZATION & GTM):
   - Tinh chỉnh thông điệp truyền thông, bao bì, định giá phù hợp sức mua địa phương
   - Chiến lược tuyển dụng nhân sự bản địa & thiết lập mạng lưới đối tác phân phối
4. 🗓️ LỘ TRÌNH 180 NGÀY THÂM NHẬP THỊ TRƯỜNG & DỰ TOÁN NGÂN SÁCH ĐẦU TƯ BAN ĐẦU

Trình bày theo phong cách chuyên gia chiến lược quốc tế sắc sảo, thực tế, giảm thiểu rủi ro pháp lý và tối đa hóa khả năng chiếm lĩnh thị phần.`;

    try {
      const { text: entryText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        productService,
        targetCountry,
        report: entryText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const marketEntry = new MarketEntryEngine();
