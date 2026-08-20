import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Kịch Bản Bán Hàng & Xử Lý Từ Chối Đỉnh Cao (Sales Pitch & Objection Handling Engine)
 */
export class SalesObjectionMasterEngine {
  /**
   * Tạo kịch bản bán hàng và các phương án bẻ gãy lời từ chối của khách hàng
   */
  async generateSalesScript(productOrService, customerObjection = 'Giá đắt quá so với thị trường', clientType = 'Khách hàng B2B / Doanh nghiệp') {
    if (!productOrService || typeof productOrService !== 'string') {
      return { success: false, error: 'Thông tin sản phẩm/dịch vụ không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Bán Hàng (Chief Commercial Officer - CCO) & Bậc Thầy Đàm Phán Bán Hàng Cấp Cao.
Hãy lập một Kịch Bản Bán Hàng & Bộ Xử Lý Lời Từ Chối Thực Chiến (Sales Battlecard & Objection Handling Script) cho tình huống sau:

SẢN PHẨM / DỊCH VỤ: "${productOrService}"
ĐỐI TƯỢNG KHÁCH HÀNG: ${clientType}
LỜI TỪ CHỐI / RÀO CẢN CỦA KHÁCH: "${customerObjection}"

CẤU TRÚC KỊCH BẢN YÊU CẦU:
1. 🧠 PHÂN TÍCH TÂM LÝ ẨN SAU LỜI TỪ CHỐI (Khách hàng thực sự sợ điều gì? Giá, rủi ro hay thiếu niềm tin?)
2. 🎯 3 CHIẾN THUẬT BẺ GÃY LỜI TỪ CHỐI KÈM MẪU CÂU NÓI TRỰC TIẾP (SCRIPT):
   - Kỹ thuật 1: Đồng cảm & Chuyển dịch góc nhìn (Feel - Felt - Found Framework)
   - Kỹ thuật 2: So sánh Chi phí Cơ hội & Định vị Giá trị (Value Anchoring / ROI Matrix)
   - Kỹ thuật 3: Đảo ngược rủi ro & Cam kết (Risk Reversal Strategy)
3. 🤝 CÂU HỎI CHỐT SALE (CLOSING QUESTIONS): 2 câu hỏi thôi thúc khách hàng ra quyết định ngay
4. ⚠️ ĐIỀU TUYỆT ĐỐI KHÔNG NÓI TRONG TÌNH HUỐNG NÀY

Trình bày theo phong cách sắc bén, thực chiến, có thể áp dụng qua điện thoại, nhắn tin Zalo hoặc gặp mặt trực tiếp.`;

    try {
      const { text: scriptText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        productOrService,
        customerObjection,
        clientType,
        script: scriptText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const salesObjectionMaster = new SalesObjectionMasterEngine();
