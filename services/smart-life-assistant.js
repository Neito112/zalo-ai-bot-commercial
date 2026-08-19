import { backgroundScheduler } from './background-task-scheduler.js';

export class SmartLifeAssistant {
  /**
   * Tự động phân tích câu nói tiếng Việt để nhận diện lịch hẹn và nhắc nhở ngầm
   */
  detectAndScheduleImplicitTask(userPrompt, senderName, chatId) {
    const text = userPrompt.toLowerCase();

    // Nhận diện "nhắc", "hẹn giờ", "báo thức", "lên lịch"
    if (!text.includes('nhắc') && !text.includes('hẹn') && !text.includes('báo') && !text.includes('lịch')) {
      return null;
    }

    try {
      // 1. Nhận diện "X phút nữa", "X giây nữa", "X tiếng nữa"
      const relativeMatch = text.match(/(\d+)\s*(phút|tiếng|giờ|giây)\s*nữa/i);
      if (relativeMatch) {
        const num = parseInt(relativeMatch[1], 10);
        const unit = relativeMatch[2].toLowerCase();
        let delayMs = 60000;

        if (unit === 'giây') delayMs = num * 1000;
        else if (unit === 'phút') delayMs = num * 60 * 1000;
        else if (unit === 'tiếng' || unit === 'giờ') delayMs = num * 3600 * 1000;

        const scheduledTime = new Date(Date.now() + delayMs);
        const cron = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} * * *`;

        const task = backgroundScheduler.addTask({
          name: `Nhắc việc cho ${senderName}: "${userPrompt}"`,
          prompt: `Gửi tin nhắn nhắc nhở tự nhiên và chu đáo tới ${senderName} về việc: "${userPrompt}"`,
          chatId,
          senderName,
          schedule: cron,
          type: 'once'
        });

        console.log(`⏰ [LIFE ASSISTANT] Đã tự động lên lịch nhắc việc sau ${num} ${unit}: ${task.name}`);
        return { success: true, delayText: `${num} ${unit}`, task };
      }

      // 2. Nhận diện giờ cố định trong ngày: "X giờ", "Xh", "XhY"
      const timeMatch = text.match(/(\d{1,2})(?:h|:)(\d{1,2})?/i);
      if (timeMatch) {
        const hour = parseInt(timeMatch[1], 10);
        const minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
        const cron = `${minute} ${hour} * * *`;

        const task = backgroundScheduler.addTask({
          name: `Lịch nhắc hẹn lúc ${hour}h${minute > 0 ? minute : ''} cho ${senderName}`,
          prompt: `Đã đến ${hour}h${minute > 0 ? minute : ''}, hãy gửi lời nhắc ân cần, tự nhiên tới ${senderName} về: "${userPrompt}"`,
          chatId,
          senderName,
          schedule: cron,
          type: 'once'
        });

        console.log(`⏰ [LIFE ASSISTANT] Đã tự động lên lịch nhắc việc vào lúc ${hour}h${minute}: ${task.name}`);
        return { success: true, timeText: `${hour}h${minute > 0 ? minute : ''}`, task };
      }
    } catch (e) {
      console.warn('⚠️ Lỗi phân tích lịch ngầm:', e.message);
    }

    return null;
  }
}

export const smartLifeAssistant = new SmartLifeAssistant();
