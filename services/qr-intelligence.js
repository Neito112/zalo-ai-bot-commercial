import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';

const MEDIA_DIR = path.resolve('generated_media');
if (!fs.existsSync(MEDIA_DIR)) {
  fs.mkdirSync(MEDIA_DIR, { recursive: true });
}

export class QrIntelligenceEngine {
  /**
   * Tạo mã QR Code độ phân giải cao (Hỗ trợ Link, VietQR, Văn bản, Wi-Fi)
   */
  async generateQrCode(content, size = 500) {
    if (!content || typeof content !== 'string') {
      return { success: false, error: 'Nội dung tạo mã QR không hợp lệ.' };
    }

    const timestamp = Date.now();
    const fileName = `qr_code_${timestamp}.png`;
    const filePath = path.join(MEDIA_DIR, fileName);

    try {
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(content)}&format=png&margin=10`;

      const buffer = await new Promise((resolve, reject) => {
        const client = qrApiUrl.startsWith('https') ? https : http;
        client.get(qrApiUrl, (res) => {
          const chunks = [];
          res.on('data', chunk => chunks.push(chunk));
          res.on('end', () => resolve(Buffer.concat(chunks)));
        }).on('error', reject);
      });

      if (buffer && buffer.length > 100) {
        fs.writeFileSync(filePath, buffer);
        return {
          success: true,
          filePath,
          fileName,
          content,
          message: `📱 Đã tạo mã QR Code thành công: ${fileName}`
        };
      }

      return {
        success: false,
        error: 'Không thể tạo ảnh mã QR từ máy chủ.'
      };
    } catch (err) {
      return {
        success: false,
        error: err.message
      };
    }
  }

  /**
   * Tạo mã VietQR thanh toán ngân hàng chuyển khoản chuẩn NAPAS 24/7
   */
  generateVietQr(bankCode, accountNumber, amount, memo, accountName) {
    // Định dạng link VietQR chuẩn: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-compact2.png?amount=<AMOUNT>&addInfo=<MEMO>&accountName=<NAME>
    const cleanBank = (bankCode || 'MB').toUpperCase();
    const cleanAcc = (accountNumber || '').replace(/\s+/g, '');
    const cleanAmount = amount ? parseInt(amount, 10) : 0;
    const cleanMemo = encodeURIComponent(memo || 'Thanh toan');
    const cleanName = encodeURIComponent(accountName || '');

    const vietQrUrl = `https://img.vietqr.io/image/${cleanBank}-${cleanAcc}-compact2.png?amount=${cleanAmount}&addInfo=${cleanMemo}&accountName=${cleanName}`;

    return {
      success: true,
      qrUrl: vietQrUrl,
      bank: cleanBank,
      account: cleanAcc,
      amount: cleanAmount,
      memo,
      message: `💳 Đã tạo mã VietQR chuyển khoản ngân hàng ${cleanBank} (STK: ${cleanAcc}):\n🔗 Link ảnh QR: ${vietQrUrl}`
    };
  }
}

export const qrIntelligence = new QrIntelligenceEngine();
