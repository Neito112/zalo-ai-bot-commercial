import fs from 'fs';
import path from 'path';

const MEMORY_FILE = path.resolve('conversation-memory.json');

class MemoryStore {
  constructor() {
    this.sessions = new Map(); // chatId -> array of { role, content, timestamp }
    this.longTermMemories = {}; // chatId -> key/value facts
    this.userProfiles = {}; // chatId -> { preferredName, stylePreferences, habits, learnedNotes: [] }
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(MEMORY_FILE)) {
        const data = JSON.parse(fs.readFileSync(MEMORY_FILE, 'utf-8'));
        this.longTermMemories = data.longTerm || {};
        this.userProfiles = data.userProfiles || {};
        if (data.sessions) {
          for (const [k, v] of Object.entries(data.sessions)) {
            this.sessions.set(k, v);
          }
        }
      }
    } catch (e) {
      console.error('Error loading memory store:', e.message);
    }
  }

  save() {
    try {
      const obj = {
        longTerm: this.longTermMemories,
        userProfiles: this.userProfiles,
        sessions: Object.fromEntries(this.sessions)
      };
      fs.writeFileSync(MEMORY_FILE, JSON.stringify(obj, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving memory store:', e.message);
    }
  }

  getHistory(chatId, limit = 12) {
    const list = this.sessions.get(chatId) || [];
    return list.slice(-limit);
  }

  addMessage(chatId, role, content) {
    if (!this.sessions.has(chatId)) {
      this.sessions.set(chatId, []);
    }
    const list = this.sessions.get(chatId);
    list.push({ role, content, time: new Date().toISOString() });
    if (list.length > 30) {
      list.splice(0, list.length - 30);
    }
    this.save();
  }

  setLongTermFact(chatId, key, value) {
    if (!this.longTermMemories[chatId]) {
      this.longTermMemories[chatId] = {};
    }
    this.longTermMemories[chatId][key] = value;
    this.save();
  }

  getLongTermFacts(chatId) {
    return this.longTermMemories[chatId] || {};
  }

  getUserProfile(chatId) {
    return this.userProfiles[chatId] || {
      preferredName: '',
      habits: [],
      learnedNotes: []
    };
  }

  updateUserProfile(chatId, profileUpdate = {}) {
    if (!this.userProfiles[chatId]) {
      this.userProfiles[chatId] = {
        preferredName: '',
        habits: [],
        learnedNotes: []
      };
    }

    const current = this.userProfiles[chatId];
    if (profileUpdate.preferredName) current.preferredName = profileUpdate.preferredName;
    if (Array.isArray(profileUpdate.habits)) {
      current.habits = [...new Set([...current.habits, ...profileUpdate.habits])].slice(-15);
    }
    if (profileUpdate.learnedNote) {
      current.learnedNotes = current.learnedNotes || [];
      current.learnedNotes.unshift({
        note: profileUpdate.learnedNote,
        time: new Date().toISOString()
      });
      if (current.learnedNotes.length > 20) current.learnedNotes.pop();
    }

    this.save();
  }

  clear(chatId) {
    if (chatId) {
      this.sessions.delete(chatId);
      delete this.longTermMemories[chatId];
      delete this.userProfiles[chatId];
    } else {
      this.sessions.clear();
      this.longTermMemories = {};
      this.userProfiles = {};
    }
    this.save();
  }

  getAllData() {
    return {
      sessionsCount: this.sessions.size,
      longTermMemories: this.longTermMemories,
      userProfiles: this.userProfiles,
      sessions: Object.fromEntries(this.sessions)
    };
  }
}

export const memoryStore = new MemoryStore();
