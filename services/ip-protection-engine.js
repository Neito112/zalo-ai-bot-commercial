import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Bảo Hộ Sở Hữu Trí Tuệ & Bí Mật Kinh Doanh (IP Protection & Trademark/Patent Engine)
 */
export class IpProtectionEngine {
  /**
   * Lập chiến lược bảo hộ nhãn hiệu, sáng chế, bản quyền phần mềm và xử lý vi phạm sở hữu trí tuệ
   */
  async protectIntellectualProperty(assetDescription, ipType = 'Nhãn hiệu thương mại / Bản quyền phần mềm / Sáng chế', targetMarket = 'Việt Nam & Quốc tế (WIPO/Madrid)') {
    if (!assetDescription || typeof assetDescription !== 'string') {
      return { success: false, error: 'Mô tả tài sản trí tuệ không hợp lệ.' };
    }

    const prompt = `Bạn là Luật Sư Trưởng Sở Hữu Trí Tuệ & Cố Vấn Bằng Sáng Chế Quốc Tế (Chief IP Counsel & Patent Attorney).
Hãy lập một Kế Hoạch Đăng Ký Bảo Hộ Sở Hữu Trí Tuệ & Phòng Ngừa Vi Phạm (IP Protection Strategy & Enforcement Plan) cho tài sản sau:

MÔ TẢ TÀI SẢN TRÍ TUỆ / SẢN PHẨM:
"""
${assetDescription}
"""
LOẠI HÌNH BẢO HỘ: ${ipType}
PHẠM VI THỊ TRƯỜNG: ${targetMarket}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🛡️ CHIẾN LƯỢC BẢO HỘ 4 LỚP (4-TIER IP FORTRESS):
   - Nhãn hiệu thương mại (Trademark - Phân nhóm hàng hóa Ni-xơ và chiến lược bao vây tên miền)
   - Bản quyền tác phẩm / Mã nguồn phần mềm (Copyright & Software IP Assignment)
   - Sáng chế / Giải pháp hữu ích (Patent / Utility Solution - Đánh giá tính mới và khả năng áp dụng công nghiệp)
   - Bí mật kinh doanh (Trade Secrets - Thỏa thuận bảo mật NDA và không cạnh tranh NCA)
2. 📝 THỎA THUẬN CHUYỂN GIAO QUYỀN SỞ HỮU TÁC GIẢ TỪ NHÂN VIÊN SANG CÔNG TY (IP ASSIGNMENT CLAUSES)
3. 🚨 QUY TRÌNH XỬ LÝ VI PHẠM & THƯ CẢNH BÁO PHÁP LÝ (CEASE & DESIST LETTER PROTOCOL)
4. 🌐 LỘ TRÌNH ĐĂNG KÝ BẢO HỘ QUỐC TẾ (HỆ THỐNG MADRID / PCT)

Trình bày sắc bén, chuẩn mực pháp lý quốc tế và Việt Nam (Luật Sở Hữu Trí Tuệ), bảo vệ trọn vẹn giá trị vô hình của doanh nghiệp.`;

    try {
      const { text: ipText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        assetDescription,
        ipType,
        report: ipText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const ipProtection = new IpProtectionEngine();
