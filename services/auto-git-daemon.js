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
    console.log('🔨 [AUTO-BUILD] Đang cập nhật ứng dụng Desktop hoàn chỉnh ngay trong thư mục dự án...');
    
    // 1. Thư mục build_dist
    const distAppDir = path.join(RND_DIR, 'build_dist', 'Zalo AI Bot Control Center-win32-x64', 'resources', 'app');
    // 2. Thư mục bản chạy ngay tại gốc dự án (Zalo-AI-Bot-App)
    const localAppRoot = path.join(RND_DIR, 'Zalo-AI-Bot-App');
    const localAppDir = path.join(localAppRoot, 'resources', 'app');

    const srcServices = path.join(RND_DIR, 'services');
    const serviceFiles = fs.readdirSync(srcServices);
    const rootFiles = ['ai-agent.js', 'bot-service.js', 'dashboard-server.js', 'package.json', 'electron-main.cjs', 'dashboard.html', 'README.md'];

    // Cập nhật bản build_dist
    if (fs.existsSync(distAppDir)) {
      const destServices = path.join(distAppDir, 'services');
      if (!fs.existsSync(destServices)) fs.mkdirSync(destServices, { recursive: true });
      for (const file of serviceFiles) {
        fs.copyFileSync(path.join(srcServices, file), path.join(destServices, file));
      }
      for (const rf of rootFiles) {
        const sf = path.join(RND_DIR, rf);
        const df = path.join(distAppDir, rf);
        if (fs.existsSync(sf)) fs.copyFileSync(sf, df);
      }
    } else {
      await execPromise('npx electron-packager . "Zalo AI Bot Control Center" --platform=win32 --arch=x64 --out=build_dist --overwrite', {
        cwd: RND_DIR
      });
    }

    // Cập nhật bản chạy ngay trong thư mục dự án (Zalo-AI-Bot-App)
    if (!fs.existsSync(localAppRoot)) {
      const distSource = path.join(RND_DIR, 'build_dist', 'Zalo AI Bot Control Center-win32-x64');
      if (fs.existsSync(distSource)) {
        fs.cpSync(distSource, localAppRoot, { recursive: true });
      }
    } else if (fs.existsSync(localAppDir)) {
      const destServicesLocal = path.join(localAppDir, 'services');
      if (!fs.existsSync(destServicesLocal)) fs.mkdirSync(destServicesLocal, { recursive: true });
      for (const file of serviceFiles) {
        fs.copyFileSync(path.join(srcServices, file), path.join(destServicesLocal, file));
      }
      for (const rf of rootFiles) {
        const sf = path.join(RND_DIR, rf);
        const df = path.join(localAppDir, rf);
        if (fs.existsSync(sf)) fs.copyFileSync(sf, df);
      }
    }

    // Tạo file khởi chạy nhanh CHAY_APP.bat ngay tại gốc dự án
    const batPath = path.join(RND_DIR, 'CHAY_APP.bat');
    const batContent = `@echo off\r\nstart "" "%~dp0Zalo-AI-Bot-App\\Zalo AI Bot Control Center.exe"\r\n`;
    fs.writeFileSync(batPath, batContent, 'utf-8');

    console.log(`✅ [AUTO-BUILD] Đã build & cập nhật thành công 2 bản ứng dụng Desktop (${serviceFiles.length} engines):`);
    console.log(`   👉 Bản trong thư mục dự án: ${localAppRoot}`);
    console.log(`   👉 Bản phân phối build_dist: ${path.join(RND_DIR, 'build_dist', 'Zalo AI Bot Control Center-win32-x64')}`);
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

