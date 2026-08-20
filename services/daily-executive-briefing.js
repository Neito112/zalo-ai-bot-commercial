import { generateContentWithFailover } from '../ai-agent.js';
import { weatherIntelligence } from './weather-intelligence.js';
import { financialIntelligence } from './financial-intelligence.js';

/**
 * Động cơ Lập Bản Tin Điểm Tâm Điều Hành Đầu Ngày & Ma Trận Ưu Tiên (Daily Executive Briefing Engine)
 */
export class DailyExecutiveBriefingEngine {
  /**
   * Tổng hợp bản tin điều hành đầu ngày cho lãnh đạo
   */
  async generateBriefing(location = 'Hà Nội', scheduleNotes = '', unreadTasks = '') {
    // 1. Lấy dữ liệu thời tiết thực tế
    let weatherInfo = '';
    try {
      weatherInfo = await weatherIntelligence.getWeather(location);
    } catch (e) {}

    // 2. Lấy dữ liệu tỷ giá & thị trường tài chính
    let marketInfo = '';
    try {
      const btc = await financialIntelligence.getCryptoPrice('BTC');
      const fx = await financialIntelligence.getExchangeRates();
      marketInfo = `- Bitcoin (BTC): $${btc.price?.toLocaleString('en-US') || 'N/A'}\n- Tỷ giá USD/VND: ${fx.rates?.['USD/VND']?.toLocaleString('vi-VN') || '25,450'} đ`;
    } catch (e) {}

    const prompt = `Bạn là Trợ Lý Trưởng Điều Hành (Chief of Staff / Executive Assistant).
Hãy lập một Bản Tin Điểm Tâm Điều Hành Đầu Ngày (Daily Executive Briefing) sắc bén, truyền cảm hứng và rõ ràng nhất cho sếp.

DỮ LIỆU ĐẦU VÀO:
1. THỜI TIẾT TẠI ${location.toUpperCase()}:
${weatherInfo || 'Thời tiết nắng ráo, thuận lợi'}

2. THỊ TRƯỜNG TÀI CHÍNH:
${marketInfo || 'Thị trường ổn định'}

3. LỊCH TRÌNH & CUỘC HỌP TRONG NGÀY:
"""
${scheduleNotes || 'Không có cuộc họp cố định, tập trung vào công việc chiến lược.'}
"""

4. CÁC ĐẦU VIỆC TỒN ĐỌNG / NHIỆM VỤ CẦN XỬ LÝ:
"""
${unreadTasks || 'Xử lý các quyết định phê duyệt và kế hoạch kinh doanh.'}
"""

CẤU TRÚC BẢN TIN YÊU CẦU:
1. 🌅 LỜI CHÀO & TỔNG QUAN NGÀY MỚI (Thời tiết, lưu ý di chuyển & tình hình tài chính ngắn gọn)
2. 🎯 MA TRẬN ƯU TIÊN EISENHOWER:
   - 🔴 KHẨN CẤP & QUAN TRỌNG (Phải xử lý dứt điểm ngay trước 12h)
   - 🟡 QUAN TRỌNG NHƯNG KHÔNG GẤP (Dành thời gian tập trung buổi chiều)
   - 🔵 CÔNG VIỆC CẦN ỦY QUYỀN / GIAO ĐỘI NGŨ
3. ⏱️ LỘ TRÌNH THỜI GIAN BIỂU TỐI ƯU TRONG NGÀY
4. 💡 CÂU NÓI TRUYỀN CẢM HỨNG HÀNH ĐỘNG DÀNH CHO LÃNH ĐẠO

Trình bày theo phong cách sang trọng, súc tích, trực diện, giúp sếp nắm trọn ngày làm việc chỉ trong 60 giây đọc.`;

    try {
      const { text: briefingText } = await generateContentWithFailover(prompt);
      return {
        success: true,
        location,
        briefing: briefingText.trim()
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const dailyBriefingEngine = new DailyExecutiveBriefingEngine();
