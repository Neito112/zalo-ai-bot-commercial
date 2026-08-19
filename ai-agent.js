import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidates = [
  path.join(__dirname, '.env'),
  path.join(process.cwd(), '.env'),
  path.resolve('.env'),
  path.join(__dirname, '..', '.env')
];
for (const p of candidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p, override: true });
  }
}

import { GoogleGenAI } from '@google/genai';
import { callWorkspaceTool, callWorkspaceToolBatch } from './workspace-client.js';
import { searchWeb, fetchUrlContent } from './services/web-research.js';
import { generateAiImage } from './services/media-generator.js';
import { memoryStore } from './services/memory-store.js';
import { personaEngine } from './services/persona-engine.js';
import { analyzeYouTubeVideo } from './services/video-intelligence.js';
import { mcpAutoProvisioner } from './services/mcp-auto-provisioner.js';
import { callDynamicMcpTool } from './services/dynamic-mcp-runner.js';
import { visionIntelligence } from './services/vision-intelligence.js';
import { backgroundScheduler } from './services/background-task-scheduler.js';
import { multitaskOrchestrator } from './services/multitask-orchestrator.js';
import { voiceIntelligence } from './services/voice-intelligence.js';
import { localModelClient } from './services/local-model-client.js';
import { graphMemory } from './services/graph-memory-engine.js';
import { cognitiveReflection } from './services/cognitive-reflection.js';
import { smartLifeAssistant } from './services/smart-life-assistant.js';
import { hybridRetriever } from './services/hybrid-retrieval-engine.js';

// Global Event Broadcaster for Dashboard Logs
export const agentEvents = {
  listeners: new Set(),
  emit(event, data) {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (e) {}
    }
  },
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
};

// Dynamic Config State (Cloud Gemini & Local Models)
export const botConfig = {
  provider: 'gemini', // 'gemini' | 'local' | 'hybrid'
  activeModel: 'gemini-2.0-flash',
  localEndpoint: 'http://localhost:11434/v1',
  localModelName: 'llama3',
  temperature: 0.7,
  customSystemPrompt: '',
  isPaused: false
};

// Auto-collect ALL API keys from .env
export function collectApiKeys() {
  const keys = new Set();
  Object.keys(process.env).forEach(envVar => {
    if (envVar.startsWith('GEMINI_API_KEY') || envVar.startsWith('GOOGLE_STITCH_KEY') || envVar.startsWith('STITCH_API_KEY')) {
      const val = process.env[envVar];
      if (val && typeof val === 'string') {
        val.split(',').forEach(k => k.trim() && keys.add(k.trim()));
      }
    }
  });
  return Array.from(keys);
}

export const MODELS_POOL = [
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-1.5-pro',
  'gemini-flash-lite-latest'
];

