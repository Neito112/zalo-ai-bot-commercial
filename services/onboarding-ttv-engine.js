import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Tối Ưu Hóa Trải Nghiệm Khởi Động & Rút Ngắn Thời Gian Nhận Giá Trị (Customer Onboarding & Time-to-Value Acceleration Engine)
 */
export class OnboardingTtvEngine {
  /**
   * Thiết lập quy trình Onboarding khách hàng B2B/SaaS, kích hoạt khoảnh khắc Aha! Moment và rút ngắn Time-to-Value (TTV)
   */
  async accelerateCustomerOnboarding(productContext, targetSegment = 'Khách hàng Self-serve B2C/SMB vs Khách hàng High-touch Enterprise', currentTtv = 'Thời gian nhận giá trị hiện tại 7 - 14 ngày cần rút ngắn xuống < 48 giờ') {
    if (!productContext || typeof productContext !== 'string') {
      return { success: false, error: 'Thông tin giải pháp sản phẩm không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Tăng Trưởng Khách Hàng & Chuyên Gia Tối Ưu Hóa Trải Nghiệm Sản Phẩm (Chief Growth Officer & Product-Led Onboarding Architect).
Hãy lập một Đề Án Tối Ưu Hóa Quy Trình Onboarding & Rút Ngắn Thời Gian Nhận Giá Trị (Customer Onboarding & Time-to-Value Acceleration Strategy) cho sản phẩm sau:

THÔNG TIN SẢN PHẨM & MÔ HÌNH DỊCH VỤ:
"""
${productContext}
"""
PHÂN KHÚC KHÁCH HÀNG MỤC TIÊU: ${targetSegment}
MỤC TIÊU RÚT NGẮN TIME-TO-VALUE (TTV): ${currentTtv}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. ⚡ HÀNH TRÌNH 3 BƯỚC CHẠM ĐẾN KHOẢNH KHẮC "AHA! MOMENT":
   - Bước 1 (Setup): Tinh gọn biểu mẫu đăng ký, loại bỏ ma sát (Frictionless Signup & SSO)
   - Bước 2 (Aha! Moment): Kích hoạt khoảnh khắc khách hàng nhận thấy giá trị vượt trội trong < 15 phút đầu tiên
   - Bước 3 (Habit Formation): Thiết lập thói quen sử dụng hàng ngày thông qua cơ chế nhắc nhở thông minh
2. 📋 THIẾT KẾ GIAO DIỆN HƯỚNG DẪN TƯƠNG TÁC (IN-APP GUIDED TOURS & PROGRESS CHECKLISTS):
   - Danh sách công việc khởi đầu (Interactive Setup Checklist với thanh tiến độ %)
   - Dữ liệu mẫu nạp sẵn (Pre-loaded Sample Templates) giúp khách hàng không bị bỡ ngỡ với màn hình trống (Empty State)
3. 🤝 MÔ HÌNH PHỐI HỢP LAI HIGH-TOUCH & LOW-TOUCH CHO DOANH NGHIỆP LỚN (ENTERPRISE 30-DAY SUCCESS PLAN):
   - Kế hoạch chuyển giao 30 ngày đầu do chuyên viên CSM & Kỹ sư giải pháp (Solutions Architect) đồng hành
   - Các cột mốc đánh giá bàn giao kỹ thuật (Technical Go-Live Criteria)
4. 🚦 CHỈ SỐ THEO DÕI TỶ LỆ RƠI RỤNG VÀ CẢNH BÁO SỚM (ONBOARDING DROP-OFF DIAGNOSTICS & RETENTION KPI)

Trình bày theo phong cách chuyên gia tăng trưởng Product-Led Growth (Reforge / OpenView), mạch lạc, dễ thực thi và mang lại bước nhảy vọt về tỷ lệ kích hoạt khách hàng (Activation Rate).`;

    try {
      const { text: ttvText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        productContext,
        targetSegment,
        report: ttvText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const onboardingTtv = new OnboardingTtvEngine();
