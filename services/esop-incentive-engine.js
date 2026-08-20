import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Thiết Kế Quy Chế Cổ Phần Thưởng ESOP & Giữ Chân Nhân Tài (ESOP & Talent Incentive Engine)
 */
export class EsopIncentiveEngine {
  /**
   * Thiết lập quy chế phát hành cổ phần thưởng ESOP / Quyền chọn cổ phiếu cho nhân sự chủ chốt
   */
  async designEsopPlan(companyStage, esopPoolSize = '10% vốn điều lệ', vestingSchedule = '4 năm (1 năm Cliff, 25%/năm)') {
    if (!companyStage || typeof companyStage !== 'string') {
      return { success: false, error: 'Giai đoạn phát triển của công ty không hợp lệ.' };
    }

    const prompt = `Bạn là Chuyên Gia Cố Vấn Nhân Sự Cấp Cao & Luật Sư Quản Trị Cổ Phần (Chief People Officer & Equity Compensation Counsel).
Hãy thiết lập một Quy Chế Phát Hành Cổ Phần Thưởng Cho Người Lao Động (Employee Stock Ownership Plan - ESOP & Equity Incentive Plan) cho doanh nghiệp sau:

GIAI ĐOẠN PHÁT TRIỂN / MÔ HÌNH:
"""
${companyStage}
"""
QUY MÔ QUỸ ESOP DỰ KIẾN: ${esopPoolSize}
LỘ TRÌNH TRAO QUYỀN (VESTING SCHEDULE): ${vestingSchedule}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 💎 CẤU TRÚC CƠ CHẾ ESOP (LOẠI HÌNH: CỔ PHẦN THẬT, QUYỀN CHỌN STOCK OPTIONS HAY PHANTOM STOCKS):
   - Quy mô quỹ ESOP & Giá phát hành (Mệnh giá 10,000đ hay Giá trị thị trường chiết khấu)
   - Lộ trình trao quyền (Vesting Schedule) & Thời gian thử thách (Cliff Period)
   - Điều kiện đạt KPI / Cột mốc hiệu suất (Performance Milestones)
2. 👥 TIÊU CHÍ LỰA CHỌN ĐỐI TƯỢNG ĐƯỢC CẤP ESOP (ELIGIBILITY & ALLOCATION MATRIX):
   - Nhóm C-Level / Ban Giám Đốc (40-50% quỹ)
   - Nhóm Trưởng bộ phận / Quản lý chủ chốt (30-40% quỹ)
   - Nhóm Nhân sự xuất sắc (Top Performers 10-20% quỹ)
3. ⚖️ 3 ĐIỀU KHOẢN RÀNG BUỘC PHÁP LÝ & BẢO VỆ DOANH NGHIỆP:
   - Điều khoản Thu hồi cổ phần khi nhân sự nghỉ việc (Good Leaver vs Bad Leaver Clawback)
   - Quyền biểu quyết (Giao Chủ Tịch HĐQT đại diện biểu quyết ủy quyền)
   - Điều khoản Hạn chế chuyển nhượng (Lock-up Period) & Quyền mua lại của công ty
4. 💡 CHIẾN LƯỢC TRUYỀN THÔNG NỘI BỘ TẠO ĐỘNG LỰC DÀNH CHO CEO

Trình bày theo phong cách chuyên nghiệp, chặt chẽ về pháp lý, giúp ban lãnh đạo gắn kết chặt chẽ lợi ích của nhân tài với sự tăng trưởng vượt bậc của công ty.`;

    try {
      const { text: esopText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        companyStage,
        esopPoolSize,
        report: esopText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const esopIncentive = new EsopIncentiveEngine();
