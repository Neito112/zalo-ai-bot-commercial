import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = util.promisify(exec);

export class CloudBrainSync {
  constructor() {
    this.repoUrl = 'https://github.com/Neito112/zalo-ai-bot-commercial';
    this.brainFiles = [
      'knowledge-base.json',
      'conversation-memory.json',
      'evolution-log.json'
    ];
  }

  /**
   * Backup local brain knowledge and memory to GitHub Cloud
   */
  async backupToCloud(commitMsg = null) {
    try {
      const timestamp = new Date().toLocaleString('vi-VN');
      const message = commitMsg || `brain: auto-backup brain memory & evolution knowledge (${timestamp})`;

      // Git add specific brain files
      await execPromise(`git add knowledge-base.json conversation-memory.json evolution-log.json`);
      
      // Git commit
      try {
        await execPromise(`git commit -m "${message}"`);
      } catch (commitErr) {
        if (commitErr.stdout?.includes('nothing to commit') || commitErr.message?.includes('nothing to commit')) {
          return { success: true, message: 'Tri thức não bộ đã ở trạng thái mới nhất trên đám mây, không có thay đổi mới.' };
        }
      }

      // Git push
      await execPromise(`git push origin master`);

      return {
        success: true,
        message: `☁️ Đã sao lưu thành công toàn bộ Não Bộ (Trí nhớ, Tri thức, Nhật ký tiến hóa) lên GitHub Đám Mây!`,
        timestamp
      };
    } catch (err) {
      return {
        success: false,
        message: `⚠️ Lỗi sao lưu lên đám mây: ${err.message}`
      };
    }
  }

  /**
   * Sync brain knowledge from GitHub Cloud to local
   */
  async syncFromCloud() {
    try {
      await execPromise(`git pull origin master`);

      return {
        success: true,
        message: `📥 Đã đồng bộ thành công phiên bản Não Bộ mới nhất từ GitHub Đám Mây về máy!`
      };
    } catch (err) {
      return {
        success: false,
        message: `⚠️ Lỗi đồng bộ từ đám mây: ${err.message}`
      };
    }
  }

  getStatus() {
    let localKnowledgeCount = 0;
    let localMemoryCount = 0;

    try {
      if (fs.existsSync('knowledge-base.json')) {
        localKnowledgeCount = JSON.parse(fs.readFileSync('knowledge-base.json', 'utf-8')).length || 0;
      }
      if (fs.existsSync('conversation-memory.json')) {
        const mem = JSON.parse(fs.readFileSync('conversation-memory.json', 'utf-8'));
        localMemoryCount = Object.keys(mem.sessions || {}).length || 0;
      }
    } catch (e) {}

    return {
      repoUrl: this.repoUrl,
      localKnowledgeCount,
      localMemoryCount,
      lastSync: new Date().toISOString()
    };
  }
}

export const cloudBrainSync = new CloudBrainSync();
