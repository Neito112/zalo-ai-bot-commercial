import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

export class VisionIntelligence {
  /**
   * Tải ảnh từ URL và chuyển thành base64 buffer cho Gemini Vision
   */
  async fetchImageAsBase64(imageUrl) {
    return new Promise((resolve, reject) => {
      try {
        const client = imageUrl.startsWith('https') ? https : http;
        client.get(imageUrl, { timeout: 15000 }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            return this.fetchImageAsBase64(res.headers.location).then(resolve).catch(reject);
          }

          if (res.statusCode !== 200) {
            return reject(new Error(`Tải ảnh thất bại, mã HTTP: ${res.statusCode}`));
          }

          const contentType = res.headers['content-type'] || 'image/jpeg';
          const chunks = [];

          res.on('data', chunk => chunks.push(chunk));
          res.on('end', () => {
            const buffer = Buffer.concat(chunks);
            const base64Data = buffer.toString('base64');
            resolve({
              mimeType: contentType.split(';')[0].trim(),
              data: base64Data,
              bufferSize: buffer.length
            });
          });
        }).on('error', err => reject(err));
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Chuyển đổi tệp ảnh cục bộ thành base64 cho Gemini Vision
   */
  loadLocalImageAsBase64(filePath) {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Tệp ảnh không tồn tại: ${filePath}`);
    }
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'image/jpeg';
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.gif') mimeType = 'image/gif';

    return {
      mimeType,
      data: buffer.toString('base64'),
      bufferSize: buffer.length
    };
  }

  /**
   * Tạo phần tử (part) đa phương thức chuẩn cho Gemini SDK
   */
  createImagePart(mimeType, base64Data) {
    return {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: base64Data
      }
    };
  }
}

export const visionIntelligence = new VisionIntelligence();
