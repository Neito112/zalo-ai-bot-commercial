import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';
import { botServiceManager } from './bot-service.js';
import { processUserRequest, agentEvents, botConfig, collectApiKeys, MODELS_POOL } from './ai-agent.js';
import { memoryStore } from './services/memory-store.js';
import { researchEngine } from './services/auto-research-loop.js';
import { cloudBrainSync } from './services/cloud-brain-sync.js';
import { KNOWN_MCP_REGISTRY, mcpAutoProvisioner } from './services/mcp-auto-provisioner.js';
import { githubAuthGuard } from './services/github-auth-guard.js';
import { backgroundScheduler } from './services/background-task-scheduler.js';
import { proactiveScout } from './services/autonomous-proactive-scout.js';
import { localModelClient } from './services/local-model-client.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/audio', express.static('generated_audio'));
app.use('/media', express.static('generated_media'));

// SSE Clients List
const sseClients = new Set();

// Forward all agent events to SSE stream
agentEvents.subscribe((type, data) => {
  const payload = JSON.stringify({ type, data, timestamp: new Date().toISOString() });
  for (const client of sseClients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch (e) {
      sseClients.delete(client);
    }
  }
});

// GET Status
app.get('/api/status', (req, res) => {
  const status = botServiceManager.getStatus();
  const keys = collectApiKeys();
  const memoryData = memoryStore.getAllData();

  res.json({
    ...status,
    activeKeysCount: keys.length,
    activeModel: botConfig.activeModel,
    modelsPool: MODELS_POOL,
    sessionsCount: memoryData.sessionsCount
  });
});

// GET Config
app.get('/api/config', (req, res) => {
  const keys = collectApiKeys();
  res.json({
    provider: botConfig.provider || 'gemini',
    activeModel: botConfig.activeModel,
    localEndpoint: botConfig.localEndpoint || 'http://localhost:11434/v1',
    localModelName: botConfig.localModelName || 'llama3',
    temperature: botConfig.temperature,
    customSystemPrompt: botConfig.customSystemPrompt,
    apiKeys: keys,
    zaloToken: process.env.ZALO_BOT_TOKEN || '',
    modelsPool: MODELS_POOL
  });
});

// POST Config Update
app.post('/api/config', async (req, res) => {
  const { provider, activeModel, localEndpoint, localModelName, customSystemPrompt, temperature, apiKeys, zaloToken } = req.body;

  if (provider) botConfig.provider = provider;
  if (activeModel) botConfig.activeModel = activeModel;
  if (localEndpoint) botConfig.localEndpoint = localEndpoint;
  if (localModelName) botConfig.localModelName = localModelName;
  if (customSystemPrompt !== undefined) botConfig.customSystemPrompt = customSystemPrompt;
  if (temperature !== undefined) botConfig.temperature = temperature;

  const envPath = path.resolve('.env');
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
  let envModified = false;
  let tokenChanged = false;

  if (zaloToken !== undefined && zaloToken !== null) {
    const cleanToken = zaloToken.trim();
    if (cleanToken && cleanToken !== process.env.ZALO_BOT_TOKEN) {
      process.env.ZALO_BOT_TOKEN = cleanToken;
      tokenChanged = true;
      if (envContent.includes('ZALO_BOT_TOKEN=')) {
        envContent = envContent.replace(/ZALO_BOT_TOKEN=.*/, `ZALO_BOT_TOKEN=${cleanToken}`);
      } else {
        envContent += `\nZALO_BOT_TOKEN=${cleanToken}`;
      }
      envModified = true;
    }
  }

  if (Array.isArray(apiKeys)) {
    // Remove existing GEMINI_API_KEY lines
    const lines = envContent.split('\n').filter(line => !line.trim().startsWith('GEMINI_API_KEY'));

    // Append new keys
    apiKeys.forEach((key, index) => {
      lines.push(`GEMINI_API_KEY_${index + 1}=${key.trim()}`);
      process.env[`GEMINI_API_KEY_${index + 1}`] = key.trim();
    });

    envContent = lines.join('\n');
    envModified = true;
    agentEvents.emit('config_updated', { message: 'Đã cập nhật danh sách API Keys mới' });
  }

  if (envModified) {
    fs.writeFileSync(envPath, envContent, 'utf-8');
  }

  if (tokenChanged) {
    console.log('🔄 Zalo Bot Token đã thay đổi, đang khởi động lại kết nối bot...');
    await botServiceManager.restart();
  }

  res.json({ success: true, message: 'Cấu hình API & Máy chủ đã được cập nhật thành công!' });
});

// Discover Local Models (Ollama, LM Studio, etc.)
app.get('/api/local-models/discover', async (req, res) => {
  const endpoint = req.query.endpoint || botConfig.localEndpoint || 'http://localhost:11434/v1';
  const result = await localModelClient.discoverLocalModels(endpoint);
  res.json(result);
});

