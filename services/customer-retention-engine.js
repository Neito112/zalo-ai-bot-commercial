import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Phòng Chống Rời Bỏ & Chiến Lược Giữ Chân Khách Hàng (Customer Churn Prevention & Retention Engine)
 */
export class CustomerRetentionEngine {
  /**
   * Phân tích dấu hiệu rời bỏ và thiết lập kịch bản giữ chân khách hàng (Retention Playbook)
   */
  async generateRetentionPlaybook(churnSignals, customerTier = 'Doanh nghiệp B2B / Khách hàng VIP', productType = 'Dịch vụ SaaS / Phần mềm / Dịch vụ định kỳ') {
    if (!churnSignals || typeof churnSignals !== 'string') {
      return { success: false, error: 'Tín hiệu rời bỏ không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Thành Công Của Khách Hàng & Giữ Chân Doanh Thu (Chief Customer Officer - CCO & VP of Retention).
Hãy lập một Kịch Bản Cứu Vãn & Giữ Chân Khách Hàng (Customer Retention & Win-Back Playbook) cho trường hợp sau:

LOẠI HÌNH SẢN PHẨM / DỊCH VỤ: ${productType}
PHÂN HẠNG KHÁCH HÀNG: ${customerTier}
CÁC DẤU HIỆU RỜI BỎ / KHIẾU NẠI GHI NHẬN ĐƯỢC:
"""
${churnSignals}
"""

CẤU TRÚC KỊCH BẢN YÊU CẦU:
1. 🔍 CHẨN ĐOÁN CĂN NGUYÊN RỜI BỎ (ROOT-CAUSE DIAGNOSIS):
   - Phân loại nguyên nhân: Giá trị chưa tương xứng (ROI), Trải nghiệm sản phẩm/lỗi kỹ thuật, Thay đổi nhân sự khách hàng, hay Đối thủ lôi kéo
2. 🛡️ QUY TRÌNH ỨNG CỨU 3 BƯỚC KHẨN CẤP (CHURN INTERVENTION PROTOCOL):
   - Bước 1: Tiếp cận thấu cảm (Empathy Outreach trong 2-4h)
   - Bước 2: Cuộc họp tái căn chỉnh giá trị (Executive Alignment Meeting)
   - Bước 3: Đề xuất gói giải pháp giữ chân đặc biệt (Custom Win-Back Offer)
3. ✉️ MẪU EMAIL THUYẾT PHỤC TỪ LÃNH ĐẠO CẤP CAO (EXECUTIVE SPONSOR EMAIL)
4. 📈 3 CHIẾN LƯỢC PHÒNG NGỪA RỜI BỎ CHỦ ĐỘNG DÀI HẠN (NET REVENUE RETENTION - NRR)

Trình bày theo phong cách tinh tế, đồng cảm cao, mang tính thực chiến để giữ lại các tài khoản doanh thu quan trọng.`;

    try {
      const { text: retentionText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        churnSignals,
        customerTier,
        playbook: retentionText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const customerRetention = new CustomerRetentionEngine();
