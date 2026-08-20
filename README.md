# Zalo Bot MCP Server & Auto-Responder

Dự án đóng gói tự động hóa cho **Bot Quản đốc** tích hợp **Model Context Protocol (MCP)** và **Auto-Responder Service (Polling Mode)**.

---

## 📁 Cấu trúc thư mục

```
zalo-bot-mcp/
├── .env                  # Tệp lưu Zalo Bot Token & Webhook Key
├── .env.example          # Tệp mẫu cấu hình môi trường
├── index.js              # Server MCP cho AI Agent (Claude Code / Antigravity)
├── bot-service.js        # Tiến trình Polling Auto-Responder tự động phản hồi
├── start-bot.bat         # Script 1-click chạy Bot Auto-Responder trên Windows
├── setup.ps1             # Script tự động cài đặt & cấu hình mcp_config.json
├── package.json          # Quản lý thư viện phụ thuộc (zalo-bot-js, MCP SDK)
└── README.md             # Hướng dẫn chi tiết
```

---

## ⚡ Hướng dẫn Setup Nhanh (1-Click)

### Cách 1: Sử dụng PowerShell (Khuyên dùng)
Mở PowerShell tại thư mục này và chạy:
```powershell
.\setup.ps1
```

### Cách 2: Thủ công
1. Cài đặt thư viện:
   ```bash
   npm install
   ```
2. Chạy Bot Auto-Responder:
   ```bash
   node bot-service.js
   # Hoặc double-click vào tệp start-bot.bat
   ```

---

## 🛠️ Danh sách MCP Tools đã đăng ký:
- `zalo_get_me`: Lấy thông tin chi tiết Bot Quản đốc.
- `zalo_send_message`: Gửi tin nhắn tới User/Chat ID.
- `zalo_send_photo`: Gửi hình ảnh qua URL hoặc file cục bộ.
- `zalo_send_chat_action`: Gửi trạng thái `typing` / `upload_photo`.
- `zalo_set_webhook`: Cấu hình Webhook URL.
- `zalo_get_webhook_info`: Kiểm tra thông tin Webhook.
