/**
 * Động Cơ Tự Phục Hồi Tham Số & Tự Chữa Lành Công Cụ (Schema Self-Healing Engine)
 * Tự động sửa lỗi sai kiểu dữ liệu, thiếu tham số và phục hồi khi gọi công cụ MCP/Workspace
 */
export class ToolSelfHealingEngine {
  constructor() {
    this.repairHistory = [];
  }

  /**
   * Tự động làm sạch và ép kiểu tham số trước khi truyền vào công cụ
   */
  sanitizeAndCoerceArguments(toolName, rawArgs = {}) {
    if (!rawArgs || typeof rawArgs !== 'object') return {};

    const cleanArgs = { ...rawArgs };

    // 1. Coerce number strings
    for (const key of Object.keys(cleanArgs)) {
      const val = cleanArgs[key];
      if (typeof val === 'string') {
        if (/^-?\d+$/.test(val.trim())) {
          cleanArgs[key] = parseInt(val.trim(), 10);
        } else if (/^-?\d+\.\d+$/.test(val.trim())) {
          cleanArgs[key] = parseFloat(val.trim());
        } else if (val.toLowerCase() === 'true') {
          cleanArgs[key] = true;
        } else if (val.toLowerCase() === 'false') {
          cleanArgs[key] = false;
        }
      }
    }

    // 2. Tool-specific parameter healing
    if (toolName === 'search_web' && !cleanArgs.query) {
      cleanArgs.query = cleanArgs.q || cleanArgs.keyword || cleanArgs.text || '';
    }

    if (toolName === 'fetch_url' && !cleanArgs.url) {
      cleanArgs.url = cleanArgs.link || cleanArgs.href || '';
    }

    if (toolName === 'generate_image' && !cleanArgs.prompt) {
      cleanArgs.prompt = cleanArgs.text || cleanArgs.description || '';
    }

    if (toolName === 'synthesize_speech' && !cleanArgs.text) {
      cleanArgs.text = cleanArgs.prompt || cleanArgs.speech || '';
    }

    if (toolName === 'schedule_background_task') {
      if (!cleanArgs.name) cleanArgs.name = 'Tác vụ ngầm tự động';
      if (!cleanArgs.schedule) cleanArgs.schedule = '0 8 * * *'; // Mặc định 8h sáng hàng ngày
    }

    return cleanArgs;
  }

  /**
   * Tự phục hồi và thực thi an toàn với cơ chế retry tự động
   */
  async executeWithSelfHealing(toolName, rawArgs, executorFn) {
    const coercedArgs = this.sanitizeAndCoerceArguments(toolName, rawArgs);

    try {
      // Lần chạy 1: Với tham số đã được chuẩn hóa
      return await executorFn(toolName, coercedArgs);
    } catch (primaryError) {
      console.warn(`⚠️ [TOOL SELF-HEALING] Công cụ ${toolName} gặp lỗi lần 1: ${primaryError.message}. Đang kích hoạt tự phục hồi...`);

      try {
        // Lần chạy 2: Phục hồi tham số mở rộng
        const fallbackArgs = { ...coercedArgs };
        if (toolName === 'search_web' && typeof fallbackArgs.query === 'string') {
          fallbackArgs.query = fallbackArgs.query.replace(/[^\w\s\u00C0-\u1EF9]/g, ' ').trim();
        }

        const healedResult = await executorFn(toolName, fallbackArgs);
        this.repairHistory.push({
          tool: toolName,
          originalArgs: rawArgs,
          healedArgs: fallbackArgs,
          error: primaryError.message,
          timestamp: new Date().toISOString()
        });
        console.log(`✅ [TOOL SELF-HEALING] Tự chữa lành thành công công cụ ${toolName}!`);
        return healedResult;
      } catch (secondaryError) {
        throw new Error(`[Lỗi thực thi công cụ ${toolName} sau khi tự phục hồi]: ${secondaryError.message}`);
      }
    }
  }
}

export const toolSelfHealing = new ToolSelfHealingEngine();
