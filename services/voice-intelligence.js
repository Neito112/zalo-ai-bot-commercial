import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const AUDIO_OUTPUT_DIR = path.resolve('generated_audio');
if (!fs.existsSync(AUDIO_OUTPUT_DIR)) {
  fs.mkdirSync(AUDIO_OUTPUT_DIR, { recursive: true });
}

export class VoiceIntelligence {
  /**
   * Chuyển đổi văn bản tiếng Việt thành giọng nói tự nhiên MP3 (Text-to-Speech)
   */
  async synthesizeSpeech(text) {
    try {
      const cleanText = text.replace(/[*#_`>]/g, '').trim();
      if (!cleanText) {
        throw new Error('Văn bản rỗng.');
      }

      const fileName = `voice_${Date.now()}_${Math.floor(Math.random() * 1000)}.mp3`;
      const filePath = path.join(AUDIO_OUTPUT_DIR, fileName);

      // Chia văn bản thành các đoạn câu vừa phải (dưới 150 ký tự) để giọng đọc mượt mà
      const sentences = cleanText.match(/[^.!?\n]+[.!?\n]+/g) || [cleanText];
      const audioBuffers = [];

      for (const sentence of sentences.slice(0, 10)) {
        const trimmed = sentence.trim();
        if (!trimmed) continue;
        const chunkBuf = await this.fetchTtsChunk(trimmed);
        audioBuffers.push(chunkBuf);
      }

      const finalBuffer = Buffer.concat(audioBuffers);
      fs.writeFileSync(filePath, finalBuffer);

      console.log(`🎙️ [VOICE CREATED] Đã tạo thành công giọng nói AI: ${filePath} (${finalBuffer.length} bytes)`);

      return {
        success: true,
        fileName,
        filePath,
        audioUrl: `/audio/${fileName}`,
        durationEstimateSec: Math.round(cleanText.length / 14)
      };
    } catch (err) {
      console.error('❌ Lỗi tổng hợp giọng nói AI:', err.message);
      return {
        success: false,
        error: err.message
      };
    }
  }

  fetchTtsChunk(textChunk) {
    return new Promise((resolve, reject) => {
      const url = 'https://translate.google.com/translate_tts?ie=UTF-8&q=' + encodeURIComponent(textChunk.slice(0, 180)) + '&tl=vi&client=tw-ob';
      https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, (res) => {
        if (res.statusCode !== 200) {
          return reject(new Error(`TTS server error HTTP: ${res.statusCode}`));
        }
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks)));
      }).on('error', err => reject(err));
    });
  }

  /**
   * Tải tệp âm thanh / tin nhắn thoại về Base64 để Gemini phân tích (STT & Audio Understanding)
   */
  async fetchAudioAsBase64(audioUrl) {
    return new Promise((resolve, reject) => {
      try {
        const client = audioUrl.startsWith('https') ? https : http;
        client.get(audioUrl, { timeout: 20000 }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return this.fetchAudioAsBase64(res.headers.location).then(resolve).catch(reject);
          }

          if (res.statusCode !== 200) {
            return reject(new Error(`Tải audio thất bại, mã HTTP: ${res.statusCode}`));
          }

          const contentType = res.headers['content-type'] || 'audio/mp3';
          const chunks = [];

          res.on('data', chunk => chunks.push(chunk));
          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            resolve({
              mimeType: contentType.split(';')[0].trim() || 'audio/mp3',
              data: buffer.toString('base64'),
              bufferSize: buffer.length
            });
          });
        }).on('error', err => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  }

  loadLocalAudioAsBase64(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Tệp âm thanh không tồn tại: ${filePath}`);
    }
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'audio/mp3';
    if (ext === '.wav') mimeType = 'audio/wav';
    else if (ext === '.ogg') mimeType = 'audio/ogg';
    else if (ext === '.m4a' || ext === '.aac') mimeType = 'audio/aac';

    return {
      mimeType,
      data: buffer.toString('base64'),
      bufferSize: buffer.length
    };
  }

  createAudioPart(mimeType, base64Data) {
    return {
      inlineData: {
        mimeType: mimeType || 'audio/mp3',
        data: base64Data
      }
    };
  }
}

export const voiceIntelligence = new VoiceIntelligence();
