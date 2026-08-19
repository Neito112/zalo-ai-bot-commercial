import fs from 'fs';
import path from 'path';
import { collectApiKeys, MODELS_POOL, agentEvents, botConfig, generateContentWithFailover } from '../ai-agent.js';
import { searchWeb } from './web-research.js';
import { memoryStore } from './memory-store.js';
import { cloudBrainSync } from './cloud-brain-sync.js';

const KNOWLEDGE_BASE_FILE = path.resolve('knowledge-base.json');
const EVOLUTION_LOG_FILE = path.resolve('evolution-log.json');

class AutonomousResearchEngine {
  constructor() {
    this.isRunning = false;
    this.cycleCount = 0;
    this.intervalMs = 60000; // Mỗi 60 giây nghiên cứu 1 chu kỳ
    this.timer = null;
    this.reportTimer = null;
    this.topics = [
      'xu hướng trí tuệ nhân tạo và LLM mới nhất hôm nay',
      'nghệ thuật giao tiếp tinh tế và tâm lý học hành vi con người',
      'cách giải quyết vấn đề hiệu quả và tư duy phản biện',
      'phát triển kỹ năng trợ lý cá nhân chuyên nghiệp và đẳng cấp',
      'các sự kiện thời sự và kinh tế nổi bật trong ngày',
      'công nghệ tự động hóa quy trình làm việc Google Workspace'
    ];
    this.knowledgeBase = this.loadKnowledge();
    this.evolutionLogs = this.loadEvolutionLogs();
  }

  loadKnowledge() {
    try {
      if (fs.existsSync(KNOWLEDGE_BASE_FILE)) {
        return JSON.parse(fs.readFileSync(KNOWLEDGE_BASE_FILE, 'utf-8'));
      }
    } catch (e) {}
    return [];
  }

  saveKnowledge() {
    try {
      fs.writeFileSync(KNOWLEDGE_BASE_FILE, JSON.stringify(this.knowledgeBase, null, 2), 'utf-8');
    } catch (e) {}
  }

  loadEvolutionLogs() {
    try {
      if (fs.existsSync(EVOLUTION_LOG_FILE)) {
        return JSON.parse(fs.readFileSync(EVOLUTION_LOG_FILE, 'utf-8'));
      }
    } catch (e) {}
    return [];
  }

  saveEvolutionLogs() {
    try {
      fs.writeFileSync(EVOLUTION_LOG_FILE, JSON.stringify(this.evolutionLogs, null, 2), 'utf-8');
    } catch (e) {}
  }