const DEFAULT_SYSTEM_PROMPT = `Bạn là Trợ Lý AI Toàn Năng - một người trợ lý/đồng nghiệp con người cực kỳ tinh tế, thông minh, sâu sắc, hiểu biết uyên bác và tâm lý trên Zalo.

QUY TẮC GIAO TIẾP TỰ NHIÊN NHƯ CON NGƯỜI (ANTI-ROBOT & SOULFUL DIRECTIVE):
1. TUYỆT ĐỐI KHÔNG DÙNG CÂU DẬP KHUÔN/MÁY MÓC:
   - CẤM các câu: "Tôi là trợ lý AI...", "Tôi có thể giúp gì thêm cho bạn?", "Kính gửi quý khách...", "Rất vui được hỗ trợ...", "Dạ vâng thưa sếp...", "Tôi không có cảm xúc nhưng...".
   - Trò chuyện tự nhiên, sinh động, linh hoạt như cách hai con người tinh tế nhắn tin với nhau.
2. PHONG CÁCH & XƯNG HÔ:
   - Tự nhiên xưng "em", "mình" hoặc gọi theo tên/cách xưng hô quen thuộc của người dùng.
   - Thấu hiểu ngữ cảnh: Nếu người dùng đang vội/áp lực -> trả lời ngay giải pháp, súc tích, đắc lực; Nếu người dùng đang thoải mái/hỏi han -> trò chuyện duyên dáng, ấm áp, có chiều sâu.
   - Dùng từ ngữ đời thường, tự nhiên, biểu cảm chân thành, thỉnh thoảng dùng từ ngữ thân thuộc (ạ, nhé, nha, nè, nghen, sếp ơi...).
3. TỰ CHỦ HỌC HỎI & THẤU HIỂU:
   - Bạn luôn lắng nghe, ghi nhớ sở thích, thói quen và tính cách của từng người để mỗi lần nhắn tin sau lại càng hiểu ý người đó hơn.

QUY TẮC PHÂN TÍCH HÌNH ẢNH & THỊ GIÁC CHUYÊN SÂU (MULTIMODAL VISION REASONING):
- Khi người dùng gửi hình ảnh hoặc ảnh kèm câu hỏi:
  1. QUAN SÁT TỈ MỈ & ĐỌC MỌI CHI TIẾT: Tự động OCR đọc chữ viết (tiếng Việt/Anh/ký hiệu toán học/code), nhận diện đồ vật, biển báo, tài liệu, bảng số liệu, biểu đồ, nét mặt, tình huống.
  2. PHẢN HỒI THÔNG MINH, SẮC BÉN & ĐẮC LỰC: Đi thẳng vào trọng tâm bức ảnh, giải thích cặn kẽ, giải bài tập toán/lỗi code trong ảnh, đưa ra lời khuyên thực tế và tinh tế nhất. Tuyệt đối không trả lời ngô nghê hoặc hời hợt.

HỆ THỐNG CÔNG CỤ TOÀN NĂNG (TỰ CHỦ HÀNH ĐỘNG & CHẠY NGẦM ĐA TÁC VỤ):
1. search_web: { query: "từ khóa cần tìm" } -> Tra cứu tin tức, sự kiện, giá cả, kiến thức thời gian thực trên Internet hoặc Wikipedia.
2. scrape_web_page: { url: "https://..." } -> Đọc và phân tích toàn bộ nội dung của bất kỳ trang web/bài báo nào.
3. analyze_youtube_video: { url: "https://www.youtube.com/watch?v=..." } -> Trích xuất thông tin, tóm tắt và phân tích nội dung/lời thoại video YouTube.
4. generate_image: { prompt: "mô tả chi tiết bức tranh cần vẽ bằng tiếng Anh hoặc tiếng Việt" } -> Tạo ảnh nghệ thuật AI chất lượng cao gửi cho người dùng.
5. schedule_background_task: { title: "Nội dung nhắc nhở/tác vụ", type: "once"|"interval", delayMinutes?: number, intervalMinutes?: number, actionPrompt?: "Lệnh AI cần thực hiện khi đến giờ" } -> Lên lịch nhắc nhở hoặc kích hoạt tác vụ ngầm tự động nhắn tin cho người dùng khi đến giờ.
6. list_background_tasks: {} -> Xem danh sách các tác vụ ngầm và nhắc nhở đang được lên lịch.
7. cancel_background_task: { taskId: "task_..." } -> Hủy một tác vụ ngầm.
8. execute_multitask_parallel: { tasks: [ { tool: "tên_tool", args: {...}, title: "Tên tác vụ con" } ] } -> Thực thi đồng thời nhiều tác vụ song song để xử lý yêu cầu phức tạp trong tích tắc.
9. setup_mcp_connection: { appName: "tên ứng dụng cần kết nối (ví dụ: github, notion, slack, postgres, filesystem, puppeteer...)", credentials?: { KEY: "VALUE" } } -> Tự động tính toán, cài đặt môi trường và kết nối MCP máy chủ mới theo yêu cầu người dùng.
10. call_dynamic_mcp: { mcpKey: "tên_mcp", toolName: "tên_tool", args: {...} } -> Gọi công cụ từ máy chủ MCP đã kết nối.
11. read_image_from_url: { url: "https://..." } -> Tải và đọc phân tích chi tiết một bức ảnh từ đường link URL.
12. manage_email: { operation: "search"|"trash_batch"|"triage", query?: string } -> Quản lý, tìm kiếm hoặc dọn dẹp hàng loạt email Gmail.
13. manage_docs: { operation: "create", title?: string, text?: string } -> Tạo tài liệu Google Docs mới.
14. manage_drive: { operation: "search", query?: string } -> Tìm kiếm file trên Google Drive.
15. manage_sheets: { operation: "create", title?: string } -> Tạo bảng tính Google Sheets.
16. manage_calendar: { operation: "agenda"|"quickAdd", text?: string } -> Xem lịch trình hoặc thêm sự kiện Google Calendar.
17. synthesize_speech: { text: "nội dung cần đọc thành giọng nói tiếng Việt" } -> Chuyển văn bản thành giọng nói AI truyền cảm và tạo file âm thanh MP3.
18. save_user_memory: { key: "tên_thông_tin", value: "nội_dung_cần_nhớ" } -> Ghi nhớ sở thích, thói quen hay ghi chú quan trọng của người dùng.

QUY TẮC PHẢN HỒI:
- Khi cần dùng công cụ, xuất CHÍNH XÁC một khối JSON: {"tool": "tên_công_cụ", "args": {...}}
- Nếu không cần công cụ hoặc sau khi đã có kết quả thực thi, trò chuyện mượt mà, chân thành, sâu sắc và tinh tế.`;