// Bot Control: Start / Stop / Restart
app.post('/api/bot/start', async (req, res) => {
  const started = await botServiceManager.start();
  res.json({ success: started, message: started ? 'Bot đã khởi động' : 'Không thể khởi động bot' });
});

app.post('/api/bot/stop', async (req, res) => {
  const stopped = await botServiceManager.stop();
  res.json({ success: stopped, message: stopped ? 'Bot đã dừng' : 'Không thể dừng bot' });
});

app.post('/api/bot/restart', async (req, res) => {
  const restarted = await botServiceManager.restart();
  res.json({ success: restarted, message: restarted ? 'Bot đã khởi động lại' : 'Lỗi khi khởi động lại' });
});

// Chat Test Simulator (Supports Image & Text)
app.post('/api/chat/test', async (req, res) => {
  const { prompt, image } = req.body;
  if (!prompt && !image) return res.status(400).json({ error: 'Missing prompt or image' });

  try {
    const promptText = prompt || 'Hãy quan sát thật tỉ mỉ bức ảnh này: đọc toàn bộ chữ (OCR), nhận diện sự vật, tình huống và phân tích chi tiết:';
    const result = await processUserRequest(promptText, 'Admin Dashboard', 'dashboard_test_session', image || null);
    res.json(typeof result === 'object' ? result : { text: result, media: null });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Memory Inspector
app.get('/api/memory', (req, res) => {
  res.json(memoryStore.getAllData());
});

app.post('/api/memory/clear', (req, res) => {
  memoryStore.clear();
  res.json({ success: true, message: 'Đã dọn dẹp toàn bộ bộ nhớ' });
});

// Research Engine Endpoints
app.get('/api/research/status', (req, res) => {
  res.json(researchEngine.getStatus());
});

app.post('/api/research/trigger', async (req, res) => {
  await researchEngine.runSingleResearchCycle();
  res.json({ success: true, message: 'Đã hoàn thành 1 chu kỳ nghiên cứu!' });
});

app.post('/api/research/toggle', (req, res) => {
  if (researchEngine.isRunning) {
    researchEngine.stop();
  } else {
    researchEngine.start(45);
  }
  res.json({ isRunning: researchEngine.isRunning });
});

// Cloud Brain Sync Endpoints
app.get('/api/cloud/status', (req, res) => {
  res.json(cloudBrainSync.getStatus());
});

app.post('/api/cloud/backup', async (req, res) => {
  const result = await cloudBrainSync.backupToCloud(req.body?.commitMsg);
  res.json(result);
});

app.post('/api/cloud/sync', async (req, res) => {
  const result = await cloudBrainSync.syncFromCloud();
  res.json(result);
});

// Background Tasks & Scheduler Endpoints
app.get('/api/tasks/list', (req, res) => {
  res.json({
    active: backgroundScheduler.getActiveTasks(),
    all: backgroundScheduler.getAllTasks()
  });
});

app.post('/api/tasks/cancel', (req, res) => {
  const { taskId } = req.body;
  if (!taskId) return res.status(400).json({ error: 'Missing taskId' });
  const result = backgroundScheduler.cancelTask(taskId);
  res.json(result);
});

// Autonomous Scout Endpoints
app.get('/api/scout/status', (req, res) => {
  res.json(proactiveScout.getStatus());
});

app.post('/api/scout/trigger', async (req, res) => {
  await proactiveScout.runSingleRoamCycle();
  res.json({ success: true, message: 'Đã hoàn thành 1 chu kỳ thám hiểm mạng tự chủ!' });
});

// MCP Hub Endpoints
app.get('/api/mcp/registry', (req, res) => {
  res.json({
    known: KNOWN_MCP_REGISTRY,
    connected: mcpAutoProvisioner.getConnectedServers()
  });
});

app.post('/api/mcp/setup', async (req, res) => {
  const { appName, credentials } = req.body;
  if (!appName) return res.status(400).json({ error: 'Missing appName' });
  const result = await mcpAutoProvisioner.provisionMcp(appName, credentials || {});
  res.json(result);
});

// GitHub Authentication & Lock Guard
app.get('/api/auth/status', (req, res) => {
  res.json(githubAuthGuard.getStatus());
});

app.post('/api/auth/login', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Missing GitHub token' });
  const result = await githubAuthGuard.verifyGitHubToken(token);
  res.json(result);
});

app.post('/api/auth/logout', (req, res) => {
  githubAuthGuard.clearAuth();
  res.json({ success: true, message: 'Đã đăng xuất GitHub' });
});

// SSE Log Stream
app.get('/api/logs/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  sseClients.add(res);

  req.on('close', () => {
    sseClients.delete(res);
  });
});

// Start Server and Polling
app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🧠 Zalo AI Bot Omnipotent Dashboard running at:`);
  console.log(`👉 http://localhost:${PORT}`);
  console.log(`======================================================\n`);

  // Auto-start bot polling service
  await botServiceManager.start();

  // Auto-start autonomous research & self-evolution loop (every 45s)
  researchEngine.start(45);
});
