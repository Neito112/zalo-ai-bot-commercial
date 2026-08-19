import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';

const TOKEN_FILE = path.resolve('google-token.json');
const SERVICE_ACCOUNT_FILE = path.resolve('service-account.json');

export class NativeGoogleWorkspaceEngine {
  constructor() {
    this.auth = null;
    this.initAuth();
  }

  initAuth() {
    try {
      // 1. Ưu tiên Service Account (Không bao giờ hết hạn)
      if (fs.existsSync(SERVICE_ACCOUNT_FILE)) {
        this.auth = new google.auth.GoogleAuth({
          keyFile: SERVICE_ACCOUNT_FILE,
          scopes: [
            'https://www.googleapis.com/auth/gmail.readonly',
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/calendar',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/documents',
            'https://www.googleapis.com/auth/spreadsheets'
          ]
        });
        console.log('✅ [GOOGLE WORKSPACE] Đã nạp xác thực bằng Service Account!');
        return;
      }

      // 2. OAuth2 Client từ .env hoặc google-token.json
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

      if (clientId && clientSecret) {
        const oauth2Client = new google.auth.OAuth2(
          clientId,
          clientSecret,
          'http://localhost:3000/oauth2callback'
        );

        if (refreshToken) {
          oauth2Client.setCredentials({ refresh_token: refreshToken });
          this.auth = oauth2Client;
          console.log('✅ [GOOGLE WORKSPACE] Đã nạp xác thực OAuth2 Refresh Token!');
          return;
        } else if (fs.existsSync(TOKEN_FILE)) {
          const tokenData = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf-8'));
          oauth2Client.setCredentials(tokenData);
          this.auth = oauth2Client;
          console.log('✅ [GOOGLE WORKSPACE] Đã nạp xác thực OAuth2 từ google-token.json!');
          return;
        }
      }
    } catch (err) {
      console.warn('⚠️ [GOOGLE WORKSPACE] Khởi tạo xác thực thất bại:', err.message);
    }
  }

  isConfigured() {
    return this.auth !== null;
  }

  /**
   * 1. GMAIL: Đọc & Tìm kiếm email
   */
  async listEmails(query = '', maxResults = 5) {
    if (!this.auth) {
      return '⚠️ Google Workspace chưa được cấp quyền (Cần service-account.json hoặc GOOGLE_CLIENT_ID & GOOGLE_REFRESH_TOKEN trong .env).';
    }

    try {
      const gmail = google.gmail({ version: 'v1', auth: this.auth });
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: query || 'is:inbox',
        maxResults
      });

      const messages = res.data.messages || [];
      if (messages.length === 0) {
        return '📭 Hộp thư không có email nào phù hợp với yêu cầu tìm kiếm.';
      }

      const emailDetails = await Promise.all(
        messages.map(async (m) => {
          const detail = await gmail.users.messages.get({ userId: 'me', id: m.id, format: 'metadata' });
          const headers = detail.data.payload?.headers || [];
          const subject = headers.find(h => h.name === 'Subject')?.value || '(Không có tiêu đề)';
          const from = headers.find(h => h.name === 'From')?.value || '(Người gửi ẩn danh)';
          const date = headers.find(h => h.name === 'Date')?.value || '';
          return `- **Tiêu đề:** ${subject}\n  **Từ:** ${from}\n  **Thời gian:** ${date}\n  **Snippet:** ${detail.data.snippet || ''}`;
        })
      );

      return `📬 **DANH SÁCH ${emailDetails.length} EMAIL GẦN NHẤT:**\n\n` + emailDetails.join('\n\n');
    } catch (err) {
      return `❌ Lỗi truy cập Gmail: ${err.message}`;
    }
  }

  /**
   * 2. GOOGLE CALENDAR: Xem lịch trình
   */
  async listCalendarEvents(maxResults = 5) {
    if (!this.auth) {
      return '⚠️ Google Calendar chưa được cấu hình xác thực trong .env.';
    }

    try {
      const calendar = google.calendar({ version: 'v3', auth: this.auth });
      const res = await calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        maxResults,
        singleEvents: true,
        orderBy: 'startTime'
      });

      const events = res.data.items || [];
      if (events.length === 0) {
        return '📅 Bạn không có sự kiện/lịch hẹn nào sắp diễn ra trong thời gian tới.';
      }

      const eventList = events.map(e => {
        const start = e.start?.dateTime || e.start?.date || '';
        return `- **Sự kiện:** ${e.summary}\n  **Thời gian:** ${start}\n  **Mô tả:** ${e.description || '(Không có)'}`;
      });

      return `📅 **LỊCH TRÌNH SẮP DIỄN RA (${eventList.length} SỰ KIỆN):**\n\n` + eventList.join('\n\n');
    } catch (err) {
      return `❌ Lỗi truy cập Google Calendar: ${err.message}`;
    }
  }

  /**
   * 3. GOOGLE DRIVE: Tìm kiếm tệp tin
   */
  async searchDriveFiles(query = '', pageSize = 5) {
    if (!this.auth) {
      return '⚠️ Google Drive chưa được cấu hình xác thực trong .env.';
    }

    try {
      const drive = google.drive({ version: 'v3', auth: this.auth });
      const res = await drive.files.list({
        q: query ? `name contains '${query}' and trashed = false` : 'trashed = false',
        pageSize,
        fields: 'files(id, name, mimeType, webViewLink)'
      });

      const files = res.data.files || [];
      if (files.length === 0) {
        return `📁 Không tìm thấy file nào trên Google Drive khớp với từ khóa "${query}".`;
      }

      const fileList = files.map(f => `- **${f.name}**\n  *Loại:* ${f.mimeType}\n  *Link:* ${f.webViewLink}`);
      return `📁 **KẾT QUẢ TÌM KIẾM GOOGLE DRIVE (${fileList.length} TỆP):**\n\n` + fileList.join('\n\n');
    } catch (err) {
      return `❌ Lỗi truy cập Google Drive: ${err.message}`;
    }
  }

  /**
   * 4. GOOGLE DOCS: Tạo tài liệu mới
   */
  async createGoogleDoc(title = 'Tài liệu mới từ Zalo AI') {
    if (!this.auth) {
      return '⚠️ Google Docs chưa được cấu hình xác thực.';
    }

    try {
      const docs = google.docs({ version: 'v1', auth: this.auth });
      const res = await docs.documents.create({
        requestBody: { title }
      });
      return `📄 Đã tạo Google Docs thành công: **${title}**\n🔗 ID Tài liệu: ${res.data.documentId}`;
    } catch (err) {
      return `❌ Lỗi tạo Google Docs: ${err.message}`;
    }
  }

  /**
   * 5. GOOGLE SHEETS: Tạo bảng tính mới
   */
  async createGoogleSheet(title = 'Bảng tính mới từ Zalo AI') {
    if (!this.auth) {
      return '⚠️ Google Sheets chưa được cấu hình xác thực.';
    }

    try {
      const sheets = google.sheets({ version: 'v4', auth: this.auth });
      const res = await sheets.spreadsheets.create({
        requestBody: { properties: { title } }
      });
      return `📊 Đã tạo Google Sheets thành công: **${title}**\n🔗 Link Bảng tính: ${res.data.spreadsheetUrl}`;
    } catch (err) {
      return `❌ Lỗi tạo Google Sheets: ${err.message}`;
    }
  }
}

export const googleWorkspace = new NativeGoogleWorkspaceEngine();
