import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Kế Hoạch Kinh Doanh Liên Tục & Ứng Phó Thảm Họa (Business Continuity & Disaster Recovery Engine - BCP/DRP)
 */
export class BcpDisasterRecoveryEngine {
  /**
   * Thiết lập kế hoạch kinh doanh liên tục BCP chuẩn ISO 22301, xác định RTO/RPO và quy trình phòng chống khủng hoảng tê liệt
   */
  async planBusinessContinuity(businessContext, criticalOperations = 'Hệ thống máy chủ/ERP, Dây chuyền sản xuất, Tài khoản ngân hàng, Dữ liệu khách hàng', disasterScenario = 'Tấn công mã độc tống tiền Ransomware / Mất điện toàn bộ Data Center / Sự cố cháy nổ nhà xưởng') {
    if (!businessContext || typeof businessContext !== 'string') {
      return { success: false, error: 'Thông tin hoạt động doanh nghiệp không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Quản Trị Rủi Ro Khủng Hoảng & Phục Hồi Thảm Họa Cấp Cao (Chief Risk Officer - CRO & Master Business Continuity Planner - MBCP).
Hãy lập một Kế Hoạch Kinh Doanh Liên Tục & Phục Hồi Thảm Họa Toàn Diện (Business Continuity Plan - BCP & Disaster Recovery Plan - DRP chuẩn ISO 22301) cho doanh nghiệp sau:

THÔNG TIN DOANH NGHIỆP & MÔ HÌNH VẬN HÀNH:
"""
${businessContext}
"""
CÁC HỆ THỐNG / BỘ PHẬN TRỌNG YẾU (TIER-1 CRITICAL ASSETS): ${criticalOperations}
KỊCH BẢN THẢM HỌA GIẢ ĐỊNH: ${disasterScenario}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. ⏱️ PHÂN TÍCH TÁC ĐỘNG KINH DOANH & HẠN MỨC PHỤC HỒI (BUSINESS IMPACT ANALYSIS - BIA):
   - Thời gian gián đoạn tối đa chấp nhận được (Maximum Tolerable Downtime - MTD)
   - Mục tiêu thời gian phục hồi (Recovery Time Objective - RTO) cho từng hệ thống
   - Mục tiêu điểm phục hồi dữ liệu (Recovery Point Objective - RPO: Mức tổn thất dữ liệu tối đa chấp nhận được)
2. 🚨 QUY TRÌNH PHÒNG TÁC CHIẾN & CHUỖI MỆNH LỆNH CHỈ HUY (CRISIS MANAGEMENT TEAM - CMT CHAIN OF COMMAND):
   - Phân quyền chỉ huy thay thế khi lãnh đạo cấp cao vắng mặt
   - Kênh liên lạc dự phòng khẩn cấp ngoài mạng nội bộ
3. 🔄 PHƯƠNG ÁN VẬN HÀNH DỰ PHÒNG THAY THẾ (FAILOVER & ALTERNATE OPERATIONS):
   - Cơ chế kích hoạt hạ tầng Cloud dự phòng (Hot/Warm Site Failover)
   - Phương án duy trì bán hàng và vận hành thủ công tối thiểu (Manual Fallback Playbook)
4. 🧪 KỊCH BẢN DIỄN TẬP BẢO TOÀN DOANH NGHIỆP ĐỊNH KỲ (ANNUAL DRILL SIMULATION & AUDIT)

Trình bày theo phong cách chuyên gia quản trị thảm họa hàng đầu thế giới, bảo đảm doanh nghiệp không bao giờ sụp đổ trước các cú sốc bất khả kháng.`;

    try {
      const { text: bcpText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        businessContext,
        criticalOperations,
        report: bcpText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const bcpDisasterRecovery = new BcpDisasterRecoveryEngine();
