import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Đánh Giá Nhà Cung Cấp & Tối Ưu Mua Hàng Đấu Thầu (Vendor Procurement & RFP Engine)
 */
export class VendorProcurementEngine {
  /**
   * So sánh và chấm điểm hồ sơ thầu nhà cung cấp (RFP/RFQ) theo ma trận đa tiêu chí
   */
  async evaluateVendors(procurementRequirement, vendorBidsText, budgetOrConstraints = 'Tối ưu ngân sách & đảm bảo SLA') {
    if (!procurementRequirement || typeof procurementRequirement !== 'string') {
      return { success: false, error: 'Yêu cầu mua sắm không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Thu Mua & Chuỗi Cung Ứng Toàn Cầu (Chief Procurement Officer - CPO).
Hãy lập một Báo Cáo Đánh Giá Hồ Sơ Thầu & Ma Trận Chấm Điểm Nhà Cung Cấp (Vendor Evaluation & RFP Scorecard) cho gói thầu sau:

YÊU CẦU MUA SẮM / HẠNG MỤC: "${procurementRequirement}"
NGÂN SÁCH / RÀNG BUỘC: ${budgetOrConstraints}
DANH SÁCH BÁO GIÁ / HỒ SƠ CÁC NHÀ CUNG CẤP:
"""
${vendorBidsText || 'Chưa có báo giá chi tiết, hãy lập khung tiêu chí đánh giá chuẩn cho nhà thầu.'}
"""

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 📊 MA TRẬN ĐÁNH GIÁ ĐA TIÊU CHÍ (MULTI-CRITERIA SCORING TABLE 1-100 ĐIỂM):
   - Tiêu chí 1: Giá thành & Điều khoản thanh toán (Công nợ, chiết khấu số lượng) - Trọng số 35%
   - Tiêu chí 2: Chất lượng, Năng lực kỹ thuật & Chứng chỉ SLA - Trọng số 30%
   - Tiêu chí 3: Thời gian giao hàng & Độ tin cậy chuỗi cung ứng - Trọng số 20%
   - Tiêu chí 4: Dịch vụ hậu mãi, Bảo hành & Hỗ trợ khẩn cấp - Trọng số 15%
2. 🏆 BẢNG XẾP HẠNG & ĐỀ XUẤT NHÀ CUNG CẤP TỐI ƯU (RECOMMENDED VENDOR SHORTLIST)
3. 💬 3 ĐÒN BẨY ĐÀM PHÁN GIÁ & HỢP ĐỒNG (NEGOTIATION LEVERAGES)
4. ⚠️ PHÂN TÍCH RỦI RO PHỤ THUỘC ĐỘC QUYỀN (SINGLE-SOURCE VENDOR RISKS)

Trình bày theo phong cách sắc bén, công tâm, chuẩn nghiệp vụ mua sắm doanh nghiệp quốc tế.`;

    try {
      const { text: procurementText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        procurementRequirement,
        report: procurementText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const vendorProcurement = new VendorProcurementEngine();
