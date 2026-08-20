import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Quản Trị Thành Công Khách Hàng & Điểm Sức Khỏe Tài Khoản (Customer Success & Account Health Engine)
 */
export class CustomerSuccessEngine {
  /**
   * Đánh giá điểm sức khỏe khách hàng trọng yếu (Health Score 0-100), xây dựng kế hoạch đánh giá kinh doanh hàng quý QBR và chiến lược Upsell/Expansion
   */
  async auditCustomerSuccess(accountData, tierLevel = 'Khách hàng trọng yếu Enterprise Tier-1 / Khách hàng SMB', contractValue = 'ARR / Giá trị hợp đồng hàng năm') {
    if (!accountData || typeof accountData !== 'string') {
      return { success: false, error: 'Thông tin tài khoản khách hàng không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Thành Công Khách Hàng & Chuyên Gia Tăng Trưởng Doanh Thu Khách Hàng Hiện Hữu (Chief Customer Officer - CCO & VP of Customer Success).
Hãy lập một Báo Cáo Thẩm Định Sức Khỏe Khách Hàng & Kế Hoạch Đánh Giá Kinh Doanh Định Kỳ QBR (Customer Success & Account Health Scorecard) cho tài khoản sau:

THÔNG TIN TÀI KHOẢN KHÁCH HÀNG & LỊCH SỬ SỬ DỤNG:
"""
${accountData}
"""
PHÂN KHÚC KHÁCH HÀNG: ${tierLevel}
GIÁ TRỊ HỢP ĐỒNG HIỆN HỮU: ${contractValue}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🩺 CHỈ SỐ SỨC KHỎE TÀI KHOẢN TOÀN DIỆN (ACCOUNT HEALTH SCORE 0 - 100):
   - Mức độ sử dụng tính năng sản phẩm (Product Adoption & DAU/MAU)
   - Tần suất hỗ trợ kỹ thuật và thời gian giải quyết sự cố (Support SLA & CSAT)
   - Mức độ hài lòng của người bảo trợ dự án (Champion Relationship & NPS)
2. 🚨 CẢNH BÁO TÍN HIỆU RỦI RO RỜI BỎ SỚM (EARLY CHURN RISK RED FLAGS):
   - Nhận diện các nguy cơ tiềm ẩn (Người ra quyết định chuyển công tác, ngân sách cắt giảm)
3. 📊 KHUNG NỘI DUNG HỌP ĐÁNH GIÁ KINH DOANH HÀNG QUÝ (EXECUTIVE QBR AGENDA & JOINT SUCCESS PLAN):
   - Báo cáo chỉ số ROI mang lại cho khách hàng và lộ trình đồng hành 12 tháng tới
4. 💎 CHIẾN LƯỢC MỞ RỘNG DOANH THU & NÂNG CẤP DỊCH VỤ (EXPANSION, CROSS-SELL & UPSELL PLAYBOOK):
   - Đề xuất bổ sung thêm gói người dùng hoặc tính năng cao cấp gia tăng NRR (Net Revenue Retention)

Trình bày theo phong cách chuyên gia quản trị khách hàng doanh nghiệp hàng đầu của Salesforce/HubSpot, sâu sắc, chu đáo và thúc đẩy tỷ lệ tái ký 100%.`;

    try {
      const { text: csText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        accountData,
        tierLevel,
        report: csText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const customerSuccess = new CustomerSuccessEngine();
