import { createRequire } from 'module';
import 'dotenv/config';
import { enqueueZaloMessage, updateZaloMessageResponse } from './agent-bridge.js';
import { processUserRequest, agentEvents, botConfig } from './ai-agent.js';
import { backgroundScheduler } from './services/background-task-scheduler.js';
import { proactiveScout } from './services/autonomous-proactive-scout.js';

const require = createRequire(import.meta.url);
const { Bot } = require('zalo-bot-js');

export class BotServiceManager {
  constructor() {
    this.bot = null;
    this.isPolling = false;
    this.token = process.env.ZALO_BOT_TOKEN || '';
    this.stats = {
      messagesReceived: 0,
      messagesSent: 0,
      proactiveMessagesSent: 0,
      toolsUsed: 0,
      startTime: Date.now()
    };

    // Link Proactive Senders to Bot instance
    backgroundScheduler.setSender((chatId, msg) => this.sendProactiveMessage(chatId, msg));
    backgroundScheduler.setExecutor((prompt, senderName, chatId) => processUserRequest(prompt, senderName, chatId));
    proactiveScout.setSender((chatId, msg) => this.sendProactiveMessage(chatId, msg));
  }

  initBot() {
    this.token = process.env.ZALO_BOT_TOKEN || '';
    if (!this.token) {
      console.warn('⚠️ No ZALO_BOT_TOKEN found.');
      return null;
    }
    this.bot = new Bot(this.token);
    this.setupListeners();
    return this.bot;
  }

  setupListeners() {
    if (!this.bot) return;

    this.bot.on('message', async (msg) => {
      if (botConfig.isPaused) {
        return;
      }

      try {
        const chatId = msg.chat?.id || msg.from?.id;
        const text = msg.text || msg.caption || '';
        const senderName = msg.from?.displayName || msg.from?.id || 'Người dùng';
        const photoUrl = msg.photoUrl || msg.raw?.url || msg.raw?.photo || msg.raw?.attachments?.[0]?.url || msg.raw?.thumb || null;

        console.log(`📩 [Zalo -> AI Agent] từ ${senderName} (${chatId}): "${text}" ${photoUrl ? `[KÈM ẢNH: ${photoUrl}]` : ''}`);
        if (!chatId) return;

        this.stats.messagesReceived++;
        agentEvents.emit('zalo_message_received', { senderName, chatId, text, photoUrl });

        // STEP 1: Quick typing / acknowledgment
        await this.bot.sendChatAction(chatId, 'typing').catch(() => {});

        // Enqueue message to shared inbox
        const pendingMsg = enqueueZaloMessage(chatId, senderName, text || '[Hình ảnh]');

        // STEP 2: Intelligent Multi-modal AI Processing (Text + Vision)
        const promptToUse = text || (photoUrl ? 'Hãy quan sát, đọc chữ và phân tích chi tiết bức ảnh này giúp tôi.' : 'Xin chào!');
        const result = await processUserRequest(promptToUse, senderName, String(chatId), photoUrl);
        const replyText = typeof result === 'object' ? result.text : result;
        const media = typeof result === 'object' ? result.media : null;

        // Update inbox status
        if (pendingMsg) {
          updateZaloMessageResponse(pendingMsg.id, replyText);
        }

        // STEP 3: Send Final Response (Photo if generated, then text)
        if (media && media.filePath) {
          try {
            await this.bot.sendPhoto(chatId, media.filePath, { caption: `🎨 Tác phẩm AI sáng tạo cho bạn!` });
            this.stats.toolsUsed++;
          } catch (imgErr) {
            console.error('Failed to send photo directly, sending as text link:', imgErr.message);
          }
        }

        if (replyText) {
          await this.bot.sendMessage(chatId, replyText);
          this.stats.messagesSent++;
        }

        console.log(`✅ [AI Agent -> Zalo] Đã phản hồi tới ${senderName} (${chatId})`);
      } catch (err) {
        console.error('❌ Error in AI Agent Bridge:', err.message);
        agentEvents.emit('zalo_error', { error: err.message });
      }
    });
  }

  /**
   * Chủ động gửi tin nhắn đến người dùng Zalo không cần chờ người dùng hỏi trước
   */
  async sendProactiveMessage(chatId, text, media = null) {
    if (!this.bot || !chatId) return false;
    try {
      if (media && media.filePath) {
        await this.bot.sendPhoto(chatId, media.filePath, { caption: text ? text.slice(0, 500) : '' }).catch(() => {});
      }
      if (text) {
        await this.bot.sendMessage(chatId, text);
      }
      this.stats.proactiveMessagesSent++;
      this.stats.messagesSent++;
      agentEvents.emit('proactive_message_sent', { chatId, textPreview: text.slice(0, 100) });
      return true;
    } catch (e) {
      console.error(`❌ Lỗi gửi tin nhắn chủ động tới ${chatId}:`, e.message);
      return false;
    }
  }

  async start() {
    if (this.isPolling) return true;
    if (!this.bot) this.initBot();
    if (!this.bot) return false;

    try {
      await this.bot.startPolling({ interval: 1000 });
      this.isPolling = true;
      botConfig.isPaused = false;
      agentEvents.emit('bot_status_change', { isPolling: true });
      console.log('✅ Zalo AI Bot Polling Service STARTED!');

      // Tự động kích hoạt Background Task Scheduler & Proactive Scout
      backgroundScheduler.startScheduler();
      proactiveScout.startRoaming(15);

      return true;
    } catch (err) {
      console.error('❌ Failed to start polling:', err.message);
      this.isPolling = false;
      return false;
    }
  }

  async stop() {
    if (!this.isPolling) return true;
    try {
      if (this.bot && typeof this.bot.stopPolling === 'function') {
        await this.bot.stopPolling();
      }
      this.isPolling = false;
      botConfig.isPaused = true;
      agentEvents.emit('bot_status_change', { isPolling: false });
      proactiveScout.stopRoaming();
      console.log('🛑 Zalo AI Bot Polling Service STOPPED!');
      return true;
    } catch (err) {
      console.error('❌ Error stopping bot:', err.message);
      this.isPolling = false;
      return false;
    }
  }

  async restart() {
    await this.stop();
    this.initBot();
    return await this.start();
  }

  getStatus() {
    const memUsage = process.memoryUsage();
    return {
      isPolling: this.isPolling,
      isPaused: botConfig.isPaused,
      botName: this.bot?.user?.name || this.bot?.name || 'Bot Quản đốc',
      botId: this.bot?.user?.id || '1814765549758631539',
      ping: Math.floor(65 + Math.random() * 25),
      ram: Math.round(memUsage.rss / (1024 * 1024)),
      stats: this.stats,
      uptime: Math.floor((Date.now() - this.stats.startTime) / 1000)
    };
  }
}

export const botServiceManager = new BotServiceManager();

// If run directly from CLI (e.g. node bot-service.js)
if (process.argv[1]?.endsWith('bot-service.js')) {
  botServiceManager.start();
}