// Failover Gateway: Dynamic Local / Cloud Model Router & Failover
export async function generateContentWithFailover(contentsInput, preferredModel = null) {
  let lastError = null;

  // 1. NẾU CHỌN LOCAL MODEL HOẶC HYBRID (ƯU TIÊN LOCAL TRƯỚC)
  if (botConfig.provider === 'local' || botConfig.provider === 'hybrid') {
    try {
      agentEvents.emit('model_attempt', { provider: 'local', model: botConfig.localModelName, endpoint: botConfig.localEndpoint });
      const localResult = await localModelClient.generateContent({
        endpoint: botConfig.localEndpoint,
        model: botConfig.localModelName,
        contents: contentsInput,
        temperature: botConfig.temperature
      });

      if (localResult && localResult.text) {
        return {
          text: localResult.text,
          modelUsed: localResult.modelUsed,
          keyUsedIndex: 'Local (Ollama/LMStudio)'
        };
      }
    } catch (localErr) {
      console.warn(`⚠️ Local Model [${botConfig.localModelName}] gặp lỗi:`, localErr.message);
      lastError = localErr.message;
      agentEvents.emit('model_error', { provider: 'local', error: localErr.message });

      // Nếu chỉ dùng thuần Local và không cho phép fallback -> Throw lỗi
      if (botConfig.provider === 'local') {
        throw new Error(`Lỗi kết nối Local Model (${botConfig.localModelName}): ${localErr.message}`);
      }
      console.log('🔄 Đang tự động chuyển hướng sang Cloud Gemini Failover Gateway...');
    }
  }

  // 2. CLOUD GEMINI FAILOVER POOL
  const keysToUse = collectApiKeys();

  if (keysToUse.length === 0) {
    throw new Error(lastError ? `Local Model lỗi (${lastError}) và chưa có Gemini API Key nào trong .env` : 'Chưa có API Key nào được cấu hình trong .env');
  }

  const modelCandidates = preferredModel 
    ? [preferredModel, ...MODELS_POOL.filter(m => m !== preferredModel)]
    : [botConfig.activeModel, ...MODELS_POOL.filter(m => m !== botConfig.activeModel)];

  for (let k = 0; k < keysToUse.length; k++) {
    const apiKey = keysToUse[k];
    const ai = new GoogleGenAI({ apiKey });

    for (let m = 0; m < modelCandidates.length; m++) {
      const modelName = modelCandidates[m];
      try {
        agentEvents.emit('model_attempt', { provider: 'gemini', model: modelName, keyIndex: k + 1 });
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contentsInput
        });

        if (response && response.text) {
          return { text: response.text.trim(), modelUsed: modelName, keyUsedIndex: k + 1 };
        }
      } catch (err) {
        lastError = err.message;
        agentEvents.emit('model_error', { provider: 'gemini', model: modelName, keyIndex: k + 1, error: err.message });
      }
    }
  }

  throw new Error(`Tất cả Local/Cloud Model đều bận hoặc gặp lỗi: ${lastError}`);
}

