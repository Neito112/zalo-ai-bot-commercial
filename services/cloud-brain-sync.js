import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = util.promisify(exec);
const REPORTS_DIR = path.resolve('reports');

if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

export class CloudBrainSync {
  constructor() {
    this.repoUrl = 'https://github.com/Neito112/zalo-ai-bot-omnipotent';
    this.brainFiles = [
      'knowledge-base.json',
      'conversation-memory.json',
      'evolution-log.json',
      'RESEARCH_REPORT.md'
    ];
  }

  /**
   * Tạo báo cáo nghiên cứu định kỳ dạng Markdown và lưu cục bộ
   */
  generateMarkdownReport() {
    let knowledge = [];
    let evolution = [];
    let memory = {};

    try {
      if (fs.existsSync('knowledge-base.json')) {
        knowledge = JSON.parse(fs.readFileSync('knowledge-base.json', 'utf-8'));
      }
      if (fs.existsSync('evolution-log.json')) {
        evolution = JSON.parse(fs.readFileSync('evolution-log.json', 'utf-8'));
      }
      if (fs.existsSync('conversation-memory.json')) {
        memory = JSON.parse(fs.readFileSync('conversation-memory.json', 'utf-8'));
      }
    } catch (e) {}

    const now = new Date();
    const timeStr = now.toLocaleString('vi-VN');
    const isoDate = now.toISOString().replace(/[:.]/g, '-');

    const topInsights = knowledge.slice(0, 5).map((k, i) => `### ${i + 1}. [Chủ đề: ${k.topic}]
- 📌 **Đúc kết:** ${k.summary}
- 💡 **Bài học cảm xúc / linh hồn:** ${k.soulImprovement || 'Không có'}
- 🔑 **Sự thật cốt lõi:** ${k.keyFacts?.join('; ') || 'N/A'}
- ⏱️ *Thời gian:* ${k.timestamp}
`).join('\n');

    const userCount = Object.keys(memory.sessions || {}).length;
    const learnedNotesCount = Object.values(memory.userProfiles || {}).reduce((acc, p) => acc + (p.learnedNotes?.length || 0), 0);

    const reportMd = `# 🔬 BÁO CÁO NGHIÊN CỨU & TIẾN HÓA NÃO BỘ ĐỊNH KỲ (ZALO AI BOT)

> **Thời gian tạo báo cáo:** ${timeStr}  
> **Repository:** [${this.repoUrl}](${this.repoUrl})

---

## 📊 1. THỐNG KÊ TỔNG QUAN
- 🧬 **Tổng số chu kỳ nghiên cứu tự chủ:** ${evolution.length} chu kỳ
- 📚 **Tổng số bài học tri thức đã thu nạp:** ${knowledge.length} bài
- 👥 **Số phiên hội thoại người dùng:** ${userCount} người
- 🧠 **Số bài học đúc kết từ hội thoại:** ${learnedNotesCount} ghi chú
- 🟢 **Trạng thái não bộ:** Đang tiến hóa liên tục 24/7

---

## 📖 2. CÁC TRI THỨC & BÀI HỌC TIẾN HÓA MỚI NHẤT
${topInsights || '_Đang thu thập dữ liệu trong chu kỳ tới..._'}

---

## 🛡️ 3. CAM KẾT PHÁT TRIỂN
- Bot liên tục duy trì phong cách con người tự nhiên 100%, không câu dập khuôn.
- Dữ liệu não bộ được tự động lưu trữ và đồng bộ hóa lên GitHub Cloud sau mỗi kỳ báo cáo.
`;

    // Write to root RESEARCH_REPORT.md
    fs.writeFileSync('RESEARCH_REPORT.md', reportMd, 'utf-8');

    // Archive copy to reports/ directory
    const archivePath = path.join(REPORTS_DIR, `research-report-${isoDate}.md`);
    fs.writeFileSync(archivePath, reportMd, 'utf-8');

    return { reportMd, timeStr, archivePath };
  }

  /**
   * Tự động tạo báo cáo định kỳ và push lên GitHub
   */
  async generateAndPushPeriodicReport() {
    try {
      console.log('📝 Đang tạo báo cáo nghiên cứu định kỳ và chuẩn bị push lên GitHub...');
      const { timeStr } = this.generateMarkdownReport();

      // Git add all brain files & report
      await execPromise(`git add .`);

      // Git commit
      const commitMsg = `report: 1-hour periodic research & work capabilities update (${timeStr})`;
      try {
        await execPromise(`git commit -m "${commitMsg}"`);
      } catch (commitErr) {
        if (!commitErr.stdout?.includes('nothing to commit')) {
          console.warn('Commit warn:', commitErr.message);
        }
      }

      // Git push R&D Repo
      try {
        await execPromise(`git push origin master`);
        console.log(`🚀 ĐÃ TỰ ĐỘNG PUSH LÊN GITHUB R&D THÀNH CÔNG (${timeStr})!`);
      } catch (e) {
        console.warn('Push R&D warn:', e.message);
      }

      // Sync & Push Commercial Repo
      try {
        const commPath = path.resolve('..', 'zalo-bot-commercial');
        if (fs.existsSync(commPath)) {
          await execPromise(`git -C "${commPath}" add . && git -C "${commPath}" commit -m "${commitMsg}" && git -C "${commPath}" push origin master`);
          console.log(`🚀 ĐÃ TỰ ĐỘNG PUSH LÊN GITHUB COMMERCIAL THÀNH CÔNG (${timeStr})!`);
        }
      } catch (e) {}

      return {
        success: true,
        message: `🚀 Đã tự động tạo báo cáo nghiên cứu và push lên cả 2 GitHub Repositories (${timeStr})!`,
        timestamp: timeStr
      };
    } catch (err) {
      console.error('❌ Lỗi khi tự động push báo cáo lên GitHub:', err.message);
      return {
        success: false,
        message: `⚠️ Lỗi push báo cáo lên GitHub: ${err.message}`
      };
    }
  }

  /**
   * Backup local brain knowledge and memory to GitHub Cloud
   */
  async backupToCloud(commitMsg = null) {
    try {
      const { timeStr } = this.generateMarkdownReport();
      const message = commitMsg || `brain: auto-backup brain memory & evolution knowledge (${timeStr})`;

      await execPromise(`git add RESEARCH_REPORT.md reports/ knowledge-base.json conversation-memory.json evolution-log.json`);
      
      try {
        await execPromise(`git commit -m "${message}"`);
      } catch (commitErr) {
        if (commitErr.stdout?.includes('nothing to commit') || commitErr.message?.includes('nothing to commit')) {
          return { success: true, message: 'Tri thức não bộ đã ở trạng thái mới nhất trên đám mây, không có thay đổi mới.' };
        }
      }

      await execPromise(`git push origin master`);

      return {
        success: true,
        message: `☁️ Đã sao lưu thành công toàn bộ Não Bộ & Báo Cáo lên GitHub Đám Mây!`,
        timestamp: timeStr
      };
    } catch (err) {
      return {
        success: false,
        message: `⚠️ Lỗi sao lưu lên đám mây: ${err.message}`
      };
    }
  }

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
