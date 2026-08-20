import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = util.promisify(exec);
const RND_DIR = path.resolve('c:/Users/HOMIE/Downloads/zalo-bot-chat');
const COMM_DIR = path.resolve('c:/Users/HOMIE/Downloads/zalo-bot-commercial');

let isSyncing = false;
let syncTimeout = null;

export async function executeDirectSync(commitMessage = 'auto: silent background brain & capabilities synchronization') {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const timeStr = new Date().toLocaleString('vi-VN');
    const fullMsg = `${commitMessage} (${timeStr})`;

    // 1. Sync R&D Repo
    if (fs.existsSync(RND_DIR)) {
      try {
        await execPromise(`git -C "${RND_DIR}" add .`);
        try {
          await execPromise(`git -C "${RND_DIR}" commit -m "${fullMsg}"`);
        } catch (e) {}
        await execPromise(`git -C "${RND_DIR}" push origin master`);
        console.log(`✅ [AUTO-GIT-DAEMON] Đã đẩy R&D Repo lên GitHub Cloud.`);
      } catch (e) {
        console.warn('R&D Push warning:', e.message);
      }
    }

    // 2. Sync Commercial Repo
    if (fs.existsSync(COMM_DIR)) {
      try {
        const srcServicesDir = path.join(RND_DIR, 'services');
        const destServicesDir = path.join(COMM_DIR, 'services');
        if (!fs.existsSync(destServicesDir)) fs.mkdirSync(destServicesDir, { recursive: true });

        if (fs.existsSync(srcServicesDir)) {
          const serviceFiles = fs.readdirSync(srcServicesDir);
          for (const file of serviceFiles) {
            fs.copyFileSync(path.join(srcServicesDir, file), path.join(destServicesDir, file));
          }
        }

        const rootFiles = ['ai-agent.js', 'bot-service.js', 'dashboard-server.js', 'package.json', 'README.md'];
        for (const rf of rootFiles) {
          const srcF = path.join(RND_DIR, rf);
          const destF = path.join(COMM_DIR, rf);
          if (fs.existsSync(srcF)) {
            fs.copyFileSync(srcF, destF);
          }
        }

        await execPromise(`git -C "${COMM_DIR}" add .`);
        try {
          await execPromise(`git -C "${COMM_DIR}" commit -m "${fullMsg}"`);
        } catch (e) {}
        await execPromise(`git -C "${COMM_DIR}" push origin master`);
        console.log(`✅ [AUTO-GIT-DAEMON] Đã đẩy Commercial Repo lên GitHub Cloud.`);
      } catch (e) {
        console.warn('Commercial Push warning:', e.message);
      }
    }
  } catch (err) {
    console.error('Lỗi Daemon Sync:', err.message);
  } finally {
    isSyncing = false;
  }
}

export function triggerSilentGitSync(commitMessage = 'auto: silent background brain & capabilities synchronization') {
  if (syncTimeout) clearTimeout(syncTimeout);

  syncTimeout = setTimeout(() => {
    executeDirectSync(commitMessage).catch(console.error);
  }, 1000);
}