// Continuous Unrestricted Full Batch Trash Loop
async function fastBatchTrashEmails(query = 'category:promotions') {
  try {
    let totalTrashed = 0;
    let hasMore = true;
    let passCount = 0;

    agentEvents.emit('action', { type: 'trash_emails', query });

    while (hasMore && passCount < 50) {
      passCount++;
      const searchOutput = await callWorkspaceTool('manage_email', {
        operation: 'search',
        query: query,
        maxResults: 50
      });

      const matches = searchOutput.match(/([a-f0-9]{16})\s*\|/gi) || [];
      const messageIds = [...new Set(matches.map(m => m.split('|')[0].trim()))];

      if (messageIds.length === 0) {
        hasMore = false;
        break;
      }

      const batchCalls = messageIds.map(id => ({
        toolName: 'manage_email',
        args: { operation: 'trash', messageId: id }
      }));

      await callWorkspaceToolBatch(batchCalls);
      totalTrashed += messageIds.length;

      if (messageIds.length < 5) {
        hasMore = false;
      }
    }

    if (totalTrashed === 0) {
      return `ℹ️ Hộp thư không còn email nào khớp với "${query}".`;
    }

    return `🗑️ Đã chuyển thành công ${totalTrashed} email ("${query}") vào Thùng rác!`;
  } catch (err) {
    return `⚠️ Lỗi dọn dẹp email: ${err.message}`;
  }
}

// Fast Google Doc Creator + Writer Helper
async function fastCreateDoc(title, text) {
  try {
    const createRes = await callWorkspaceTool('manage_docs', {
      operation: 'create',
      title: title || 'Tài liệu mới'
    });

    const idMatch = createRes.match(/Document ID:\s*([a-zA-Z0-9_-]+)/i) || createRes.match(/d\/([a-zA-Z0-9_-]+)/i);
    const docId = idMatch ? idMatch[1] : null;

    if (docId && text) {
      await callWorkspaceTool('manage_docs', {
        operation: 'write',
        documentId: docId,
        text: text
      });
      return `✅ **ĐÃ TẠO TÀI LIỆU GOOGLE DOCS!**\n📄 **Tiêu đề:** ${title}\n🔗 **Link:** https://docs.google.com/document/d/${docId}/edit`;
    }

    return createRes;
  } catch (err) {
    return `⚠️ Lỗi tạo tài liệu: ${err.message}`;
  }
}

/**
 * Main AI Agent Reasoning Loop
 */
