import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Đánh Giá An Ninh Mạng & Tuân Thủ Dữ Liệu Cá Nhân (Cybersecurity & Data Privacy Compliance Engine)
 */
export class CybersecurityComplianceEngine {
  /**
   * Đánh giá an ninh thông tin và tuân thủ Nghị định 13/2023/NĐ-CP & ISO 27001
   */
  async auditCybersecurity(techStackOrSystem, dataTypes = 'Dữ liệu khách hàng, tài khoản ngân hàng, thông tin định danh', complianceTarget = 'Nghị định 13/2023/NĐ-CP & ISO 27001 / SOC 2') {
    if (!techStackOrSystem || typeof techStackOrSystem !== 'string') {
      return { success: false, error: 'Thông tin hệ thống công nghệ không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc An Toàn Thông Tin & Chuyên Gia Bảo Mật Cấp Cao (Chief Information Security Officer - CISO & Data Protection Officer).
Hãy lập một Báo Cáo Đánh Giá An Ninh Mạng & Kế Hoạch Tuân Thủ Dữ Liệu Cá Nhân (Cybersecurity Audit & Data Privacy Compliance Roadmap) cho hệ thống sau:

HỆ THỐNG CÔNG NGHỆ / HẠ TẦNG:
"""
${techStackOrSystem}
"""
LOẠI HÌNH DỮ LIỆU THU THẬP: ${dataTypes}
TIÊU CHUẨN MỤC TIÊU: ${complianceTarget}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🔒 ĐÁNH GIÁ LỖ HỔNG AN NINH 4 LỚP (4-TIER SECURITY POSTURE):
   - An ninh mạng & Máy chủ (Network & Cloud Infrastructure: AWS/GCP, Firewall, DDoS, SSL/TLS 1.3)
   - An ninh Ứng dụng (Application Security: OWASP Top 10, SQL Injection, XSS, Rate Limiting)
   - Mã hóa Dữ liệu (Data-at-Rest AES-256 & Data-in-Transit, Quản lý khóa KMS)
   - Kiểm soát Truy cập (IAM, 2FA/MFA bắt buộc, Nguyên tắc đặc quyền tối thiểu Principle of Least Privilege)
2. 📋 CHECKLIST TUÂN THỦ NGHỊ ĐỊNH 13/2023/NĐ-CP VỀ BẢO VỆ DỮ LIỆU CÁ NHÂN:
   - Bản thỏa thuận đồng ý xử lý dữ liệu của người dùng (Data Processing Consent)
   - Đánh giá tác động xử lý dữ liệu cá nhân (DPIA) nộp Cục An ninh mạng (A05)
3. 🚨 KỊCH BẢN ỨNG PHÓ SỰ CỐ RÒ RỈ DỮ LIỆU TRONG 72 GIỜ (DATA BREACH PLAYBOOK):
   - Cách ly hệ thống, điều tra dấu vết, khắc phục lỗ hổng và thông báo cơ quan chức năng
4. 👥 CHÍNH SÁCH BẢO MẬT NỘI BỘ CHO TOÀN BỘ NHÂN VIÊN (INFOSEC EMPLOYEE POLICY)

Trình bày theo phong cách chuyên gia bảo mật quốc tế sắc sảo, thực tế, phòng ngừa triệt để nguy cơ tấn công mạng và rủi ro pháp lý.`;

    try {
      const { text: secText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        techStackOrSystem,
        complianceTarget,
        report: secText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const cybersecurityCompliance = new CybersecurityComplianceEngine();
