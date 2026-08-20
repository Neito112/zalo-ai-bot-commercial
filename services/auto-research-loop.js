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
    this.intervalMs = 60000;
    this.timer = null;
    this.reportTimer = null;
    this.topics = [
      'kỹ thuật tự động hóa xử lý văn bản, tài liệu Excel và dữ liệu bảng biểu',
      'thuật toán phân tích báo cáo tài chính, chứng khoán và dữ liệu kinh tế vĩ mô',
      'quy trình làm việc tự động với Google Workspace, Gmail API và Google Calendar',
      'kỹ thuật lập trình và thực thi code Python xử lý dữ liệu tự động cho trợ lý AI',
      'kỹ năng bóc tách, tóm tắt và tổng hợp thông tin kinh doanh đa nguồn chuẩn xác',
      'phương pháp quản lý dự án, nhắc việc thông minh và giám sát tiến độ tự động'
    ];
    this.knowledgeBase = this.loadKnowledge();
    this.evolutionLogs = this.loadEvolutionLogs();
  }

  loadKnowledge() {
    try {
      if (fs.existsSync(KNOWLEDGE_BASE_FILE)) {
        const data = JSON.parse(fs.readFileSync(KNOWLEDGE_BASE_FILE, 'utf-8'));
        if (Array.isArray(data)) {
          import('./hybrid-retrieval-engine.js').then(({ hybridRetriever }) => {
            hybridRetriever.addDocumentsBatch(data.map(k => ({
              id: `kb_${k.id || k.topic}`,
              title: k.topic,
              content: `${k.summary || ''} ${k.practicalWorkflow || ''} ${(k.keyFacts || []).join(' ')}`,
              type: 'WORK_CAPABILITY'
            })));
          }).catch(() => {});
        }
        return data;
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

    console.log(`\n💼 [VÒNG LẶP NÂNG CẤP NĂNG LỰC CÔNG VIỆC #${this.cycleCount}] Nghiên cứu giải pháp: "${topic}"...`);

    try {
      // BƯỚC 1: Thu thập tri thức thực chiến từ Internet
      const searchData = await searchWeb(topic, 3);

      // BƯỚC 2: AI tự phân tích và đúc kết quy trình xử lý công việc
      const prompt = `Bạn là Động Cơ Nâng Cấp Năng Lực Công Việc (Work Execution Optimizer) của Trợ Lý AI.
Dưới đây là dữ liệu kỹ thuật và giải pháp thu thập được về: "${topic}".

DỮ LIỆU KỸ THUẬT:
${searchData}

NHIỆM VỤ THỰC CHIẾN:
1. Trích xuất 2-3 quy tắc/kỹ thuật xử lý công việc thực tế cốt lõi (Actionable Business Logic).
2. Đúc kết 1 quy trình làm việc chuẩn (Standard Operating Procedure) giúp Bot thực thi lệnh người dùng nhanh, chuẩn, không lỗi.

Hãy trả về DUY NHẤT một khối JSON:
{
  "summary": "Tóm tắt giải pháp kỹ thuật / năng lực xử lý công việc",
  "keyFacts": ["Quy tắc thực thi 1", "Quy tắc thực thi 2"],
  "practicalWorkflow": "Quy trình thực hiện công việc chuẩn xác",
  "iqScore": 150
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

  start(intervalSeconds = 3600) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.intervalMs = intervalSeconds * 1000;
    console.log(`🚀 [AUTONOMOUS RESEARCH] Vòng lặp tự nghiên cứu & tiến hóa ĐÃ KÍCH HOẠT (Chu kỳ: ${intervalSeconds}s = ${intervalSeconds / 3600} giờ)!`);

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
