import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Tối Ưu Hóa Vận Hành Doanh Thu & Cơ Chế Thưởng Doanh Số (Enterprise RevOps & Sales Compensation Engine)
 */
export class RevopsCompensationEngine {
  /**
   * Thiết lập cơ chế lương thưởng kinh doanh biến đổi OTE/Commission Accelerators, phân bổ hạn ngạch Quota và hợp nhất vận hành RevOps
   */
  async optimizeRevopsCompensation(salesContext, roleProfile = 'Account Executives (AEs), Sales Development Reps (SDRs) & Customer Success Managers (CSMs)', quotaModel = 'Tỷ lệ Base/Variable 50/50 + Thưởng vượt hạn ngạch Accelerator 1.5x - 2.0x + Clawback 90 ngày') {
    if (!salesContext || typeof salesContext !== 'string') {
      return { success: false, error: 'Thông tin tổ chức kinh doanh không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Vận Hành Doanh Thu & Chuyên Gia Thiết Kế Cơ Chế Thưởng Kinh Doanh Toàn Cầu (VP of Revenue Operations & Sales Compensation Architect).
Hãy lập một Đề Án Tối Ưu Hóa Vận Hành Doanh Thu (RevOps) & Cơ Chế Thưởng Kinh Doanh Biến Đổi (Enterprise RevOps Strategy & Sales Incentive Plan - SIP) cho doanh nghiệp sau:

THÔNG TIN ĐỘI NGŨ KINH DOANH & MỤC TIÊU DOANH THU:
"""
${salesContext}
"""
CƠ CẤU VỊ TRÍ KINH DOANH: ${roleProfile}
MÔ HÌNH HẠN NGẠCH & THƯỞNG DỰ KIẾN: ${quotaModel}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 💼 CƠ CẤU THU NHẬP MỤC TIÊU OTE & TỶ LỆ LƯƠNG CỐ ĐỊNH / BIẾN ĐỔI (OTE & PAY MIX ARCHITECTURE):
   - Tỷ lệ Base/Variable chuẩn hóa theo từng vị trí (AE 50/50, SDR 70/30, CSM 80/20)
   - Bảng phân bổ hoa hồng theo từng nấc doanh số thực đạt (% Quota Attainment)
2. 🚀 CƠ CHẾ THƯỞNG VƯỢT HẠN NGẠCH & BẢO HIỂM RỦI RO (ACCELERATORS & CLAWBACK POLICIES):
   - Hệ số nhân thưởng lũy tiến vượt trội (Tier 1: 100-120% đạt 1.5x commission; Tier 2: >120% đạt 2.0x commission)
   - Điều khoản thu hồi hoa hồng (Clawback Policy) nếu khách hàng hủy hợp đồng trong vòng 60-90 ngày đầu
3. 🗺️ PHÂN BỔ ĐỊA BÀN & DUNG LƯỢNG HẠN NGẠCH BÁN HÀNG (TERRITORY PLANNING & CAPACITY MODEL):
   - Phương pháp phân chia hạn ngạch (Top-down quota allocation 4x-5x OTE)
   - Phân bổ tài khoản trọng điểm (Named Strategic Accounts vs Inbound SMB)
4. 📈 THỐNG NHẤT HẠ TẦNG REVOPS & PHƯƠNG TRÌNH VẬN TỐC BÁN HÀNG (SALES VELOCITY & FUNNEL INTEGRATION)

Trình bày theo phong cách chuyên gia RevOps đẳng cấp thế giới (Salesforce, Winning by Design), chuẩn mực tài chính, thúc đẩy tối đa động lực đội ngũ và bảo vệ tỷ suất lợi nhuận biên cho doanh nghiệp.`;

    try {
      const { text: revText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        salesContext,
        roleProfile,
        report: revText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const revopsCompensation = new RevopsCompensationEngine();
