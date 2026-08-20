import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Ma Trận Ra Quyết Định Chiến Lược & Mô Phỏng Kịch Bản Đối Kháng (Strategic Decision Matrix & War Game Engine)
 */
export class DecisionMatrixEngine {
  /**
   * Đánh giá lựa chọn chiến lược cấp cao theo ma trận đa tiêu chí MCDA và mô phỏng phản ứng của đối thủ
   */
  async evaluateStrategicDecision(decisionProblem, optionsText = 'Lựa chọn A vs Lựa chọn B vs Lựa chọn C', evaluationCriteria = 'Phù hợp chiến lược 30%, Tiềm năng tài chính 25%, Rủi ro thực thi 20%, Thời gian ra thị trường 15%, Nguồn lực 10%') {
    if (!decisionProblem || typeof decisionProblem !== 'string') {
      return { success: false, error: 'Vấn đề ra quyết định không hợp lệ.' };
    }

    const prompt = `Bạn là Cố Vấn Chiến Lược Cấp Cao Cho Hội Đồng Quản Trị & Chuyên Gia Lý Thuyết Trò Chơi (Chief Strategy Advisor & Game Theory War Game Specialist).
Hãy lập một Báo Cáo Phân Tích Ma Trận Quyết Định Chiến Lược (Multi-Criteria Strategic Decision Matrix & War Game Simulation) cho bài toán sau:

BÀI TOÁN QUYẾT ĐỊNH / TÌNH THẾ NAN GIẢI:
"""
${decisionProblem}
"""
CÁC PHƯƠNG ÁN LỰA CHỌN:
"""
${optionsText}
"""
TRỌNG SỐ TIÊU CHÍ: ${evaluationCriteria}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 📊 BẢNG MA TRẬN CHẤM ĐIỂM ĐA TIÊU CHÍ (MCDA SCORING MATRIX):
   - Chấm điểm từng phương án từ 1 đến 10 theo từng tiêu chí trọng số
   - Tổng điểm có trọng số (Weighted Total Score) & Xếp hạng phương án tối ưu
2. ♟️ MÔ PHỎNG ĐỐI KHÁNG CHIẾN TRANH THƯƠNG TRƯỜNG (WAR GAME SCENARIO SIMULATION):
   - Kịch bản thuận lợi (Bull Case & Phản ứng đối thủ)
   - Kịch bản cơ sở (Base Case)
   - Kịch bản Thiên nga đen / Rủi ro xấu nhất (Black Swan / Bear Case & Đòn phản công của đối thủ cạnh tranh)
3. 🛑 ĐIỂM DỪNG LỖ CHIẾN LƯỢC (STOP-LOSS TRIGGER POINTS & KILL CRITERIA):
   - Các chỉ số cảnh báo sớm (Red Flags) báo hiệu cần hủy bỏ hoặc chuyển hướng chiến lược ngay lập tức
4. 🏆 KHUYẾN NGHỊ DỨT KHOÁT DÀNH CHO CEO / CHỦ TỊCH HĐQT (EXECUTIVE VERDICT):
   - Lời khuyên hành động cụ thể, quyết đoán trong 30 ngày đầu tiên

Trình bày theo phong cách cố vấn quản trị tập đoàn McKinsey/BCG sắc sảo, logic chặt chẽ và hướng đến quyết định hành động ngay.`;

    try {
      const { text: matrixText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        decisionProblem,
        optionsText,
        report: matrixText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const decisionMatrix = new DecisionMatrixEngine();
