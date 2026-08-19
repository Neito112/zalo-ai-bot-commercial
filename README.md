# 🤖 Zalo AI Bot - Commercial Edition (Bản Thương Mại)

> **Trợ Lý AI Toàn Năng Trên Zalo** — Tự chủ hành động, giao tiếp tự nhiên 100% như con người, tự học hỏi liên tục, tra cứu Internet, phân tích Video, vẽ ảnh nghệ thuật và tích hợp Đám Mây Não Bộ.

[![GitHub](https://img.shields.io/badge/GitHub-Neito112%2Fzalo--ai--bot--commercial-blue?logo=github)](https://github.com/Neito112/zalo-ai-bot-commercial)
[![License: Commercial](https://img.shields.io/badge/License-Commercial-green.svg)]()
[![Platform: Windows Desktop & Web](https://img.shields.io/badge/Platform-Windows%20%7C%20Web-purple)]()

---

## 🌟 ĐIỂM NỔI BẬT

1. **🎭 Phong Cách Giao Tiếp Con Người Tự Nhiên (100% Anti-Robot):**
   - Loại bỏ hoàn toàn các câu dập khuôn máy móc.
   - Thấu hiểu ngữ cảnh và cảm xúc người dùng để phản hồi ấm áp, sắc bén và tinh tế.
2. **🧬 Vòng Lặp Tự Tiến Hóa & Học Hỏi Liên Tục:**
   - Tự động ghi nhớ sở thích, thói quen của người dùng sau từng tin nhắn.
   - Tự động tra cứu kiến thức mới trên Internet 24/7 và nạp vào bộ nhớ vĩnh viễn.
3. **🌐 Tra Cứu Internet & Đọc Trang Web:**
   - Tìm kiếm thời gian thực, đọc và phân tích toàn bộ bài báo, tài liệu online.
4. **🎬 Phân Tích & Tóm Tắt Video YouTube:**
   - Tự động trích xuất lời thoại (transcript), tóm tắt các luận điểm cốt lõi từ link YouTube.
5. **🎨 Tạo Ảnh Nghệ Thuật AI:**
   - Vẽ tranh theo mô tả và gửi ảnh trực tiếp vào khung chat Zalo.
6. **🔌 Tự Động Kết Nối MCP (Model Context Protocol):**
   - Tự động tính toán và thiết lập môi trường kết nối với GitHub, Notion, Slack, PostgreSQL, Google Workspace,...
7. **☁️ Đám Mây Não Bộ GitHub:**
   - 1-Click Sao lưu và Đồng bộ toàn bộ trí nhớ, bài học của Bot lên GitHub Cloud.
8. **🖥️ Ứng Dụng Desktop .EXE Tiện Dụng:**
   - Chạy ngầm trong **Khay hệ thống (System Tray)**, tự khởi động cùng Windows.

---

## 🚀 HƯỚNG DẪN BẮT ĐẦU NHANH (QUICK START)

### 1. Cài đặt Dependencies
```bash
git clone https://github.com/Neito112/zalo-ai-bot-commercial.git
cd zalo-ai-bot-commercial
npm install
```

### 2. Cấu hình & Kết nối Zalo Bot
👉 Xem chi tiết tại tệp: **[HD_KET_NOI_ZALO_BOT.md](HD_KET_NOI_ZALO_BOT.md)**

Hoặc mở Mini Dashboard tại `http://localhost:3000` và nhập trực tiếp **Zalo Bot Token** cùng **Gemini API Key**.

### 3. Khởi động
```bash
npm start
```
Hoặc nhấp đúp vào tệp `start-bot.bat`.

---

## 📁 CẤU TRÚC DỰ ÁN

```
zalo-ai-bot-commercial/
├── public/                 # Giao diện Mini Dashboard Web & Desktop
│   └── index.html
├── services/               # Hệ thống các khối trí tuệ AI
│   ├── auto-research-loop.js   # Vòng lặp tự nghiên cứu & tiến hóa 24/7
│   ├── cloud-brain-sync.js     # Đồng bộ não bộ lên GitHub Cloud
│   ├── dynamic-mcp-runner.js   # Trình thực thi công cụ MCP động
│   ├── mcp-auto-provisioner.js # Tự động thiết lập kết nối MCP
│   ├── media-generator.js      # Tạo ảnh AI nghệ thuật
│   ├── memory-store.js         # Quản lý trí nhớ & hồ sơ người dùng
│   ├── persona-engine.js       # Phân tích cảm xúc & phong cách con người
│   ├── video-intelligence.js   # Phân tích & tóm tắt video YouTube
│   └── web-research.js         # Tra cứu Internet & bóc tách bài viết
├── ai-agent.js             # Bộ Não Trung Tâm (Reasoning & Tool Orchestrator)
├── bot-service.js          # Trình quản lý kết nối & polling Zalo
├── dashboard-server.js     # Máy chủ Express & REST API
├── electron-main.cjs       # Ứng dụng Desktop chạy ngầm trong System Tray
├── HD_KET_NOI_ZALO_BOT.md  # Hướng dẫn kết nối cho người dùng
└── package.json
```

---

## 📄 LICENSE
Bản quyền thuộc về **Neito112 / Zalo AI Bot Project**. Bản thương mại (Commercial Edition) dành cho doanh nghiệp và cá nhân.
