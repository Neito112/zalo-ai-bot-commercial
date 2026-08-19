import fs from 'fs';
import path from 'path';

const TASKS_FILE = path.resolve('scheduled-tasks.json');

export class BackgroundTaskScheduler {
  constructor() {
    this.tasks = this.loadTasks();
    this.activeTimers = new Map();
    this.messageSenderCallback = null;
    this.taskExecutorCallback = null;
  }

  setSender(fn) {
    this.messageSenderCallback = fn;
  }

  setExecutor(fn) {
    this.taskExecutorCallback = fn;
  }

  loadTasks() {
    try {
      if (fs.existsSync(TASKS_FILE)) {
        return JSON.parse(fs.readFileSync(TASKS_FILE, 'utf-8'));
      }
    } catch (e) {}
    return [];
  }

  saveTasks() {
    try {
      fs.writeFileSync(TASKS_FILE, JSON.stringify(this.tasks, null, 2), 'utf-8');
    } catch (e) {}
  }

  /**
   * Khởi chạy toàn bộ các tác vụ nền đang kích hoạt khi khởi động bot
   */
  startScheduler() {
    console.log(`⏱️ [BACKGROUND SCHEDULER] Đang nạp ${this.tasks.length} tác vụ ngầm...`);
    const now = Date.now();

    this.tasks.forEach(task => {
      if (task.status === 'ACTIVE') {
        if (task.type === 'once') {
          const delay = task.triggerTime - now;
          if (delay > 0) {
            this.scheduleOneShot(task, delay);
          } else {
            // Đã quá hạn trong lúc bot tắt -> thực thi ngay
            this.executeTask(task);
          }
        } else if (task.type === 'interval') {
          this.scheduleInterval(task, task.intervalMs);
        }
      }
    });
  }

  /**
   * Tạo tác vụ ngầm mới (Nhắc nhở / Lên lịch / Theo dõi định kỳ)
   */
  createTask({ chatId, senderName, title, type = 'once', delayMinutes = 0, intervalMinutes = 0, actionPrompt = '' }) {
    const id = 'task_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    const now = Date.now();
    let triggerTime = now;
    let intervalMs = 0;

    if (type === 'once') {
      const delayMs = Math.max(1, delayMinutes) * 60 * 1000;
      triggerTime = now + delayMs;
    } else if (type === 'interval') {
      intervalMs = Math.max(1, intervalMinutes) * 60 * 1000;
      triggerTime = now + intervalMs;
    }

    const newTask = {
      id,
      chatId,
      senderName,
      title,
      type,
      actionPrompt,
      createdAt: new Date().toISOString(),
      triggerTime,
      intervalMs,
      status: 'ACTIVE'
    };

    this.tasks.push(newTask);
    this.saveTasks();

    if (type === 'once') {
      this.scheduleOneShot(newTask, triggerTime - now);
    } else if (type === 'interval') {
      this.scheduleInterval(newTask, intervalMs);
    }

    return newTask;
  }

  scheduleOneShot(task, delayMs) {
    const timer = setTimeout(async () => {
      await this.executeTask(task);
      task.status = 'COMPLETED';
      task.completedAt = new Date().toISOString();
      this.saveTasks();
      this.activeTimers.delete(task.id);
    }, delayMs);

    this.activeTimers.set(task.id, timer);
  }

  scheduleInterval(task, intervalMs) {
    const timer = setInterval(async () => {
      if (task.status === 'ACTIVE') {
        await this.executeTask(task);
      }
    }, intervalMs);

    this.activeTimers.set(task.id, timer);
  }

  /**
   * Thực thi tác vụ nền và chủ động gửi tin nhắn Zalo thông báo
   */
  async executeTask(task) {
    console.log(`🔔 [BACKGROUND TASK TRIGGERED] Thực thi tác vụ #${task.id}: "${task.title}" cho ${task.senderName} (${task.chatId})`);

    let executionResultText = '';
    if (this.taskExecutorCallback && task.actionPrompt) {
      try {
        const aiResult = await this.taskExecutorCallback(task.actionPrompt, task.senderName, task.chatId);
        executionResultText = typeof aiResult === 'object' ? aiResult.text : aiResult;
      } catch (e) {
        executionResultText = `⚠️ Không thể xử lý tác vụ thông minh: ${e.message}`;
      }
    }

    const message = executionResultText 
      ? `⏰ [THÔNG BÁO TÁC VỤ NGẦM: ${task.title}]\n\n${executionResultText}`
      : `⏰ [NHẮC NHỞ TỰ ĐỘNG]\n\nChào bạn ${task.senderName}, đây là thông báo nhắc nhở đã lên lịch:\n📌 **${task.title}**`;

    if (this.messageSenderCallback && task.chatId) {
      try {
        await this.messageSenderCallback(task.chatId, message);
        console.log(`✅ [PROACTIVE NOTIFICATION SENT] Đã gửi thông báo tác vụ #${task.id} tới Zalo ${task.chatId}`);
      } catch (err) {
        console.error(`❌ Không thể gửi tin nhắn chủ động tới ${task.chatId}:`, err.message);
      }
    }
  }

  cancelTask(taskId) {
    const task = this.tasks.find(t => t.id === taskId);
    if (!task) return { success: false, message: `Không tìm thấy tác vụ #${taskId}` };

    if (this.activeTimers.has(taskId)) {
      const timer = this.activeTimers.get(taskId);
      clearTimeout(timer);
      clearInterval(timer);
      this.activeTimers.delete(taskId);
    }

    task.status = 'CANCELLED';
    task.cancelledAt = new Date().toISOString();
    this.saveTasks();

    return { success: true, message: `Đã hủy thành công tác vụ #${taskId} (${task.title})` };
  }

  getActiveTasks() {
    return this.tasks.filter(t => t.status === 'ACTIVE');
  }

  getAllTasks() {
    return this.tasks;
  }
}

export const backgroundScheduler = new BackgroundTaskScheduler();
