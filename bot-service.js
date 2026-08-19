import { createRequire } from 'module';
import 'dotenv/config';
import { enqueueZaloMessage, updateZaloMessageResponse } from './agent-bridge.js';
import { processUserRequest, agentEvents, botConfig } from './ai-agent.js';

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
      toolsUsed: 0,
      startTime: Date.now()
    };
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
        const text = msg.text || '';
        const senderName = msg.from?.displayName || msg.from?.id || 'Người dùng';

        console.log(`📩 [Zalo -> AI Agent] từ ${senderName} (${chatId}): "${text}"`);
        if (!chatId) return;

        this.stats.messagesReceived++;
        agentEvents.emit('zalo_message_received', { senderName, chatId, text });

        // STEP 1: Quick typing / acknowledgment
        await this.bot.sendChatAction(chatId, 'typing').catch(() => {});

        // Enqueue message to shared inbox
        const pendingMsg = enqueueZaloMessage(chatId, senderName, text);

        // STEP 2: Intelligent Multi-modal AI Processing
        const result = await processUserRequest(text, senderName, String(chatId));
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
    return {
      isPolling: this.isPolling,
      isPaused: botConfig.isPaused,
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
