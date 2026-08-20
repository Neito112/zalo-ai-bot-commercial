import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const MEDIA_DIR = path.resolve('generated_media');
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

export class WebArchiverEngine {
  /**
   * Chụp ảnh màn hình trang web hoặc lưu trữ tệp web trực tiếp
   */
  async captureWebPage(url, outputFormat = 'png') {
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return { success: false, error: 'Đường dẫn URL không hợp lệ (cần bắt đầu bằng http:// hoặc https://).' };
    }

    const timestamp = Date.now();
    const cleanFileName = `web_capture_${timestamp}.${outputFormat}`;
    const filePath = path.join(MEDIA_DIR, cleanFileName);

    try {
      // Sử dụng API chụp ảnh màn hình web tốc độ cao
      const captureApiUrl = `https://api.microlink.io?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

      const buffer = await new Promise((resolve, reject) => {
        const client = captureApiUrl.startsWith('https') ? https : http;
        client.get(captureApiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            // Follow redirect
            https.get(res.headers.location, (redRes) => {
              const chunks = [];
              redRes.on('data', chunk => chunks.push(chunk));
              redRes.on('end', () => resolve(Buffer.concat(chunks)));
            }).on('error', reject);
            return;
          }

          const chunks = [];
          res.on('data', chunk => chunks.push(chunk));
          res.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
      });

      if (buffer && buffer.length > 500) {
        fs.writeFileSync(filePath, buffer);
        return {
          success: true,
          filePath,
          fileName: cleanFileName,
          url,
          message: `📸 Đã chụp ảnh màn hình trang web thành công: ${cleanFileName}`
        };
      }

      return {
        success: false,
        error: 'Không thể trích xuất hình ảnh từ trang web được yêu cầu.'
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }
}

export const webArchiver = new WebArchiverEngine();