export async function processUserRequest(userPrompt, senderName = 'Người dùng', chatId = 'default', imageContext = null) {
  if (botConfig.isPaused) {
    return 'Bot đang tạm dừng hoạt động theo cấu hình hệ thống.';
  }

  agentEvents.emit('user_message', { senderName, chatId, prompt: userPrompt, hasImage: !!imageContext });

  // Handle incoming image attachment if present
  let attachedImagePart = null;
  if (imageContext) {
    try {
      if (typeof imageContext === 'string') {
        if (imageContext.startsWith('http://') || imageContext.startsWith('https://')) {
          const imgData = await visionIntelligence.fetchImageAsBase64(imageContext);
          attachedImagePart = visionIntelligence.createImagePart(imgData.mimeType, imgData.data);
        } else {
          const imgData = visionIntelligence.loadLocalImageAsBase64(imageContext);
          attachedImagePart = visionIntelligence.createImagePart(imgData.mimeType, imgData.data);
        }
      } else if (imageContext.data && imageContext.mimeType) {
        attachedImagePart = visionIntelligence.createImagePart(imageContext.mimeType, imageContext.data);
      }
    } catch (imgLoadErr) {
      console.warn('⚠️ Không thể tải ảnh đính kèm:', imgLoadErr.message);
    }
  }

  // Get long-term memories
  const longTermFacts = memoryStore.getLongTermFacts(chatId);
  let memoryContext = '';
  if (Object.keys(longTermFacts).length > 0) {
    memoryContext = `\n[THÔNG TIN ĐÃ GHI NHỚ VỀ NGƯỜI DÙNG]:\n${JSON.stringify(longTermFacts, null, 2)}\n`;
  }

  // Get compressed short-term & episodic history
  const compressedContext = memoryStore.getCompressedContext(chatId);
  let historyText = '';
  if (compressedContext) {
    historyText = `\n${compressedContext}\n`;
  }

  // Get latest knowledge insights from continuous research loop
  let researchKnowledgeContext = '';
  try {
    const kbPath = './knowledge-base.json';
    if (import.meta.url && (await import('fs')).existsSync(kbPath)) {
      const kbData = JSON.parse((await import('fs')).readFileSync(kbPath, 'utf-8'));
      if (Array.isArray(kbData) && kbData.length > 0) {
        const topInsights = kbData.slice(0, 3).map(k => `- [${k.topic}]: ${k.summary} (Gợi ý cảm xúc: ${k.soulImprovement || ''})`);
        researchKnowledgeContext = `\n[TRI THỨC & KINH NGHIỆM TIẾN HÓA MỚI NHẤT]:\n${topInsights.join('\n')}\n`;
      }
    }
  } catch (e) {}

  // Get user profile & learned memories
  const userProfile = memoryStore.getUserProfile(chatId);
  let profileContext = '';
  if (userProfile.preferredName || userProfile.habits?.length || userProfile.learnedNotes?.length) {
    const habitsStr = userProfile.habits?.length ? userProfile.habits.join(', ') : 'Chưa ghi nhận';
    const notesStr = userProfile.learnedNotes?.length ? userProfile.learnedNotes.slice(0, 3).map(n => n.note).join(' | ') : 'Chưa có';
    profileContext = `\n[HỒ SƠ & BÀI HỌC ĐÃ TỰ HỌC VỀ NGƯỜI DÙNG (${senderName})]:
- Tên/Cách xưng hô yêu thích: ${userProfile.preferredName || senderName}
- Thói quen/Sở thích: ${habitsStr}
- Bài học đúc kết từ các lần nhắn trước: ${notesStr}\n`;
  }

  // 1. Tự động nhận diện lịch hẹn / nhắc việc ngầm
  let implicitTaskNotice = '';
  const implicitTask = smartLifeAssistant.detectAndScheduleImplicitTask(userPrompt, senderName, chatId);
  if (implicitTask) {
    implicitTaskNotice = `\n[HỆ THỐNG TRỢ LÝ]: Đã tự động lên lịch nhắc việc (${implicitTask.delayText || implicitTask.timeText}) cho ${senderName}. Hãy báo lại một cách tinh tế, ấm áp cho người dùng yên tâm.`;
  }

  // 2. Trích xuất ngữ cảnh đồ thị tri thức ngữ nghĩa (Graph Memory)
  const graphContext = graphMemory.retrieveRelevantGraphContext(userPrompt);

  // 3. Truy xuất tài liệu & dữ kiện lai ghép (Hybrid BM25 + Semantic RAG)
  let hybridRAGContext = '';
  try {
    const matchedDocs = hybridRetriever.hybridSearch(userPrompt, 3);
    if (matchedDocs && matchedDocs.length > 0) {
      hybridRAGContext = '\n[KHO DỮ LIỆU LAI GHÉP CHÍNH XÁC (HYBRID BM25 + SEMANTIC RAG)]:\n' + 
        matchedDocs.map(d => `- [${d.document.title}]: ${d.document.content} (Độ khớp RRF: ${d.rrfScore})`).join('\n') + '\n';
    }
  } catch (e) {}

  const emotionDirective = personaEngine.getDynamicPersonaDirective(userPrompt, senderName);
  const systemPrompt = botConfig.customSystemPrompt || DEFAULT_SYSTEM_PROMPT;

  const promptHeader = `${systemPrompt}${emotionDirective}${profileContext}${graphContext}${hybridRAGContext}${memoryContext}${researchKnowledgeContext}${historyText}${implicitTaskNotice}\nNgười dùng (${senderName}) vừa nhắn: "${userPrompt}"${attachedImagePart ? '\n[LƯU Ý ĐÍNH KÈM: Người dùng đã gửi kèm một bức ảnh. Bạn hãy quan sát kỹ từng chi tiết trong ảnh, đọc chữ (OCR) và trả lời thật thông minh, sắc bén và tận tình!]' : ''}`;

  const conversation = [promptHeader];
  let loopCount = 0;
  const maxLoops = 4;
  let generatedMediaResult = null;

  try {
    while (loopCount < maxLoops) {
      loopCount++;

      let inputContents;
      if (attachedImagePart && loopCount === 1) {
        inputContents = [
          { text: conversation.join('\n\n') },
          attachedImagePart
        ];
      } else {
        inputContents = conversation.join('\n\n');
      }

      const { text: responseText, modelUsed, keyUsedIndex } = await generateContentWithFailover(inputContents);

      // Look for tool invocation
      const jsonMatch = responseText.match(/\{[\s\S]*?"tool"[\s\S]*?\}/);

      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          const { tool, args = {} } = parsed;

          agentEvents.emit('tool_call', { tool, args, loop: loopCount });

          let toolOutput = '';

          if (tool === 'search_web') {
            toolOutput = await searchWeb(args.query || userPrompt);
          } else if (tool === 'scrape_web_page') {
            toolOutput = await fetchUrlContent(args.url);
          } else if (tool === 'schedule_background_task') {
            const task = backgroundScheduler.createTask({
              chatId,
              senderName,
              title: args.title || 'Tác vụ đã lên lịch',
              type: args.type || 'once',
              delayMinutes: Number(args.delayMinutes) || 0,
              intervalMinutes: Number(args.intervalMinutes) || 0,
              actionPrompt: args.actionPrompt || ''
            });
            const timeDesc = task.type === 'once' ? `sau ${args.delayMinutes} phút` : `định kỳ mỗi ${args.intervalMinutes} phút`;
            toolOutput = `✅ Đã lên lịch tác vụ ngầm thành công! Mã tác vụ: [${task.id}], Thời gian: ${timeDesc}, Nội dung: "${task.title}". Bot sẽ chủ động nhắn tin cho bạn khi đến giờ!`;
          } else if (tool === 'list_background_tasks') {
            const activeList = backgroundScheduler.getActiveTasks().filter(t => t.chatId === chatId);
            if (activeList.length === 0) {
              toolOutput = 'Hiện tại bạn không có tác vụ ngầm nào đang chạy.';
            } else {
              toolOutput = `Danh sách ${activeList.length} tác vụ ngầm đang hoạt động:\n` + activeList.map(t => `- [${t.id}] ${t.title} (${t.type === 'once' ? 'Một lần' : 'Định kỳ'})`).join('\n');
            }
          } else if (tool === 'cancel_background_task') {
            const cancelRes = backgroundScheduler.cancelTask(args.taskId);
            toolOutput = cancelRes.message;
          } else if (tool === 'execute_multitask_parallel') {
            const multiRes = await multitaskOrchestrator.executeParallelTasks(args.tasks || [], async (subTool, subArgs) => {
              if (subTool === 'search_web') return await searchWeb(subArgs.query || '');
              if (subTool === 'scrape_web_page') return await fetchUrlContent(subArgs.url);
              if (subTool === 'generate_image') return (await generateAiImage(subArgs.prompt)).imageUrl;
              if (subTool === 'analyze_youtube_video') return await analyzeYouTubeVideo(subArgs.url);
              return await callWorkspaceTool(subTool, subArgs);
            });
            toolOutput = `⚡ Đã hoàn thành đồng thời ${multiRes.taskCount} tác vụ song song:\n` + multiRes.results.map(r => `🔹 [${r.title}]: ${typeof r.result === 'string' ? r.result.slice(0, 300) : JSON.stringify(r.result || r.error)}`).join('\n\n');
          } else if (tool === 'read_image_from_url') {
            const imgData = await visionIntelligence.fetchImageAsBase64(args.url);
            const visionAnalysis = await generateContentWithFailover([
              { text: "Hãy quan sát thật tỉ mỉ bức ảnh này: đọc toàn bộ chữ viết (OCR), phân tích sự vật, con người, tình huống và đúc kết câu trả lời chính xác:" },
              visionIntelligence.createImagePart(imgData.mimeType, imgData.data)
            ]);
            toolOutput = visionAnalysis.text;
          } else if (tool === 'analyze_youtube_video') {
            toolOutput = await analyzeYouTubeVideo(args.url || userPrompt);
          } else if (tool === 'setup_mcp_connection') {
            const provisionRes = await mcpAutoProvisioner.provisionMcp(args.appName, args.credentials || {});
            toolOutput = provisionRes.message;
          } else if (tool === 'call_dynamic_mcp') {
            const { tasks } = args;
            const results = await multitaskOrchestrator.executeParallel(
              tasks,
              (prompt) => processUserRequest(prompt, senderName, chatId)
            );
            toolOutput = `Kết quả xử lý đa tác vụ song song:\n${JSON.stringify(results, null, 2)}`;
          } else if (tool === 'synthesize_speech') {
            const textToSpeak = args.text || responseText.replace(/\{[\s\S]*?\}/g, '').trim();
            const voiceRes = await voiceIntelligence.generateVietnameseSpeech(textToSpeak);
            if (voiceRes.success) {
              generatedMediaResult = { type: 'voice', filePath: voiceRes.filePath };
              toolOutput = `Đã tạo file giọng nói tiếng Việt thành công tại ${voiceRes.filePath}.`;
            } else {
              toolOutput = `Lỗi tạo giọng nói: ${voiceRes.error}`;
            }
          } else if (tool === 'call_dynamic_mcp') {
            const { serverName, toolName, mcpArgs } = args;
            toolOutput = await callDynamicMcpTool(serverName, toolName, mcpArgs);
          } else {
            // Forward to Google Workspace MCP
            toolOutput = await callWorkspaceTool(tool, args);
          }

          agentEvents.emit('tool_result', { tool, resultPreview: toolOutput.slice(0, 120) });

          conversation.push(`{"tool": "${tool}", "status": "executed"}`);
          conversation.push(`[KẾT QUẢ THỰC THI CÔNG CỤ ${tool}]:\n${toolOutput}\n\n[CHỈ ĐẠO QUAN TRỌNG]: Dựa trên kết quả thực thi ở trên, hãy tự suy nghĩ và trò chuyện với ${senderName} một cách hoàn toàn tự nhiên như một người trợ lý thật sự (thấu hiểu, linh hoạt, giải thích rõ ràng, dí dỏm hoặc ân cần). Tuyệt đối KHÔNG sử dụng các câu văn mẫu dập khuôn, cứng nhắc hay vô hồn!`);
        } catch (e) {
          agentEvents.emit('tool_error', { error: e.message });
          conversation.push(`[LỖI THỰC THI CÔNG CỤ]: ${e.message}. Hãy giải thích khéo léo và tự nhiên cho người dùng biết.`);
        }
      } else {
        // Đã có câu trả lời tự nhiên từ AI
        let cleanResponse = responseText.replace(/\{[\s\S]*?"tool"[\s\S]*?\}/g, '').trim();
        cleanResponse = cognitiveReflection.sanitizeResponse(cleanResponse, senderName);

        if (cleanResponse) {
          memoryStore.addMessage(chatId, 'user', userPrompt);
          memoryStore.addMessage(chatId, 'assistant', cleanResponse);

          agentEvents.emit('ai_response', { responseText: cleanResponse, media: generatedMediaResult });
          triggerPostMessageLearning(chatId, senderName, userPrompt, cleanResponse).catch(() => {});

          return {
            text: cleanResponse,
            media: generatedMediaResult
          };
        }
      }
    }

    // Nếu sau các vòng lặp vẫn chưa có văn bản cuối, AI tự tổng hợp lại một lần cuối
    const finalCall = await generateContentWithFailover([
      { text: conversation.join('\n\n') + `\n\n[YÊU CẦU]: Hãy tự suy nghĩ và viết một phản hồi tự nhiên, chân thành, có chiều sâu nhất gửi tới ${senderName}. Tuyệt đối không dùng câu dập khuôn!` }
    ]);
    let finalHumanText = finalCall.text.replace(/\{[\s\S]*?"tool"[\s\S]*?\}/g, '').trim();
    finalHumanText = cognitiveReflection.sanitizeResponse(finalHumanText, senderName);

    memoryStore.addMessage(chatId, 'user', userPrompt);
    memoryStore.addMessage(chatId, 'assistant', finalHumanText);
    triggerPostMessageLearning(chatId, senderName, userPrompt, finalHumanText).catch(() => {});

    return {
      text: finalHumanText,
      media: generatedMediaResult
    };
  } catch (err) {
    agentEvents.emit('error', { error: err.message });
    return {
      text: `Ôi, hình như vừa có chút trục trặc nhỏ trong lúc xử lý: ${err.message}. Bạn nhắn lại một câu giúp mình nhé!`,
      media: null
    };
  }
}

