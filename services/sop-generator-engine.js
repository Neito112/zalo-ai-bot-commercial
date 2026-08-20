import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Xây Dựng Quy Trình Vận Hành Tiêu Chuẩn SOP & Tối Ưu Hóa Luồng Công Việc (SOP & Workflow Engine)
 */
export class SopGeneratorEngine {
  /**
   * Thiết lập quy trình vận hành tiêu chuẩn SOP chi tiết cho doanh nghiệp
   */
  async generateSop(processTitle, department = 'Vận hành / Kinh doanh', scope = 'Toàn công ty') {
    if (!processTitle || typeof processTitle !== 'string') {
      return { success: false, error: 'Tên quy trình không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Vận Hành (Chief Operating Officer - COO) & Chuyên Gia Tối Ưu Hóa Quy Trình Chuẩn Quốc Tế (ISO / Lean Six Sigma).
Hãy thiết lập một Quy Trình Vận Hành Tiêu Chuẩn (Standard Operating Procedure - SOP) chuẩn mực, khoa học và chặt chẽ cho quy trình sau:

TÊN QUY TRÌNH: "${processTitle}"
PHÒNG BAN ÁP DỤNG: ${department}
PHẠM VI ÁP DỤNG: ${scope}

CẤU TRÚC QUY TRÌNH SOP YÊU CẦU:
1. 🎯 MỤC ĐÍCH & PHẠM VI ÁP DỤNG (PURPOSE & SCOPE)
2. 👥 ĐỐI TƯỢNG ÁP DỤNG & PHÂN ĐỊNH TRÁCH NHIỆM (RACI MATRIX):
   - Người thực hiện (Responsible)
   - Người phê duyệt (Accountable)
   - Người tham vấn (Consulted)
   - Người nhận thông tin (Informed)
3. 📋 ĐIỀU KIỆN ĐẦU VÀO & TIÊU CHUẨN ĐẦU RA (INPUTS / OUTPUTS CHECKLIST)
4. ⚙️ CÁC BƯỚC THỰC HIỆN CHI TIẾT (STEP-BY-STEP WORKFLOW):
   - Bước 1: [Tên bước] -> [Hành động cụ thể] -> [Biểu mẫu/Công cụ sử dụng] -> [Thời gian hoàn thành (SLA)]
   - Bước 2: ...
   - Bước 3: ...
5. ⚠️ XỬ LÝ NGOẠI LỆ & RỦI RO PHÁT SINH (EXCEPTION HANDLING)
6. 📊 CHỈ SỐ KPI ĐO LƯỜNG CHẤT LƯỢNG QUY TRÌNH

Trình bày theo phong cách mạch lạc, có thể in thành tài liệu ban hành nội bộ áp dụng ngay lập tức.`;

    try {
      const { text: sopText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        processTitle,
        department,
        sop: sopText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const sopGenerator = new SopGeneratorEngine();
