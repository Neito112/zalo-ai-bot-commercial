import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = util.promisify(exec);
const RND_DIR = path.resolve('c:/Users/HOMIE/Downloads/zalo-bot-chat');
const COMM_DIR = path.resolve('c:/Users/HOMIE/Downloads/zalo-bot-commercial');

let isSyncing = false;
let syncTimeout = null;

/**
 * Tự động đồng bộ và cập nhật bản ứng dụng Desktop hoàn chỉnh sau mỗi chu kỳ nghiên cứu
 */
export async function rebuildStandaloneApp() {
  try {
    console.log('🔨 [AUTO-BUILD] Đang cập nhật ứng dụng Desktop hoàn chỉnh...');
    
    const appDir = path.join(RND_DIR, 'build_dist', 'Zalo AI Bot Control Center-win32-x64', 'resources', 'app');
    if (fs.existsSync(appDir)) {
      const srcServices = path.join(RND_DIR, 'services');
      const destServices = path.join(appDir, 'services');
      if (!fs.existsSync(destServices)) fs.mkdirSync(destServices, { recursive: true });
      
      const serviceFiles = fs.readdirSync(srcServices);
      for (const file of serviceFiles) {
        fs.copyFileSync(path.join(srcServices, file), path.join(destServices, file));
      }

      const rootFiles = ['ai-agent.js', 'bot-service.js', 'dashboard-server.js', 'package.json', 'electron-main.cjs', 'dashboard.html', 'README.md'];
      for (const rf of rootFiles) {
        const sf = path.join(RND_DIR, rf);
        const df = path.join(appDir, rf);
        if (fs.existsSync(sf)) fs.copyFileSync(sf, df);
      }
      console.log(`✅ [AUTO-BUILD] Đã cập nhật ${serviceFiles.length} engines và toàn bộ mã nguồn vào bản Desktop hoàn chỉnh.`);
    } else {
      await execPromise('npx electron-packager . "Zalo AI Bot Control Center" --platform=win32 --arch=x64 --out=build_dist --overwrite', {
        cwd: RND_DIR
      });
      console.log('✅ [AUTO-BUILD] Đã đóng gói thành công bản Desktop mới tại build_dist.');
    }
  } catch (err) {
    console.warn('⚠️ [AUTO-BUILD] Cảnh báo đóng gói Desktop:', err.message);
  }
}

export async function executeDirectSync(commitMessage = 'auto: silent background brain & capabilities synchronization') {
  if (isSyncing) return;
  isSyncing = true;

  try {
    const timeStr = new Date().toLocaleString('vi-VN');
    const fullMsg = `${commitMessage} (${timeStr})`;

    // 0. Tự động build lại bản ứng dụng Desktop hoàn chỉnh
    await rebuildStandaloneApp();

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

export function startAutoGitWatcher(intervalMinutes = 15) {
  console.log(`🛡️ [AUTO-GIT-DAEMON] Khởi động trình giám sát đồng bộ ngầm & Rebuild Desktop tự động (chu kỳ ${intervalMinutes} phút)...`);
  setInterval(() => {
    executeDirectSync('auto: periodic silent background git sync & desktop rebuild').catch(() => {});
  }, intervalMinutes * 60 * 1000);
}

