import http from 'http';
import https from 'https';

export class LocalModelClient {
  constructor() {
    this.defaultEndpoint = process.env.LOCAL_MODEL_ENDPOINT || 'http://localhost:11434/v1';
    this.defaultModel = process.env.LOCAL_MODEL_NAME || 'llama3';
  }

  /**
   * Tự động quét và lấy danh sách các Model đang có trên máy chủ cục bộ (Ollama / LM Studio / llama.cpp)
   */
  async discoverLocalModels(endpoint = this.defaultEndpoint) {
    try {
      const cleanEndpoint = endpoint.replace(/\/+$/, '');
      const modelsUrl = cleanEndpoint.endsWith('/v1') 
        ? `${cleanEndpoint}/models` 
        : `${cleanEndpoint}/v1/models`;

      console.log(`🔍 [LOCAL MODEL] Đang quét models tại: ${modelsUrl}...`);
      const response = await this.httpGet(modelsUrl);
      const json = JSON.parse(response);

      if (json && Array.isArray(json.data)) {
        const models = json.data.map(m => m.id);
        console.log(`✅ [LOCAL MODELS FOUND] Tìm thấy ${models.length} models:`, models);
        return {
          success: true,
          endpoint: cleanEndpoint,
          models: models
        };
      } else if (json && Array.isArray(json.models)) {
        // Ollama native API fallback /api/tags
        const models = json.models.map(m => m.name);
        return {
          success: true,
          endpoint: cleanEndpoint,
          models: models
        };
      }

      return {
        success: false,
        models: [],
        message: 'Không tìm thấy danh sách model từ endpoint.'
      };
    } catch (err) {
      // Thử endpoint Ollama native /api/tags nếu /v1/models không phản hồi
      try {
        const baseUrl = endpoint.replace(/\/v1\/?$/, '');
        const ollamaTagsUrl = `${baseUrl}/api/tags`;
        const response = await this.httpGet(ollamaTagsUrl);
        const json = JSON.parse(response);
        if (json && Array.isArray(json.models)) {
          const models = json.models.map(m => m.name);
          return {
            success: true,
            endpoint,
            models
          };
        }
      } catch (e2) {}

      return {
        success: false,
        models: [],
        error: `Không thể kết nối máy chủ Local Model (${err.message}). Vui lòng đảm bảo Ollama hoặc LM Studio đang bật!`
      };
    }
  }

  /**
   * Gửi prompt và nhận phản hồi từ Local Model (OpenAI-compatible Chat Completion API)
   */
  async generateContent({ endpoint = this.defaultEndpoint, model = this.defaultModel, contents, temperature = 0.7 }) {
    const cleanEndpoint = endpoint.replace(/\/+$/, '');
    const chatUrl = cleanEndpoint.endsWith('/v1')
      ? `${cleanEndpoint}/chat/completions`
      : `${cleanEndpoint}/v1/chat/completions`;

    // Convert Gemini multimodal/string contents into OpenAI messages format
    let messages = [];

    if (typeof contents === 'string') {
      messages = [
        { role: 'user', content: contents }
      ];
    } else if (Array.isArray(contents)) {
      let textContent = '';
      let base64Image = null;

      contents.forEach(part => {
        if (typeof part === 'string') textContent += part + '\n';
        else if (part.text) textContent += part.text + '\n';
        else if (part.inlineData) {
          base64Image = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      });

      if (base64Image) {
        messages = [
          {
            role: 'user',
            content: [
              { type: 'text', text: textContent.trim() },
              { type: 'image_url', image_url: { url: base64Image } }
            ]
          }
        ];
      } else {
        messages = [
          { role: 'user', content: textContent.trim() }
        ];
      }
    }

    const payload = JSON.stringify({
      model: model || 'llama3',
      messages,
      temperature,
      stream: false
    });

    console.log(`💻 [LOCAL INFERENCE] Gửi yêu cầu tới ${model} tại ${chatUrl}...`);

    const rawResponse = await this.httpPost(chatUrl, payload);
    const json = JSON.parse(rawResponse);

    if (json.choices && json.choices[0]?.message?.content) {
      return {
        text: json.choices[0].message.content.trim(),
        modelUsed: `local:${model}`,
        raw: json
      };
    } else if (json.error) {
      throw new Error(`Local Model Server Error: ${json.error.message || JSON.stringify(json.error)}`);
    }

    throw new Error('Local Model không trả về nội dung hợp lệ.');
  }

  httpGet(urlStr) {
    return new Promise((resolve, reject) => {
      const url = new URL(urlStr);
      const client = url.protocol === 'https:' ? https : http;
      
      const req = client.get(url, { timeout: 8000 }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });

      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout kết nối')); });
    });
  }

  httpPost(urlStr, data) {
    return new Promise((resolve, reject) => {
      const url = new URL(urlStr);
      const client = url.protocol === 'https:' ? https : http;

      const req = client.request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        },
        timeout: 90000 // 90s cho local model chạy suy luận
      }, (res) => {
        let responseData = '';
        res.on('data', chunk => responseData += chunk);
        res.on('end', () => resolve(responseData));
      });

      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('Timeout khi chờ Local Model suy luận (quá 90 giây)')); });
      req.write(data);
      req.end();
    });
  }
}

export const localModelClient = new LocalModelClient();
