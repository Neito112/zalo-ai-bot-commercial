import fs from 'fs';
import path from 'path';
import { callWorkspaceTool } from './workspace-client.js';

const INBOX_PATH = path.join(process.cwd(), 'zalo-inbox.json');

// Ensure inbox file exists
if (!fs.existsSync(INBOX_PATH)) {
  fs.writeFileSync(INBOX_PATH, JSON.stringify([], null, 2));
}

// Write incoming message to inbox
export function enqueueZaloMessage(chatId, senderName, text) {
  try {
    const data = JSON.parse(fs.readFileSync(INBOX_PATH, 'utf8') || '[]');
    const newMsg = {
      id: `msg_${Date.now()}`,
      chat_id: chatId,
      sender: senderName,
      text: text,
      timestamp: new Date().toISOString(),
      status: 'pending',
      response: null
    };
    data.push(newMsg);
    fs.writeFileSync(INBOX_PATH, JSON.stringify(data, null, 2));
    console.log(`📬 Enqueued Zalo message [${newMsg.id}] to AI Agent Inbox!`);
    return newMsg;
  } catch (err) {
    console.error('Error enqueuing message:', err);
  }
}

// Read pending messages for AI Agent
export function getPendingZaloMessages() {
  try {
    const data = JSON.parse(fs.readFileSync(INBOX_PATH, 'utf8') || '[]');
    return data.filter(m => m.status === 'pending');
  } catch (err) {
    return [];
  }
}

// Update message response
export function updateZaloMessageResponse(msgId, responseText) {
  try {
    const data = JSON.parse(fs.readFileSync(INBOX_PATH, 'utf8') || '[]');
    const msg = data.find(m => m.id === msgId);
    if (msg) {
      msg.status = 'completed';
      msg.response = responseText;
      msg.completed_at = new Date().toISOString();
      fs.writeFileSync(INBOX_PATH, JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error('Error updating message response:', err);
  }
}
