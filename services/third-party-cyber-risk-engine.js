import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Rủi Ro An Ninh Mạng Chuỗi Cung Ứng & Thẩm Định Đối Tác Thứ Ba (Third-Party Cyber Risk Management - TPCRM Engine)
 */
export class ThirdPartyCyberRiskEngine {
  /**
   * Đánh giá rủi ro an ninh mạng nhà cung cấp theo tiêu chuẩn NIST CSF & ISO 27001, bảng câu hỏi SIG và điều khoản SLA bảo mật
   */
  async auditThirdPartyCyberRisk(vendorData, serviceCriticality = 'Đối tác đám mây Cloud Hosting / Xử lý thanh toán Payment / Quản trị dữ liệu khách hàng CRM', complianceStandard = 'NIST CSF, ISO 27001 & Nghị định 13/2023/NĐ-CP') {
    if (!vendorData || typeof vendorData !== 'string') {
      return { success: false, error: 'Thông tin nhà cung cấp / đối tác thứ ba không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc An Toàn Thông Tin & Chuyên Gia Quản Trị Rủi Ro An Ninh Đối Tác Thứ Ba (Chief Information Security Officer - CISO & Vendor Cyber Risk Assessor).
Hãy lập một Báo Cáo Thẩm Định & Quản Trị Rủi Ro An Ninh Mạng Chuỗi Cung Ứng (Third-Party Cyber Risk Assessment & Vendor Security SLA) cho đối tác sau:

THÔNG TIN NHÀ CUNG CẤP & DỊCH VỤ CUNG CẤP:
"""
${vendorData}
"""
MỨC ĐỘ TRỌNG YẾU CỦA DỊCH VỤ: ${serviceCriticality}
TIÊU CHUẨN TUÂN THỦ ÁP DỤNG: ${complianceStandard}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🛡️ ĐÁNH GIÁ MỨC ĐỘ RỦI RO AN NINH ĐỐI TÁC 4 CẤP ĐỘ (VENDOR SECURITY RISK TIERING):
   - Phân loại Tier 1 (Critical), Tier 2 (High), Tier 3 (Medium), Tier 4 (Low)
   - Đánh giá bề mặt tấn công chuỗi cung ứng (Supply Chain Attack Surface) và rủi ro rò rỉ dữ liệu nguồn
2. 📋 BẢNG CÂU HỎI BẢO MẬT CHUẨN HÓA (STANDARDIZED INFORMATION GATHERING - SIG LITE/CORE):
   - Rà soát xác thực đa yếu tố (MFA), kiểm soát truy cập phân quyền Zero Trust và mã hóa dữ liệu (AES-256 / TLS 1.3)
   - Kiểm toán chứng chỉ bảo mật độc lập (SOC 2 Type II, ISO/IEC 27001:2022)
3. 📜 ĐIỀU KHOẢN PHÁP LÝ BẢO MẬT TRONG HỢP ĐỒNG (CYBERSECURITY SLA & DPA ADDENDUM):
   - Nghĩa vụ thông báo sự cố mã độc/rò rỉ dữ liệu trong vòng 24 - 72 giờ
   - Quyền thanh tra kiểm toán an ninh định kỳ (Right-to-Audit Clause) và bảo hiểm an ninh mạng (Cyber Insurance Requirement)
4. 🚦 QUY TRÌNH HỦY LIÊN KẾT & THU HỒI QUYỀN TRUY CẬP AN TOÀN KHI CHẤM DỨT DỊCH VỤ (OFFBOARDING & DATA SANITIZATION)

Trình bày theo phong cách chuyên gia CISO cấp cao, chuẩn mực quốc tế, thiết lập rào chắn phòng thủ vững chắc bảo vệ dữ liệu tối mật của doanh nghiệp.`;

    try {
      const { text: tpcrmText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        vendorData,
        serviceCriticality,
        report: tpcrmText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const thirdPartyCyberRisk = new ThirdPartyCyberRiskEngine();
