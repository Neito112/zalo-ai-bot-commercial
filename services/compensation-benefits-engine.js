import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Xây Dựng Cơ Chế Lương Thưởng 3P & Đãi Ngộ Toàn Diện (3P Compensation & Benefits Engine)
 */
export class CompensationBenefitsEngine {
  /**
   * Thiết lập hệ thống lương 3P (Position - Person - Performance), cơ cấu đãi ngộ Total Rewards và định chuẩn thị trường
   */
  async designCompensationScheme(jobRoles, companyStage = 'Tăng trưởng nhanh Scale-up / Doanh nghiệp vừa và nhỏ SMB', budgetConstraint = 'Tối ưu quỹ lương theo % doanh thu / P50 - P75 thị trường') {
    if (!jobRoles || typeof jobRoles !== 'string') {
      return { success: false, error: 'Thông tin vị trí và nhân sự không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Nhân Sự Cấp Cao & Chuyên Gia Thiết Kế Lương Thưởng Đãi Ngộ Toàn Diện (Chief Human Resources Officer - CHRO & Total Rewards Specialist).
Hãy lập một Đề Án Cơ Chế Lương Thưởng 3P & Gói Đãi Ngộ Thu Hút Nhân Tài (3P Compensation & Total Rewards Framework) cho doanh nghiệp sau:

DANH MỤC VỊ TRÍ / BỘ PHẬN TRỌNG YẾU:
"""
${jobRoles}
"""
GIAI ĐOẠN PHÁT TRIỂN DOANH NGHIỆP: ${companyStage}
NGÂN SÁCH / ĐỊNH HƯỚNG CẠNH TRANH LƯƠNG: ${budgetConstraint}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. ⚖️ CƠ CẤU HỆ THỐNG LƯƠNG 3P CHUẨN MỰC QUỐC TẾ:
   - P1 (Position): Lương theo cấp bậc vị trí & mức độ phức tạp công việc (Job Grading)
   - P2 (Person): Phụ cấp năng lực, thâm niên và kỹ năng chuyên môn đặc thù
   - P3 (Performance): Lương theo hiệu suất, KPI, hoa hồng kinh doanh và thưởng vượt chỉ tiêu
2. 🎁 GÓI ĐÃI NGỘ TOÀN DIỆN (TOTAL REWARDS ARCHITECTURE):
   - Thu nhập cố định (Fixed Base Pay & Allowances)
   - Thưởng ngắn hạn (Short-Term Incentives - STI: Thưởng tháng 13, KPI quý)
   - Đãi ngộ phi tài chính (Bảo hiểm sức khỏe cao cấp, chế độ làm việc linh hoạt, quỹ đào tạo)
3. 📊 ĐỐI SOÁT ĐỘ CẠNH TRANH THỊ TRƯỜNG (MARKET BENCHMARK: Phân vị P50 vs P75):
   - Đảm bảo công bằng nội bộ (Internal Equity) và cạnh tranh giữ chân nhân tài trước đối thủ
4. 📈 MÔ PHỎNG TÁC ĐỘNG QUỸ LƯƠNG & TỶ LỆ GIẢM THIỂU NGHỈ VIỆC (TURNOVER MITIGATION)

Trình bày theo phong cách chuyên gia nhân sự quốc tế hàng đầu của Mercer/Hay Group, minh bạch, tạo động lực bứt phá doanh số cho nhân viên và tối ưu ngân sách công ty.`;

    try {
      const { text: cbText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        jobRoles,
        companyStage,
        report: cbText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const compensationBenefits = new CompensationBenefitsEngine();
