import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Chuỗi Cung Ứng & Phòng Ngừa Rủi Ro Nguồn Hàng (Supply Chain Resilience Engine)
 */
export class SupplyChainResilienceEngine {
  /**
   * Đánh giá rủi ro đứt gãy chuỗi cung ứng, thiết lập cơ chế nguồn kép Dual-Sourcing và tối ưu tồn kho an toàn Safety Stock
   */
  async auditSupplyChain(supplyChainContext, criticalMaterials = 'Nguyên vật liệu cốt lõi / Linh kiện bán dẫn / Bao bì', supplierCountry = 'Trung Quốc, Việt Nam, Hàn Quốc, Châu Âu') {
    if (!supplyChainContext || typeof supplyChainContext !== 'string') {
      return { success: false, error: 'Thông tin chuỗi cung ứng không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Chuỗi Cung Ứng Toàn Cầu & Chuyên Gia Quản Trị Rủi Ro Vận Hành (Chief Supply Chain Officer - CSCO & Logistics Resilience Lead).
Hãy lập một Báo Cáo Thẩm Định & Kế Hoạch Tăng Cường Khả Năng Chống Chịu Chuỗi Cung Ứng (Supply Chain Resilience & Dual-Sourcing Strategy) cho hoạt động sau:

BỐI CẢNH CHUỖI CUNG ỨNG / NGUYÊN VẬT LIỆU:
"""
${supplyChainContext}
"""
NHÓM VẬT TƯ/HÀNG HÓA TRỌNG YẾU: ${criticalMaterials}
KHU VỰC ĐỊA LÝ NHÀ CUNG CẤP: ${supplierCountry}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🔍 BẢN ĐỒ RỦI RO CHUỖI CUNG ỨNG 3 CẤP (TIER 1-2-3 SUPPLIER RISK MAP):
   - Đánh giá rủi ro phụ thuộc đơn nguồn (Single-Source Risk)
   - Điểm nghẽn logistics cảng biển, biến động cước vận tải và rào cản thuế quan
2. 🔄 CHIẾN LƯỢC NGUỒN CUNG KÉP (DUAL-SOURCING & NEARSHORING STRATEGY):
   - Cơ chế phân bổ đơn hàng tỷ lệ vàng (70% Nhà cung cấp chính - 30% Nhà cung cấp dự phòng)
   - Kế hoạch chuyển dịch nguồn cung về các thị trường lân cận an toàn (Nearshoring/Friendshoring)
3. 📦 CƠ CHẾ ĐIỀU TIẾT TỒN KHO AN TOÀN & ĐIỂM ĐẶT HÀNG LẠI (SAFETY STOCK & REORDER POINT - ROP):
   - Vùng đệm buffer chống trễ hạn giao hàng (Lead Time Variance)
4. 🚨 QUY TRÌNH ỨNG PHÓ KHẨN CẤP PHÒNG TÁC CHIẾN CHUỖI CUNG ỨNG (SUPPLY CHAIN WAR ROOM PROTOCOL)

Trình bày theo phong cách chuyên gia vận hành chuỗi cung ứng quốc tế của Apple/Toyota, thực chiến, tối ưu chi phí và bảo đảm dây chuyền sản xuất không bao giờ bị đình trệ.`;

    try {
      const { text: scText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        supplyChainContext,
        criticalMaterials,
        report: scText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const supplyChainResilience = new SupplyChainResilienceEngine();
