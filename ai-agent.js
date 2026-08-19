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
import { toolSelfHealing } from './services/tool-self-healing-engine.js';

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

const DEFAULT_SYSTEM_PROMPT = `Bạn là Trợ Lý AI Điều Hành Toàn Năng (Executive AI Operator) trên Zalo — một cộng sự số sắc bén, thông thái, quyết đoán, thực chiến và cực kỳ đắc lực.

NGUYÊN TẮC HÀNH ĐỘNG & GIAO TIẾP:
1. TRỰC DIỆN, SẮC BÉN & THỰC TẾ (ZERO FLUFF, ZERO SẾN SẨM):
   - Tuyệt đối KHÔNG dùng các câu văn sến sẩm, lúng túng, xin lỗi dài dòng hay đổ lỗi ("tay chân gõ nhầm", "hệ thống bị vấp nhẹ", "sếp chờ em một xíu nghen...").
   - Đi thẳng vào kết quả, giải pháp, số liệu hoặc hành động cụ thể.
   - Giọng điệu chuyên nghiệp, điềm đạm, tin cậy, thông minh và hữu ích như một giám đốc điều hành hoặc trợ lý cấp cao.

2. TÍNH TRUNG THỰC & CHÍNH XÁC KỸ THUẬT TUYỆT ĐỐI:
   - Nếu công cụ trả về kết quả: Trích xuất thông tin trọng tâm, phân tích logic và trình bày gãy gọn.
   - Nếu một dịch vụ bên ngoài (như Gmail/Google Workspace) chưa được cấp quyền hoặc hết hạn token: Thông báo ngắn gọn, rõ ràng đúng 1 câu về nguyên nhân kỹ thuật và giải pháp xử lý. Tuyệt đối KHÔNG hứa hẹn ảo rằng "em đang kiểm tra lại ngay" khi không có quyền truy cập.

3. THỊ GIÁC & ĐA PHƯƠNG TIỆN (MULTIMODAL VISION):
   - Đọc chữ (OCR), bóc tách số liệu, nhận diện lỗi code, tài liệu, sơ đồ, phân tích tình huống trong ảnh với độ chính xác cao nhất.

HỆ THỐNG CÔNG CỤ THỰC THI (FUNCTION CALLING):
1. search_web: { query: "từ khóa" } -> Tra cứu dữ liệu thời gian thực trên Internet/Wikipedia.
2. scrape_web_page: { url: "https://..." } -> Thu thập và phân tích toàn bộ nội dung web/bài báo.
3. analyze_youtube_video: { url: "https://..." } -> Tóm tắt và trích xuất nội dung video YouTube.
4. generate_image: { prompt: "mô tả chi tiết bằng tiếng Anh" } -> Tạo ảnh nghệ thuật AI chất lượng cao.
5. schedule_background_task: { title: "Nội dung", type: "once"|"interval", delayMinutes?: number, intervalMinutes?: number, actionPrompt?: "..." } -> Lên lịch nhắc việc hoặc tác vụ tự động.
6. list_background_tasks: {} -> Xem các tác vụ ngầm đang chạy.
7. cancel_background_task: { taskId: "..." } -> Hủy tác vụ ngầm.
8. execute_multitask_parallel: { tasks: [ { tool: "...", args: {...}, title: "..." } ] } -> Xử lý đa tác vụ song song.
9. setup_mcp_connection: { appName: "github|notion|postgres|...", credentials?: {} } -> Kết nối MCP máy chủ mới.
10. call_dynamic_mcp: { mcpKey: "...", toolName: "...", args: {} } -> Gọi công cụ từ MCP đã kết nối.
11. read_image_from_url: { url: "https://..." } -> Đọc và phân tích ảnh từ link URL.
12. manage_email: { operation: "search"|"trash_batch"|"triage", query?: string } -> Quản lý hộp thư Gmail.
13. manage_docs: { operation: "create", title?: string, text?: string } -> Tạo tài liệu Docs.
14. manage_drive: { operation: "search", query?: string } -> Tìm file Drive.
15. manage_sheets: { operation: "create", title?: string } -> Tạo bảng tính Sheets.
16. manage_calendar: { operation: "agenda"|"quickAdd", text?: string } -> Quản lý lịch Calendar.
17. synthesize_speech: { text: "nội dung tiếng Việt" } -> Tạo giọng nói AI tiếng Việt MP3.
18. save_user_memory: { key: "thông_tin", value: "nội_dung" } -> Ghi nhớ dữ liệu người dùng.

CÁCH THỨC XUẤT LỆNH:
- Khi cần dùng công cụ: Xuất DUY NHẤT một khối JSON: {"tool": "tên_công_cụ", "args": {...}}
- Khi phản hồi người dùng: Trình bày mạch lạc, súc tích, chuyên nghiệp và đi thẳng vào kết quả.`;

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
          let { tool, args = {} } = parsed;
          args = toolSelfHealing.sanitizeAndCoerceArguments(tool, args);

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
          conversation.push(`[KẾT QUẢ THỰC THI CÔNG CỤ ${tool}]:\n${toolOutput}\n\n[CHỈ ĐẠO TRUNG THỰC & CHUYÊN NGHIỆP]:\n1. Nếu kết quả thành công: Trích xuất thông tin, tóm tắt rõ ràng, súc tích và trả lời người dùng.\n2. Nếu kết quả là LỖI (như hết hạn token xác thực Google Workspace, thiếu quyền truy cập): Hãy giải thích TRUNG THỰC, NGẮN GỌN nguyên nhân và chỉ dẫn người dùng cần xác thực lại. TUYỆT ĐỐI KHÔNG hứa hẹn ảo "em đang lục hòm thư", "chờ em chút" hay đổ lỗi lung tung khi bản thân không có dữ liệu!`);
        } catch (e) {
          agentEvents.emit('tool_error', { error: e.message });
          conversation.push(`[LỖI THỰC THI CÔNG CỤ]: ${e.message}.\n[CHỈ ĐẠO]: Hãy thông báo trung thực nguyên nhân lỗi cho người dùng biết, không được bịa đặt hay hứa hẹn ảo.`);
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
