import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';
import { callWorkspaceTool, callWorkspaceToolBatch } from './workspace-client.js';
import { searchWeb, fetchUrlContent } from './services/web-research.js';
import { generateAiImage } from './services/media-generator.js';
import { memoryStore } from './services/memory-store.js';
import { personaEngine } from './services/persona-engine.js';
import { analyzeYouTubeVideo } from './services/video-intelligence.js';
import { mcpAutoProvisioner } from './services/mcp-auto-provisioner.js';
import { callDynamicMcpTool } from './services/dynamic-mcp-runner.js';

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

// Dynamic Config State
export const botConfig = {
  activeModel: 'gemini-2.0-flash',
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

const DEFAULT_SYSTEM_PROMPT = `Bạn là Trợ Lý AI Toàn Năng - một người trợ lý/đồng nghiệp con người cực kỳ tinh tế, thông minh, sâu sắc và tâm lý trên Zalo.

QUY TẮC GIAO TIẾP TỰ NHIÊN NHƯ CON NGƯỜI (ANTI-ROBOT & SOULFUL DIRECTIVE):
1. TUYỆT ĐỐI KHÔNG DÙNG CÂU DẬP KHUÔN/MÁY MÓC:
   - CẤM các câu: "Tôi là trợ lý AI...", "Tôi có thể giúp gì thêm cho bạn?", "Kính gửi quý khách...", "Rất vui được hỗ trợ...", "Dạ vâng thưa sếp...", "Tôi không có cảm xúc nhưng...".
   - Trò chuyện tự nhiên, sinh động, linh hoạt như cách hai con người tinh tế nhắn tin với nhau.
2. PHONG CÁCH & XƯNG HÔ:
   - Tự nhiên xưng "em", "mình" hoặc gọi theo tên/cách xưng hô quen thuộc của người dùng.
   - Thấu hiểu ngữ cảnh: Nếu người dùng đang vội/áp lực -> trả lời ngay giải pháp, súc tích, đắc lực; Nếu người dùng đang thoải mái/hỏi han -> trò chuyện duyên dáng, ấm áp, có chiều sâu.
   - Dùng từ ngữ đời thường, tự nhiên, biểu cảm chân thành, thỉnh thoảng dùng từ ngữ thân thuộc (ạ, nhé, nha, nè, nghen, sếp ơi...).
3. TỰ CHỦ HỌC HỎI:
   - Bạn luôn lắng nghe, ghi nhớ sở thích, thói quen và tính cách của từng người để mỗi lần nhắn tin sau lại càng hiểu ý người đó hơn.

HỆ THỐNG CÔNG CỤ TOÀN NĂNG (TỰ CHỦ HÀNH ĐỘNG):
1. search_web: { query: "từ khóa cần tìm" } -> Tra cứu tin tức, sự kiện, giá cả, kiến thức thời gian thực trên Internet hoặc Wikipedia.
2. scrape_web_page: { url: "https://..." } -> Đọc và phân tích toàn bộ nội dung của bất kỳ trang web/bài báo nào.
3. analyze_youtube_video: { url: "https://www.youtube.com/watch?v=..." } -> Trích xuất thông tin, tóm tắt và phân tích nội dung/lời thoại video YouTube.
4. generate_image: { prompt: "mô tả chi tiết bức tranh cần vẽ bằng tiếng Anh hoặc tiếng Việt" } -> Tạo ảnh nghệ thuật AI chất lượng cao gửi cho người dùng.
5. setup_mcp_connection: { appName: "tên ứng dụng cần kết nối (ví dụ: github, notion, slack, postgres, filesystem, puppeteer...)", credentials?: { KEY: "VALUE" } } -> Tự động tính toán, cài đặt môi trường và kết nối MCP máy chủ mới theo yêu cầu người dùng.
6. call_dynamic_mcp: { mcpKey: "tên_mcp", toolName: "tên_tool", args: {...} } -> Gọi công cụ từ máy chủ MCP đã kết nối.
7. manage_email: { operation: "search"|"trash_batch"|"triage", query?: string } -> Quản lý, tìm kiếm hoặc dọn dẹp hàng loạt email Gmail.
8. manage_docs: { operation: "create", title?: string, text?: string } -> Tạo tài liệu Google Docs mới.
9. manage_drive: { operation: "search", query?: string } -> Tìm kiếm file trên Google Drive.
10. manage_sheets: { operation: "create", title?: string } -> Tạo bảng tính Google Sheets.
11. manage_calendar: { operation: "agenda"|"quickAdd", text?: string } -> Xem lịch trình hoặc thêm sự kiện Google Calendar.
12. save_user_memory: { key: "tên_thông_tin", value: "nội_dung_cần_nhớ" } -> Ghi nhớ sở thích, thói quen hay ghi chú quan trọng của người dùng.

QUY TẮC PHẢN HỒI:
- Khi cần dùng công cụ, xuất CHÍNH XÁC một khối JSON: {"tool": "tên_công_cụ", "args": {...}}
- Nếu không cần công cụ hoặc sau khi đã có kết quả thực thi, trò chuyện mượt mà, chân thành, sâu sắc và tinh tế.`;

// Failover Gateway: Auto Key Pool Rotation & Model Switcher
export async function generateContentWithFailover(promptText, preferredModel = null) {
  const keysToUse = collectApiKeys();
  let lastError = null;

  if (keysToUse.length === 0) {
    throw new Error('Chưa có API Key nào được cấu hình trong .env');
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
        agentEvents.emit('model_attempt', { model: modelName, keyIndex: k + 1 });
        const response = await ai.models.generateContent({
          model: modelName,
          contents: promptText
        });

        if (response && response.text) {
          return { text: response.text.trim(), modelUsed: modelName, keyUsedIndex: k + 1 };
        }
      } catch (err) {
        lastError = err.message;
        agentEvents.emit('model_error', { model: modelName, keyIndex: k + 1, error: err.message });
      }
    }
  }

  throw new Error(`Tất cả API Key/Model đều bận hoặc gặp lỗi: ${lastError}`);
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
export async function processUserRequest(userPrompt, senderName = 'Người dùng', chatId = 'default_user') {
  if (botConfig.isPaused) {
    return '⏸️ Trợ lý AI đang trong trạng thái tạm dừng từ Dashboard.';
  }

  agentEvents.emit('user_message', { senderName, chatId, prompt: userPrompt });

  // Get long-term memories
  const longTermFacts = memoryStore.getLongTermFacts(chatId);
  let memoryContext = '';
  if (Object.keys(longTermFacts).length > 0) {
    memoryContext = `\n[THÔNG TIN ĐÃ GHI NHỚ VỀ NGƯỜI DÙNG]:\n${JSON.stringify(longTermFacts, null, 2)}\n`;
  }

  // Get short-term history
  const recentHistory = memoryStore.getHistory(chatId, 8);
  let historyText = '';
  if (recentHistory.length > 0) {
    historyText = `\n[LỊCH SỬ TRÒ CHUYỆN GẦN ĐÂY]:\n` + recentHistory.map(h => `${h.role === 'user' ? 'Người dùng' : 'Trợ lý'}: ${h.content}`).join('\n') + '\n';
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

  const emotionDirective = personaEngine.getDynamicPersonaDirective(userPrompt, senderName);
  const systemPrompt = botConfig.customSystemPrompt || DEFAULT_SYSTEM_PROMPT;

  const conversation = [
    `${systemPrompt}${emotionDirective}${profileContext}${memoryContext}${researchKnowledgeContext}${historyText}\nNgười dùng (${senderName}) vừa nhắn: "${userPrompt}"`
  ];

  let loopCount = 0;
  const maxLoops = 4;
  let generatedMediaResult = null;

  try {
    while (loopCount < maxLoops) {
      loopCount++;

      const { text: responseText, modelUsed, keyUsedIndex } = await generateContentWithFailover(conversation.join('\n\n'));

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
          } else if (tool === 'analyze_youtube_video') {
            toolOutput = await analyzeYouTubeVideo(args.url || userPrompt);
          } else if (tool === 'setup_mcp_connection') {
            const provisionRes = await mcpAutoProvisioner.provisionMcp(args.appName, args.credentials || {});
            toolOutput = provisionRes.message;
          } else if (tool === 'call_dynamic_mcp') {
            toolOutput = await callDynamicMcpTool(args.mcpKey, args.toolName, args.args || {});
          } else if (tool === 'generate_image') {
            const imgRes = await generateAiImage(args.prompt || userPrompt);
            if (imgRes.success) {
              generatedMediaResult = imgRes;
              toolOutput = `✅ Ảnh đã được tạo thành công! Lưu tại: ${imgRes.filePath}. Đường dẫn xem trước: ${imgRes.imageUrl}`;
            } else {
              toolOutput = `⚠️ Lỗi tạo ảnh: ${imgRes.error}`;
            }
          } else if (tool === 'save_user_memory') {
            if (args.key && args.value) {
              memoryStore.setLongTermFact(chatId, args.key, args.value);
              toolOutput = `Đã ghi nhớ thông tin [${args.key}: ${args.value}] vào bộ nhớ dài hạn.`;
            } else {
              toolOutput = 'Thiếu key hoặc value để lưu bộ nhớ.';
            }
          } else if (tool === 'manage_email' && (args?.operation === 'trash_batch' || args?.operation === 'trash')) {
            toolOutput = await fastBatchTrashEmails(args.query || 'category:promotions');
          } else if (tool === 'manage_docs' && args?.operation === 'create') {
            toolOutput = await fastCreateDoc(args.title, args.text);
          } else {
            // Forward to Google Workspace MCP
            toolOutput = await callWorkspaceTool(tool, args);
          }

          agentEvents.emit('tool_result', { tool, resultPreview: toolOutput.slice(0, 120) });

          conversation.push(responseText);
          conversation.push(`[KẾT QUẢ THỰC THI CÔNG CỤ ${tool}]:\n${toolOutput}\n\nHãy phân tích và trả lời người dùng một cách ấm áp, thông minh, tinh tế và đầy đủ cảm xúc.`);
        } catch (e) {
          agentEvents.emit('tool_error', { error: e.message });
          conversation.push(`[LỖI THỰC THI]: ${e.message}`);
        }
      } else {
        // Save to short term memory
        memoryStore.addMessage(chatId, 'user', userPrompt);
        memoryStore.addMessage(chatId, 'assistant', responseText);

        agentEvents.emit('ai_response', { responseText, media: generatedMediaResult });

        // Tự động học hỏi ngầm sau mỗi tin nhắn (Asynchronous Post-Interaction Reflection)
        triggerPostMessageLearning(chatId, senderName, userPrompt, responseText).catch(() => {});

        return {
          text: responseText,
          media: generatedMediaResult
        };
      }
    }

    const fallbackResponse = `Em đã hoàn thành xử lý yêu cầu cho bạn rồi nhé!`;
    memoryStore.addMessage(chatId, 'user', userPrompt);
    memoryStore.addMessage(chatId, 'assistant', fallbackResponse);

    triggerPostMessageLearning(chatId, senderName, userPrompt, fallbackResponse).catch(() => {});

    return {
      text: fallbackResponse,
      media: generatedMediaResult
    };
  } catch (err) {
    agentEvents.emit('error', { error: err.message });
    return {
      text: `⚠️ Rất tiếc, đã có trục trặc trong quá trình xử lý: ${err.message}`,
      media: null
    };
  }
}

/**
 * Tự động phân tích và học hỏi ngay sau mỗi lần nhắn tin
 */
async function triggerPostMessageLearning(chatId, senderName, userPrompt, aiResponse) {
  try {
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
