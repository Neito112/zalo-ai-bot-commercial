# 🚀 BỘ ĐÓNG GÓI HƯỚNG DẪN CÀI ĐẶT ZALO BOT MCP CHO CÁC NỀN TẢNG AI

Bộ đóng gói này bao gồm **đầy đủ 2 phần**:
1. **Phần 1: Cấu hình Zalo Bot & Auto-Responder Daemon** (Chạy nền Polling tự động trả lời tin nhắn Zalo 24/7).
2. **Phần 2: Cấu hình MCP Server (Model Context Protocol)** cho các Trợ lý AI (Google Antigravity, Claude Code, Cursor, Windsurf, Claude Desktop).

---

## 📂 1. Cấu trúc bộ đóng gói đầy đủ

```text
zalo-bot-mcp/
├── .env                                  # Cấu hình Token, Secret Key, Webhook URL
├── .env.example                          # Tệp mẫu thiết lập thông số môi trường
├── index.js                              # Zalo Bot MCP Server (Cung cấp các Tool cho AI)
├── bot-service.js                        # Tiến trình Polling tự động trả lời tin nhắn Zalo 24/7
├── start-bot.bat                         # File 1-Click khởi chạy Bot Auto-Responder trên Windows
├── setup-all.ps1                         # Script tự động cài đặt gói & cấu hình MCP cho AI
├── mcp_config_template.json              # File mẫu cấu hình MCP cho Antigravity / Gemini
├── claude_desktop_config_template.json   # File mẫu cấu hình MCP cho Claude Desktop
├── README.md                             # Hướng dẫn tổng quan
└── README_HUONG_DAN_CAI_DAT_MCP_CHO_AI.md # Hướng dẫn chi tiết cài đặt MCP cho các AI Clients
```

---

## ⚙️ 2. Hướng dẫn Cài đặt Tự động 1-Click (Khuyên dùng)

Mở **PowerShell** tại thư mục dự án và chạy duy nhất lệnh sau:

```powershell
.\setup-all.ps1
```

> **Script sẽ tự động:**
> 1. Tải và cài đặt tất cả thư viện cần thiết (`npm install`).
> 2. Ghi cấu hình MCP vào file cấu hình của Antigravity (`%USERPROFILE%\.gemini\config\mcp_config.json`).
> 3. Kiểm tra kết nối Zalo Bot API thành công.

---

## 🤖 3. Hướng dẫn Cấu hình MCP cho các AI Clients (Thủ công)

### 🔴 Cách 1: Cho Google Antigravity / Gemini Agent
- **Vị trí file cấu hình:** `%USERPROFILE%\.gemini\config\mcp_config.json`
- **Nội dung cần thêm/dán vào:**
```json
{
  "mcpServers": {
    "zalo-bot": {
      "command": "node",
      "args": [
        "C:\\Users\\HOMIE\\.gemini\\antigravity\\scratch\\zalo-bot-mcp\\index.js"
      ],
      "env": {
        "ZALO_BOT_TOKEN": "1814765549758631539:fwyQQnqCQpKOkHjKTDkgYZzDyXodAFbVxOfjarpmSTdUtAeXPEYCsEOYFuXFQbNZ",
        "ZALO_WEBHOOK_URL": "https://greeting-parkway-reflex.ngrok-free.dev/webhook/940868022467112918:isgiovguljmkmrerrbyhlwvqglpvgoceysyqqsrjfoynbzzvsektpyivkjzhxfvb",
        "ZALO_SECRET_KEY": "uZ1PXGKOQfn-u5-zM2"
      }
    }
  }
}
```

---

### 🟡 Cách 2: Cho Claude Desktop App
- **Vị trí file cấu hình:** `%APPDATA%\Claude\claude_desktop_config.json`
- **Nội dung cấu hình:** Dán nội dung từ tệp [`claude_desktop_config_template.json`](file:///C:/Users/HOMIE/.gemini/antigravity/scratch/zalo-bot-mcp/claude_desktop_config_template.json) vào phần `mcpServers`.

---

### 🔵 Cách 3: Cho Cursor IDE / Windsurf / VS Code
1. Mở **Cursor Settings** -> **MCP**.
2. Bấm **Add new MCP server**:
   - **Name:** `zalo-bot`
   - **Type:** `command`
   - **Command:** `node C:\Users\HOMIE\.gemini\antigravity\scratch\zalo-bot-mcp\index.js`
3. Thêm các biến môi trường (Environment Variables):
   - `ZALO_BOT_TOKEN`: `1814765549758631539:fwyQQnqCQpKOkHjKTDkgYZzDyXodAFbVxOfjarpmSTdUtAeXPEYCsEOYFuXFQbNZ`
   - `ZALO_SECRET_KEY`: `uZ1PXGKOQfn-u5-zM2`

---

## 🛠️ 4. Danh sách 6 Tool MCP AI có thể điều khiển Zalo:

1. `zalo_get_me`: Trợ lý AI lấy thông tin profile của Bot Quản đốc.
2. `zalo_send_message`: Trợ lý AI chủ động gửi tin nhắn cho bất kỳ ai trên Zalo.
3. `zalo_send_photo`: Trợ lý AI gửi hình ảnh (qua URL hoặc tệp hình ảnh từ máy tính).
4. `zalo_send_chat_action`: Trợ lý AI tạo hiệu ứng "đang gõ tin nhắn..." (`typing`).
5. `zalo_set_webhook`: Cấu hình lại địa chỉ Webhook cho Zalo Bot.
6. `zalo_get_webhook_info`: Đọc trạng thái Webhook hiện tại.

---

## 🔄 5. Cách Khởi chạy Bot Auto-Responder Daemon (Chạy ngầm tự động trả lời):
Bấm đúp vào tệp **[`start-bot.bat`](file:///C:/Users/HOMIE/.gemini/antigravity/scratch/zalo-bot-mcp/start-bot.bat)** hoặc chạy lệnh:
```bash
node bot-service.js
```
