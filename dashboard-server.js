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

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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
    apiKeys: keys,
    activeModel: botConfig.activeModel,
    temperature: botConfig.temperature,
    customSystemPrompt: botConfig.customSystemPrompt,
    zaloToken: process.env.ZALO_BOT_TOKEN ? `${process.env.ZALO_BOT_TOKEN.slice(0, 10)}...` : '',
    modelsPool: MODELS_POOL
  });
});

// POST Config Update
app.post('/api/config', async (req, res) => {
  const { apiKeys, activeModel, customSystemPrompt, temperature, zaloToken } = req.body;

  if (activeModel) botConfig.activeModel = activeModel;
  if (customSystemPrompt !== undefined) botConfig.customSystemPrompt = customSystemPrompt;
  if (temperature !== undefined) botConfig.temperature = temperature;

  const envPath = path.resolve('.env');
  let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
  let lines = envContent.split('\n');

  if (zaloToken && !zaloToken.includes('...')) {
    process.env.ZALO_BOT_TOKEN = zaloToken.trim();
    lines = lines.filter(line => !line.trim().startsWith('ZALO_BOT_TOKEN'));
    lines.unshift(`ZALO_BOT_TOKEN=${zaloToken.trim()}`);
    // Restart bot with new token
    await botServiceManager.restart();
  }

  if (Array.isArray(apiKeys)) {
    // Remove existing GEMINI_API_KEY lines
    lines = lines.filter(line => !line.trim().startsWith('GEMINI_API_KEY'));

    // Append new keys
    apiKeys.forEach((key, index) => {
      lines.push(`GEMINI_API_KEY_${index + 1}=${key.trim()}`);
      process.env[`GEMINI_API_KEY_${index + 1}`] = key.trim();
    });

    agentEvents.emit('config_updated', { message: 'Đã cập nhật danh sách API Keys mới' });
  }

  fs.writeFileSync(envPath, lines.join('\n'), 'utf-8');

  res.json({ success: true, message: 'Cấu hình đã được cập nhật thành công!' });
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

// Chat Test Simulator
app.post('/api/chat/test', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const result = await processUserRequest(prompt, 'Admin Dashboard', 'dashboard_test_session');
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
