import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Tối Ưu Hóa Chi Phí Thuế Hợp Pháp & Tuân Thủ Pháp Luật Doanh Nghiệp (Corporate Tax & Compliance Engine)
 */
export class TaxOptimizationEngine {
  /**
   * Lập kế hoạch tối ưu thuế TNDN, GTGT, Thuế nhà thầu và thẩm định chi phí hợp lý hợp lệ
   */
  async optimizeTaxPlan(businessProfile, annualRevenueOrProfit = 'Doanh thu 10-50 tỷ VND', industry = 'Thương mại điện tử / Dịch vụ công nghệ / Sản xuất') {
    if (!businessProfile || typeof businessProfile !== 'string') {
      return { success: false, error: 'Thông tin hồ sơ kinh doanh không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Thuế Cấp Cao & Chuyên Gia Tư Vấn Thuế Big 4 (Senior Tax Director & Compliance Advisor).
Hãy lập một Báo Cáo Chiến Lược Tối Ưu Hóa Thuế Hợp Pháp & Quản Trị Rủi Ro Thanh Tra Thuế (Corporate Tax Planning & Compliance Report) cho doanh nghiệp sau:

HỒ SƠ HOẠT ĐỘNG / MÔ HÌNH:
"""
${businessProfile}
"""
QUY MÔ DOANH THU / LỢI NHUẬN: ${annualRevenueOrProfit}
LĨNH VỰC HOẠT ĐỘNG: ${industry}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 📊 TỔNG QUAN NGHĨA VỤ THUẾ TRỌNG YẾU (Thuế TNDN 20%, Thuế GTGT 8-10%, Thuế Nhà thầu FCT đối với phần mềm/dịch vụ quốc tế như Google/Facebook/AWS)
2. 💡 4 CHIẾN LƯỢC TỐI ƯU HÓA THUẾ HỢP PHÁP (LEGAL TAX OPTIMIZATION LEVERS):
   - Chính sách ưu đãi thuế ngành công nghệ / nghiên cứu phát triển R&D / vườn ươm khởi nghiệp
   - Tối ưu hóa chi phí hợp lý hợp lệ (Chi phí đào tạo nhân sự, R&D, khấu hao tài sản nhanh, phúc lợi nhân viên)
   - Tối ưu hóa thuế nhà thầu FCT khi thuê dịch vụ/server từ nước ngoài
   - Quản trị giao dịch liên kết theo Nghị định 132/2020/NĐ-CP (Khống chế lãi vay 30% EBITDA)
3. ⚠️ 3 RỦI RO BỊ TRUY THU & PHẠT THUẾ PHỔ BIẾN KHI THANH TRA
4. 📋 BẢNG CHECKLIST HỒ SƠ CHỨNG TỪ & HÓA ĐƠN ĐIỆN TỬ BẢO VỆ DOANH NGHIỆP

Trình bày theo phong cách chuyên gia tư vấn thuế chuẩn mực, sắc sảo, tuyệt đối tuân thủ pháp luật hiện hành và bảo vệ tối đa dòng tiền của doanh nghiệp.`;

    try {
      const { text: taxText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        businessProfile,
        industry,
        report: taxText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const taxOptimization = new TaxOptimizationEngine();
