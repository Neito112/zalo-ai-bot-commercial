import { searchWeb } from './web-research.js';
import { generateContentWithFailover, agentEvents } from '../ai-agent.js';
import fs from 'fs';
import path from 'path';

const SUBSCRIBERS_FILE = path.resolve('active-subscribers.json');

export class AutonomousProactiveScout {
  constructor() {
    this.isRoaming = false;
    this.scoutTimer = null;
    this.roamIntervalMinutes = 15; // Mỗi 15 phút đi tuần tra mạng 1 lần
    this.subscribers = this.loadSubscribers();
    this.messageSenderCallback = null;
    this.scoutTopics = [
      'tin tức công nghệ trí tuệ nhân tạo AI hôm nay',
      'phát minh khoa học công nghệ mới nhất thế giới',
      'thị trường tài chính kinh tế và công nghệ Việt Nam',
      'công cụ AI đột phá hỗ trợ công việc và lập trình'
    ];
  }

  setSender(fn) {
    this.messageSenderCallback = fn;
  }

  loadSubscribers() {
    try {
      if (fs.existsSync(SUBSCRIBERS_FILE)) {
        return JSON.parse(fs.readFileSync(SUBSCRIBERS_FILE, 'utf-8'));
      }
    } catch (e) {}
    return {};
  }

  saveSubscribers() {
    try {
      fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(this.subscribers, null, 2), 'utf-8');
    } catch (e) {}
  }

  registerSubscriber(chatId, senderName, preferences = []) {
    this.subscribers[chatId] = {
      chatId,
      senderName,
      lastInteraction: new Date().toISOString(),
      preferences
    };
    this.saveSubscribers();
  }

  startRoaming(intervalMinutes = 15) {
    if (this.isRoaming) return;
    this.isRoaming = true;
    this.roamIntervalMinutes = intervalMinutes;
    console.log(`🌐 [AUTONOMOUS SCOUT] Trình thám hiểm & lang thang mạng tự chủ ĐÃ BẬT (Chu kỳ: ${intervalMinutes} phút)!`);

    // Chạy chu kỳ đầu tiên sau 30s
    setTimeout(() => this.runSingleRoamCycle(), 30000);

    this.scoutTimer = setInterval(() => {
      if (this.isRoaming) {
        this.runSingleRoamCycle();
      }
    }, this.roamIntervalMinutes * 60 * 1000);
  }

  stopRoaming() {
    this.isRoaming = false;
    if (this.scoutTimer) {
      clearInterval(this.scoutTimer);
      this.scoutTimer = null;
    }
    console.log(`🛑 [AUTONOMOUS SCOUT] Trình thám hiểm mạng đã tạm dừng.`);
  }

  /**
   * Một chu kỳ tự giác đi tuần tra mạng, phân tích thông tin giá trị
   */
  async runSingleRoamCycle() {
    const topic = this.scoutTopics[Math.floor(Math.random() * this.scoutTopics.length)];
    console.log(`🧭 [AUTONOMOUS SCOUT] Đang tự giác lang thang tìm kiếm thông tin về: "${topic}"...`);

    try {
      const searchResults = await searchWeb(topic);
      if (!searchResults || searchResults.length < 50) return;

      const prompt = `Bạn là một Trợ lý AI thám hiểm mạng thông minh. Hãy đọc các thông tin vừa tra cứu trên Internet về chủ đề "${topic}":
${searchResults.slice(0, 1500)}

NHIỆM VỤ:
1. Đánh giá xem có tin tức/phát hiện nào CỰC KỲ ĐẶC SẮC, GIÁ TRỊ VÀ HỮU ÍCH cho người dùng không.
2. Nếu có, hãy viết 1 bản tóm tắt ngắn gọn, sâu sắc và duyên dáng (dưới 120 từ) như một người bạn chia sẻ tin hay.
3. Trả về JSON:
{
  "isValuable": true|false,
  "headline": "Tiêu đề tin nổi bật",
  "briefing": "Nội dung tóm tắt duyên dáng, súc tích"
}`;

      const { text: responseText } = await generateContentWithFailover(prompt);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        if (data.isValuable && data.briefing) {
          console.log(`✨ [SCOUT DISCOVERY] Tìm thấy tin giá trị: "${data.headline}"`);
          agentEvents.emit('scout_discovery', data);

          // Tự động nạp tin tức giá trị vào Đồ thị tri thức (Graph Memory)
          try {
            const { graphMemory } = await import('./graph-memory-engine.js');
            graphMemory.upsertNode(data.headline, 'SCOUT_INSIGHT', { briefing: data.briefing, topic });
            graphMemory.addRelation(topic, 'PHÁT_HIỆN_MỚI', data.headline);
          } catch (e) {}

          // Chủ động thông báo cho các người dùng đang đăng ký nhận tin (nếu có)
          const activeChatIds = Object.keys(this.subscribers);
          for (const chatId of activeChatIds) {
            const sub = this.subscribers[chatId];
            if (this.messageSenderCallback) {
              const proactiveMsg = `💡 [ĐIỂM TIN TỰ ĐỘNG - ZALO AI ASSISTANT]\n\nChào ${sub.senderName}! Mình vừa cập nhật được một tin tức rất hay và hữu ích:\n\n📰 **${data.headline}**\n${data.briefing}\n\nChúc bạn có thêm nhiều cảm hứng làm việc nhé! ✨`;
              await this.messageSenderCallback(chatId, proactiveMsg).catch(() => {});
            }
          }
        }
      }
    } catch (e) {
      console.warn(`⚠️ Lỗi trong chu kỳ thám hiểm mạng:`, e.message);
    }
  }

  getStatus() {
    return {
      isRoaming: this.isRoaming,
      roamIntervalMinutes: this.roamIntervalMinutes,
      subscribersCount: Object.keys(this.subscribers).length
    };
  }
}

export const proactiveScout = new AutonomousProactiveScout();
