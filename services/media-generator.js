import https from 'https';
import http from 'http';
import fs from 'fs';
import path from 'path';

const GENERATED_MEDIA_DIR = path.resolve('generated_media');

if (!fs.existsSync(GENERATED_MEDIA_DIR)) {
  fs.mkdirSync(GENERATED_MEDIA_DIR, { recursive: true });
}

/**
 * Generate AI image and download locally
 */
export async function generateAiImage(prompt, width = 1024, height = 1024) {
  try {
    const cleanPrompt = encodeURIComponent(prompt.trim());
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;

    const fileName = `art_${Date.now()}_${seed}.jpg`;
    const filePath = path.join(GENERATED_MEDIA_DIR, fileName);

    await new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filePath);
      https.get(imageUrl, { timeout: 30000 }, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          https.get(response.headers.location, (redirectRes) => {
            redirectRes.pipe(file);
            file.on('finish', () => {
              file.close(resolve);
            });
          }).on('error', (err) => {
            fs.unlink(filePath, () => {});
            reject(err);
          });
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }).on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    });

    return {
      success: true,
      filePath: filePath,
      imageUrl: imageUrl,
      prompt: prompt
    };
  } catch (err) {
    return {
      success: false,
      error: err.message
    };
  }
}
