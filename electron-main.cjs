const { app, BrowserWindow, Tray, Menu, nativeImage, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow = null;
let tray = null;
let serverProcess = null;
let isQuitting = false;

const PORT = 3000;
const SERVER_URL = `http://localhost:${PORT}`;

// Create an SVG-based / canvas-based tray icon
function createTrayIcon() {
  // 16x16 PNG base64 icon representing an AI Brain / Robot
  const iconBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAEISURBVDhPY/wPBAxUABgYGBj+//8PA4yMDOiCjIwwPkwfxMdgmpHFAfL//4drZkA2gK4ZZhCiGZkBpAZiMEwzkgKwbEA2CMYGiDMwP4AMQDYIF2bYDMGnM6A4AxZDiDFjMAeAcQYkMQwD0A0A+4EIw1wAsmFAmEFEjVBgGIyGYwDKmDFiGUDIfwyo/scwhxQjMPEFjE9nQIoxAAYzIAuAjcCGsWAGIAOYkGIIQx4mDMgG4HIEjGFjGgVDFsA4A5gM00wSgGEABi5mkgG4gA0kGBiA+AAMB4BhABIDwQ5gAAzF6IYBqGEAuhlkGEL9gO4bYDAAoYZhAIyPqRsG4AIsjIwwD8A8sAcHkAgAAO/pY9H442yFAAAAAElFTkSuQmCC';
  return nativeImage.createFromDataURL(`data:image/png;base64,${iconBase64}`);
}

async function startBackendServer() {
  try {
    console.log('🚀 Starting Embedded Dashboard Server in Electron...');
    await import('./dashboard-server.js');
    console.log('✅ Embedded Dashboard Server started on port ' + PORT);
  } catch (err) {
    console.error('Failed to import dashboard-server.js, falling back to spawn:', err);
    serverProcess = spawn(process.execPath, [path.join(__dirname, 'dashboard-server.js')], {
      cwd: __dirname,
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1', PORT: PORT.toString() },
      stdio: 'ignore',
      windowsHide: true
    });
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 540,
    height: 750,
    minWidth: 480,
    minHeight: 650,
    title: 'Zalo AI Bot Control Center',
    icon: createTrayIcon(),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    autoHideMenuBar: true,
    backgroundColor: '#0b0f19'
  });

  // Load dashboard
  const loadDashboard = () => {
    mainWindow.loadURL(SERVER_URL).catch(() => {
      setTimeout(loadDashboard, 1000);
    });
  };

  setTimeout(loadDashboard, 800);

  // Minimize to tray on close
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function setupSystemTray() {
  const icon = createTrayIcon();
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: '🧠 Mở Dashboard Điều Khiển',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      }
    },
    { type: 'separator' },
    {
      label: '☁️ Sao Lưu Não Bộ Lên GitHub',
      click: async () => {
        try {
          const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
          await fetch(`${SERVER_URL}/api/cloud/backup`, { method: 'POST' });
        } catch (e) {}
      }
    },
    {
      label: '🔄 Khởi Động Lại Bot',
      click: async () => {
        try {
          const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
          await fetch(`${SERVER_URL}/api/bot/restart`, { method: 'POST' });
        } catch (e) {}
      }
    },
    { type: 'separator' },
    {
      label: '❌ Thoát Ứng Dụng Hoàn Toàn',
      click: () => {
        isQuitting = true;
        if (serverProcess) {
          serverProcess.kill();
        }
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Zalo AI Bot - Omnipotent Brain (Đang chạy ngầm)');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

// App lifecycle
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    startBackendServer();
    createWindow();
    setupSystemTray();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('before-quit', () => {
    isQuitting = true;
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  app.on('window-all-closed', () => {
    // Keep app running in background tray
  });
}
