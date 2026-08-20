import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Định Vị Thương Hiệu Chiến Lược & Khởi Tạo Thị Trường (Brand Positioning & Category Creation Engine)
 */
export class BrandPositioningEngine {
  /**
   * Thiết lập chiến lược định vị thương hiệu Category King, câu chuyện truyền thông chiến lược Strategic Narrative và bản đồ định vị
   */
  async developBrandPositioning(brandContext, targetAudience = 'Khách hàng B2B C-level / Khách hàng tiêu dùng cao cấp', competitorLandscape = 'Đối thủ truyền thống vs Giải pháp mới nổi') {
    if (!brandContext || typeof brandContext !== 'string') {
      return { success: false, error: 'Thông tin thương hiệu không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Chiến Lược Thương Hiệu Toàn Cầu & Chuyên Gia Khởi Tạo Ngành Hàng (Chief Brand Officer - CBO & Category Designer).
Hãy lập một Bản Đề Án Định Vị Thương Hiệu Chiến Lược & Câu Chuyện Tuyên Ngôn (Strategic Brand Positioning & Category King Narrative) cho thương hiệu sau:

THÔNG TIN THƯƠNG HIỆU & SẢN PHẨM:
"""
${brandContext}
"""
KHÁCH HÀNG MỤC TIÊU: ${targetAudience}
BỐI CẢNH ĐỐI THỦ CẠNH TRANH: ${competitorLandscape}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 👑 ĐỊNH VỊ THỐNG TRỊ NGÀNH HÀNG (CATEGORY CREATION & POSITIONING STATEMENT):
   - Đặt tên cho ngành hàng mới mà doanh nghiệp làm chủ (Category Name)
   - Tuyên ngôn định vị cốt lõi (Core Positioning Statement) chiếm lĩnh tâm trí khách hàng
2. 📖 CÂU CHUYỆN CHIẾN LƯỢC 5 BƯỚC (5-STEP STRATEGIC NARRATIVE & MANIFESTO):
   - Bước 1: Sự thay đổi địa chấn của thế giới (The Seismic Shift: Old World vs New World)
   - Bước 2: Kẻ thù chung & Nỗi đau nhức nhối (The Looming Villain / Market Trap)
   - Bước 3: Miền đất hứa tương lai (The Promised Land)
   - Bước 4: Vũ khí siêu năng lực độc quyền của thương hiệu (Magic Gifts / Core Capabilities)
   - Bước 5: Bằng chứng xác thực không thể chối cãi (Proof of Success)
3. 🗺️ BẢN ĐỒ ĐỊNH VỊ NHẬN THỨC 2 TRỤC (PERCEPTUAL POSITIONING MAP):
   - Trục X vs Trục Y chỉ rõ khoảng trống thị trường màu mỡ độc quyền
4. 🎙️ BỘ THÔNG ĐIỆP ĐIỀU HÀNH (EXECUTIVE MESSAGE ARCHITECTURE):
   - Khẩu hiệu ngắn (Tagline), Giới thiệu 15 giây (Elevator Pitch) và Giọng điệu thương hiệu (Brand Voice Tone)

Trình bày theo phong cách chuyên gia thương hiệu đẳng cấp thế giới của Silicon Valley (Play Bigger / Andy Raskin), giàu cảm xúc, truyền cảm hứng và thôi miên khách hàng.`;

    try {
      const { text: brandText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        brandContext,
        targetAudience,
        report: brandText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const brandPositioning = new BrandPositioningEngine();
