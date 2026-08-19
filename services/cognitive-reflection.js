import fs from 'fs';
import path from 'path';

const EVOLUTION_FILE = path.resolve('evolution-log.json');

export class CognitiveReflectionEngine {
  constructor() {
    this.roboticPatterns = [
      /em đã hoàn thành xử lý/i,
      /tôi là một mô hình ngôn ngữ/i,
      /với tư cách là một ai/i,
      /theo như tôi được lập trình/i,
      /kính gửi quý khách/i,
      /chúc bạn một ngày tốt lành nhé!/i
    ];
  }

  /**
   * Đánh giá chất lượng và sự tự nhiên của câu trả lời trước khi gửi đi
   */
  evaluateQuality(responseText) {
    if (!responseText || typeof responseText !== 'string') {
      return { isHumanLike: false, score: 0, reason: 'Nội dung rỗng' };
    }

    // Kiểm tra mẫu câu robot
    for (const pattern of this.roboticPatterns) {
      if (pattern.test(responseText)) {
        return {
          isHumanLike: false,
          score: 30,
          reason: `Phát hiện câu mẫu dập khuôn: ${pattern.toString()}`
        };
      }
    }

    // Kiểm tra độ dài & cảm xúc
    let score = 85;
    if (responseText.length > 20) score += 10;
    if (responseText.includes('?') || responseText.includes('!')) score += 5;

    return {
      isHumanLike: true,
      score,
      reason: 'Phản hồi tự nhiên, sắc bén và giàu cảm xúc'
    };
  }

  /**
   * Tự động làm sạch và tinh chỉnh câu từ nếu có dấu hiệu máy móc
   */
  sanitizeResponse(responseText, senderName = 'bạn') {
    if (!responseText || typeof responseText !== 'string') return '';
    let clean = responseText;

    // Loại bỏ khối JSON tool dư thừa nếu có
    clean = clean.replace(/\{[\s\S]*?"tool"[\s\S]*?\}/g, '').trim();

    // Loại bỏ các mẫu câu sến sẩm, lúng túng hoặc giả đò
    clean = clean.replace(/sếp thông cảm cho sự "hậu đậu" đáng yêu.*?\n*/gi, '');
    clean = clean.replace(/chờ em một xíu nghen.*?\n*/gi, '');
    clean = clean.replace(/tay chân thế nào lại gõ nhầm.*?\n*/gi, '');

    return clean.trim();
  }

  /**
   * Ghi nhận tiến trình tiến hóa tư duy vào nhật ký
   */
  logEvolution(entry) {
    try {
      let logs = [];
      if (fs.existsSync(EVOLUTION_FILE)) {
        logs = JSON.parse(fs.readFileSync(EVOLUTION_FILE, 'utf-8'));
      }
      logs.push({
        timestamp: new Date().toISOString(),
        ...entry
      });
      if (logs.length > 100) logs = logs.slice(-100);
      fs.writeFileSync(EVOLUTION_FILE, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (e) {
      console.warn('Lỗi ghi nhật ký tiến hóa:', e.message);
    }
  }
}

export const cognitiveReflection = new CognitiveReflectionEngine();
