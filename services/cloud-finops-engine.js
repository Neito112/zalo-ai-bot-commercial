import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Thẩm Định Cơ Cấu Chi Phí Đám Mây & Tối Ưu Hóa FinOps (Enterprise Cloud FinOps & Infrastructure Optimization Engine)
 */
export class CloudFinopsEngine {
  /**
   * Phân tích hóa đơn đám mây (AWS, GCP, Azure), tối ưu hóa kiến trúc hạ tầng FinOps, phát hiện lãng phí tài nguyên và cam kết tiết kiệm chi phí Reserved Instances / Savings Plans
   */
  async auditCloudFinops(cloudContext, currentSpend = '$15,000 - $50,000 / tháng trên AWS & Google Cloud', targetReduction = 'Cắt giảm 25% - 40% chi phí điện toán đám mây lãng phí mà không ảnh hưởng hiệu năng hệ thống') {
    if (!cloudContext || typeof cloudContext !== 'string') {
      return { success: false, error: 'Thông tin hạ tầng đám mây không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Công Nghệ & Chuyên Gia Tối Ưu Hóa Chi Phí Đám Mây Toàn Cầu (VP of Cloud Infrastructure & Certified FinOps Practitioner).
Hãy lập một Báo Cáo Kiểm Toán FinOps & Đề Án Tối Ưu Hóa Chi Phí Hạ Tầng Đám Mây (Enterprise Cloud FinOps & Cost Optimization Playbook) cho hệ thống sau:

THÔNG TIN HẠ TẦNG CLOUD & KIẾN TRÚC HỆ THỐNG:
"""
${cloudContext}
"""
CHI PHÍ HIỆN TẠI (CURRENT CLOUD SPEND): ${currentSpend}
MỤC TIÊU TIẾT GIẢM (SAVINGS TARGET): ${targetReduction}

CẤU TRÚC BÁO CÁO YÊU CẦU:
1. 🔍 RÀ SOÁT TÀI NGUYÊN VÀ PHÁT HIỆN ĐIỂM LÃNG PHÍ (CLOUD WASTE & IDLE RESOURCE DETECTION):
   - Máy chủ ảo và cơ sở dữ liệu không sử dụng hoặc cấu hình quá tải (Unattached EBS, Idle EC2/VMs, Overprovisioned RDS)
   - Chi phí truyền tải dữ liệu ẩn (Cross-AZ / Cross-Region Egress Traffic & NAT Gateway Costs)
2. ⚙️ TỐI ƯU HÓA HẠ TẦNG & TỰ ĐỘNG CO GIÃN THÔNG MINH (RIGHTSIZING & AUTOSCALING STRATEGY):
   - Điều chỉnh cấu hình tài nguyên đúng nhu cầu thực (Compute & Memory Rightsizing)
   - Tận dụng máy chủ dự phòng giá rẻ (Spot Instances / Preemptible VMs) cho các tác vụ phi thời gian thực và phân tích dữ liệu AI
3. 💰 CHIẾN LƯỢC CAM KẾT SỬ DỤNG DÀI HẠN (RESERVED INSTANCES & SAVINGS PLANS):
   - Mô hình hóa cam kết 1 năm hoặc 3 năm (Compute Savings Plans) để đạt mức chiết khấu 30% - 60%
   - Chính sách phân bổ chi phí minh bạch theo từng bộ phận và phòng ban (Tagging Strategy & Cost Allocation)
4. 📈 BẢNG ĐIỀU KHIỂN GIÁM SÁT FINOPS VÀ CẢNH BÁO BÙNG PHÁT CHI PHÍ (FINOPS UNIT METRICS & ANOMALY ALERTS)

Trình bày theo phong cách chuyên gia FinOps hàng đầu thế giới (FinOps Foundation / CloudHealth), sắc sảo, tính toán ROI rõ ràng và mang lại dòng tiết kiệm thực tế cho doanh nghiệp ngay trong 30 ngày.`;

    try {
      const { text: foText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        cloudContext,
        currentSpend,
        report: foText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const cloudFinops = new CloudFinopsEngine();
