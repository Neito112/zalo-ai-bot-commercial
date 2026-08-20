import { generateContentWithFailover } from '../ai-agent.js';

/**
 * Động cơ Lập Kế Hoạch Dự Án WBS & Phân Bổ Sprint (Project WBS & Sprint Planner)
 */
export class ProjectPlannerEngine {
  /**
   * Phân rã mục tiêu dự án thành cấu trúc WBS và kế hoạch Sprint chi tiết
   */
  async generateProjectPlan(projectGoal, durationWeeks = 4, teamSize = 3) {
    if (!projectGoal || typeof projectGoal !== 'string') {
      return { success: false, error: 'Mục tiêu dự án không hợp lệ.' };
    }

    const prompt = `Bạn là Giám Đốc Quản Lý Dự Án (Senior Project Manager / PMP / Scrum Master).
Hãy phân rã và lập một Kế Hoạch Dự Án Chi Tiết (Project Management Plan & WBS) chuẩn mực cho mục tiêu sau:

MỤC TIÊU DỰ ÁN: "${projectGoal}"
THỜI GIAN THỰC HIỆN DỰ KIẾN: ${durationWeeks} tuần
QUY MÔ ĐỘI NGŨ: ${teamSize} nhân sự

CẤU TRÚC KẾ HOẠCH YÊU CẦU:
1. 🎯 TỔNG QUAN PHẠM VI DỰ ÁN (SCOPE & DELIVERABLES)
2. 🏗️ CẤU TRÚC PHÂN RÃ CÔNG VIỆC WBS (WORK BREAKDOWN STRUCTURE):
   - Phân cấp Phase 1, Phase 2, Phase 3 với các đầu việc con rõ ràng
3. ⏱️ KẾ HOẠCH SPRINT & LỘ TRÌNH MILESTONES (Phân chia công việc theo từng tuần/Sprint kèm kết quả bàn giao)
4. 👥 PHÂN BỔ NHÂN LỰC & TRÁCH NHIỆM (Resource Allocation & RACI Matrix)
5. 🛡️ QUẢN TRỊ RỦI RO & PHƯƠNG ÁN DỰ PHÒNG (Risk Mitigation Plan)

Trình bày theo phong cách sắc bén, chuyên nghiệp, logic và có tính khả thi triển khai ngay lập tức.`;

    try {
      const { text: planText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        projectGoal,
        durationWeeks,
        plan: planText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const projectPlanner = new ProjectPlannerEngine();