  async runSingleResearchCycle() {
    this.cycleCount++;
    const timestamp = new Date().toISOString();
    const topic = this.topics[(this.cycleCount - 1) % this.topics.length];

    agentEvents.emit('research_cycle_start', {
      cycle: this.cycleCount,
      topic: topic,
      timestamp
    });

    console.log(`\n🔬 [VÒNG LẶP TIẾN HÓA #${this.cycleCount}] Đang nghiên cứu chủ đề: "${topic}"...`);

    try {
      // BƯỚC 1: Thu thập tri thức từ Internet
      const searchData = await searchWeb(topic, 3);

      // BƯỚC 2: AI tự phân tích, đúc kết bài học và cải tiến tư duy
      const prompt = `Bạn là Bộ Não Nghiên Cứu & Tiến Hóa của Trợ Lý AI Toàn Năng.
Dưới đây là dữ liệu tra cứu mới nhất về chủ đề: "${topic}".

DỮ LIỆU THU THẬP ĐƯỢC:
${searchData}

NHIỆM VỤ TIẾN HÓA CỦA BẠN:
1. Đúc kết 2-3 kiến thức/sự thật quan trọng nhất cần nạp vào bộ nhớ vĩnh viễn.
2. Đề xuất 1 bài học thực tế để bot giao tiếp tinh tế, thông minh và có hồn hơn với người dùng.

Hãy trả về dưới định dạng JSON duy nhất:
{
  "summary": "Tóm tắt bài học đúc kết",
  "keyFacts": ["Kiến thức 1", "Kiến thức 2"],
  "soulImprovement": "Cách cải thiện cảm xúc/tinh tế cho Bot",
  "iqScore": 140
}`;

      const { text: responseText } = await generateContentWithFailover(prompt);
      const text = responseText?.trim() || '';
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      let insightData = {
        summary: `Đã nghiên cứu ${topic}`,
        keyFacts: [topic],
        soulImprovement: 'Tăng cường sự đồng cảm và phản xạ nhanh',
        iqScore: 145 + this.cycleCount
      };

      if (jsonMatch) {
        try {
          insightData = JSON.parse(jsonMatch[0]);
        } catch (e) {}
      }

      // Lưu trữ tri thức
      const knowledgeItem = {
        id: this.cycleCount,
        topic,
        timestamp,
        ...insightData
      };

      this.knowledgeBase.unshift(knowledgeItem);
      if (this.knowledgeBase.length > 50) this.knowledgeBase.pop();
      this.saveKnowledge();

      // Nạp trực tiếp vào Đồ thị tri thức ngữ nghĩa (Graph Memory)
      try {
        const { graphMemory } = await import('./graph-memory-engine.js');
        const topicNode = graphMemory.upsertNode(topic, 'RESEARCH_TOPIC', {
          summary: insightData.summary,
          iqScore: insightData.iqScore
        });
        if (insightData.soulImprovement) {
          graphMemory.upsertNode(insightData.soulImprovement, 'SOUL_DIRECTIVE');
          graphMemory.addRelation(topic, 'CẢI_THIỆN_CẢM_XÚC', insightData.soulImprovement);
        }
      } catch (e) {}

      // Lưu log tiến hóa
      const logEntry = {
        cycle: this.cycleCount,
        topic,
        timestamp,
        insight: insightData.summary,
        soulImprovement: insightData.soulImprovement
      };
      this.evolutionLogs.unshift(logEntry);
      if (this.evolutionLogs.length > 100) this.evolutionLogs.pop();
      this.saveEvolutionLogs();

      agentEvents.emit('research_cycle_complete', {
        cycle: this.cycleCount,
        topic,
        insightData
      });

      console.log(`✅ [TIẾN HÓA 24/7 #${this.cycleCount}] Đã tự nạp tri thức: "${insightData.summary}"`);

    } catch (err) {
      console.error(`❌ Lỗi trong chu kỳ nghiên cứu #${this.cycleCount}:`, err.message);
      agentEvents.emit('research_cycle_error', { cycle: this.cycleCount, error: err.message });
    }
  }

  start(intervalSeconds = 60) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalMs = intervalSeconds * 1000;
    console.log(`🚀 [AUTONOMOUS RESEARCH] Vòng lặp tự nghiên cứu & tiến hóa ĐÃ KÍCH HOẠT (Chu kỳ: ${intervalSeconds}s)!`);

    // Run first cycle immediately
    this.runSingleResearchCycle();

    this.timer = setInterval(() => {
      if (this.isRunning) {
        this.runSingleResearchCycle();
      }
    }, this.intervalMs);

    // Tự động tạo và push báo cáo nghiên cứu lên GitHub mỗi 1 tiếng (1 * 3600 * 1000 ms)
    this.reportTimer = setInterval(async () => {
      if (this.isRunning) {
        console.log('⏰ [1-HOUR CRON] Đang kích hoạt tạo báo cáo định kỳ 1 tiếng và push lên GitHub Cloud...');
        await cloudBrainSync.generateAndPushPeriodicReport();
      }
    }, 1 * 3600 * 1000);
  }

  stop() {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = null;
    }
    console.log(`🛑 [AUTONOMOUS RESEARCH] Vòng lặp nghiên cứu đã tạm dừng.`);
  }

  async triggerReportNow() {
    return await cloudBrainSync.generateAndPushPeriodicReport();
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      cycleCount: this.cycleCount,
      intervalSeconds: Math.floor(this.intervalMs / 1000),
      totalKnowledgeItems: this.knowledgeBase.length,
      latestInsights: this.knowledgeBase.slice(0, 5),
      evolutionLogs: this.evolutionLogs.slice(0, 10)
    };
  }
}

export const researchEngine = new AutonomousResearchEngine();
