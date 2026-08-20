import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Thử Tải Dòng Tiền & Tối Ưu Vốn Lưu Động (Cash Flow Runway & Working Capital Engine)
 */
export class CashFlowRunwayEngine {
  /**
   * Thử tải dòng tiền dưới các kịch bản khắc nghiệt và tính toán số tháng sống sót (Runway)
   */
  async stressTestRunway(cashContext, currentCash = '1 tỷ VND', monthlyBurnRate = '100 triệu VND') {
    if (!cashContext || typeof cashContext !== 'string') {
      return { success: false, error: 'Dữ liệu dòng tiền không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Tài Chính Cấp Cao & Chuyên Gia Quản Trị Dòng Tiền Khủng Hoảng (Fractional CFO & Cash Management Specialist).
Hãy lập một Báo Cáo Thử Tải Dòng Tiền & Tối Ưu Vốn Lưu Động (Cash Flow Stress Test & Runway Report) cho doanh nghiệp sau:

BỐI CẢNH DÒNG TIỀN & HOẠT ĐỘNG:
"""
${cashContext}
"""
TIỀN MẶT HIỆN CÓ: ${currentCash}
TỐC ĐỘ ĐỐT TIỀN HÀNG THÁNG (NET BURN RATE): ${monthlyBurnRate}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. ⏱️ DỰ BÁO SỐ THÁNG SỐNG SÓT (RUNWAY MONTHS) DƯỚI 3 KỊCH BẢN:
   - Kịch bản Tốt (Base/Growth Case): Doanh thu tăng trưởng bình thường
   - Kịch bản Trung bình (Flat Case): Doanh thu đi ngang, chi phí cố định
   - Kịch bản Xấu nhất (Worst Case / Black Swan): Doanh thu sụt giảm 50%, công nợ chậm trả
2. 🔄 TỐI ƯU HÓA CHU KỲ CHUYỂN ĐỔI TIỀN MẶT (CASH CONVERSION CYCLE - CCC):
   - Ngày thu hồi công nợ khách hàng (DSO) -> Chiến lược thu hồi tiền mặt sớm
   - Ngày tồn kho (DIO) -> Xử lý hàng tồn giải phóng vốn
   - Ngày trả nợ nhà cung cấp (DPO) -> Kéo dài công nợ an toàn
3. 🚨 3 ĐÒN BẨY CẮT GIẢM TỐC ĐỘ ĐỐT TIỀN KHẨN CẤP (BURN RATE REDUCTION)
4. 💡 ĐỀ XUẤT NGUỒN VỐN BỔ SUNG & BẢO HIỂM THANH KHOẢN DÀNH CHO CEO

Trình bày theo phong cách tài chính chuẩn mực, sắc sảo, giúp chủ doanh nghiệp kiểm soát tuyệt đối sự an toàn của dòng máu tài chính.`;

    try {
      const { text: runwayText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        currentCash,
        monthlyBurnRate,
        report: runwayText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const cashFlowRunway = new CashFlowRunwayEngine();