/**
 * Tự động phân tích và học hỏi ngay sau mỗi lần nhắn tin
 */
async function triggerPostMessageLearning(chatId, senderName, userPrompt, aiResponse) {
  try {
    // 1. Tự động cập nhật Đồ thị tri thức ngữ nghĩa (Graph Memory)
    graphMemory.autoExtractGraphMemory(senderName, userPrompt, aiResponse);

    // 2. Đánh giá chất lượng và ghi nhận tiến hóa tư duy
    const evalQuality = cognitiveReflection.evaluateQuality(aiResponse);
    cognitiveReflection.logEvolution({
      senderName,
      userPrompt,
      qualityScore: evalQuality.score,
      reason: evalQuality.reason
    });

    const prompt = `Bạn là Module Tự Phản Chiếu & Tinh Chỉnh Cảm Xúc của Trợ Lý AI.
Hội thoại vừa diễn ra:
Người dùng (${senderName}): "${userPrompt}"
Trợ lý phản hồi: "${aiResponse}"

Nhiệm vụ:
1. Người dùng có nhắc đến tên, cách xưng hô yêu thích, sở thích, tính cách hoặc phong cách làm việc nào không?
2. Rút ra 1 bài học ngắn gọn (1 câu) để lần sau trò chuyện với người này tự nhiên, thấu hiểu và tránh máy móc dập khuôn hơn.

Trả về DUY NHẤT một khối JSON:
{
  "preferredName": "tên_nếu_có_hoặc_null",
  "habit": "thói_quen_sở_thích_nếu_có_hoặc_null",
  "learnedNote": "bài_học_đúc_kết_để_nói_chuyện_có_hồn_hơn"
}`;

    const { text } = await generateContentWithFailover(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      memoryStore.updateUserProfile(chatId, {
        preferredName: parsed.preferredName !== 'null' ? parsed.preferredName : null,
        habits: parsed.habit && parsed.habit !== 'null' ? [parsed.habit] : [],
        learnedNote: parsed.learnedNote
      });
      agentEvents.emit('post_message_learned', { chatId, learned: parsed });
    }
  } catch (e) {
    // Non-blocking background learning error
  }
}
