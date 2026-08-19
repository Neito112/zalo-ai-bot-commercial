# 📖 HƯỚNG DẪN KẾT NỐI ZALO BOT VÀO ỨNG DỤNG (DÀNH CHO NGƯỜI DÙNG)

Chào mừng bạn đến với **Zalo AI Bot - Commercial Edition**! Tài liệu này sẽ hướng dẫn bạn cách tạo một Zalo Bot của riêng bạn và kết nối vào hệ thống AI chỉ trong 3 phút.

---

## 🚀 BƯỚC 1: TẠO ZALO BOT & LẤY TOKEN

### Cách 1: Sử dụng Zalo Bot Platform (Khuyên dùng)
1. Mở ứng dụng Zalo trên điện thoại hoặc máy tính.
2. Tìm kiếm **BotFather** hoặc truy cập cổng phát triển Zalo Bot: [https://bot.zalo.me/](https://bot.zalo.me/).
3. Nhắn lệnh `/newbot` để bắt đầu tạo Bot mới.
4. Đặt **Tên Bot** (Ví dụ: *Trợ Lý Thông Minh*, *AI Assistant*).
5. Đặt **Username Bot** kết thúc bằng `_bot` (Ví dụ: `my_smart_ai_bot`).
6. Hệ thống sẽ trả về một chuỗi **Bot Token** có định dạng dạng:
   ```
   1814765549758631539:fwyQQnqCQpKOkHjKTDkgYZzDyXodAFbVxOfjarpmSTdUtAeXPEYCsEOYFuXFQbNZ
   ```
7. Sao chép (**Copy**) toàn bộ chuỗi Token này.

---

## 🔑 BƯỚC 2: LẤY GOOGLE GEMINI API KEY (MIỄN PHÍ)

1. Truy cập: [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey).
2. Đăng nhập bằng tài khoản Google của bạn.
3. Bấm nút **Create API key** và sao chép mã Key (dạng `AIzaSy...`).

---

## 💻 BƯỚC 3: KẾT NỐI VÀO ỨNG DỤNG

Bạn có 2 cách cực kỳ đơn giản để kích hoạt Bot:

### Cách 1: Nhập trực tiếp trên Giao diện Web Dashboard (Dễ nhất)
1. Mở ứng dụng **Zalo AI Bot Control Center.exe** hoặc chạy `npm start` rồi mở trình duyệt tại:
   👉 **[http://localhost:3000](http://localhost:3000)**
2. Tại mục **"Nguồn API & Cấu Hình Não Bộ"**:
   - Dán **Token Zalo Bot** vào ô *Zalo Bot Token*.
   - Dán **Gemini API Key** vào ô *Thêm API Key Mới* và bấm **+ Thêm**.
3. Bấm **"💾 Lưu Cấu Hình Não Bộ"** và bấm **"▶ Bật Bot"**.
4. Xong! Bạn có thể mở Zalo và bắt đầu nhắn tin với Bot của mình ngay lập tức.

### Cách 2: Cấu hình qua tệp `.env`
1. Đổi tên tệp `.env.example` thành `.env`.
2. Mở file `.env` và điền token:
   ```env
   ZALO_BOT_TOKEN=Điền_Token_Zalo_Của_Bạn_Vào_Đây
   GEMINI_API_KEY_1=Điền_Gemini_API_Key_Vào_Đây
   ```
3. Lưu file và khởi động lại ứng dụng.

---

## 🌟 CÁC TÍNH NĂNG ƯU VIỆT BẠN ĐÃ SỞ HỮU

- **Trò chuyện tự nhiên 100% như người thật:** Không câu dập khuôn, ấm áp, thấu hiểu.
- **Tự học hỏi liên tục:** Tự ghi nhớ thói quen, tên xưng hô và sở thích của bạn sau mỗi tin nhắn.
- **Tra cứu Internet & Tóm tắt bài viết:** Tìm kiếm tin tức mới nhất, đọc nội dung trang web.
- **Phân tích Video YouTube:** Gửi link YouTube để Bot tóm tắt lời thoại và ý chính.
- **Vẽ tranh AI:** Yêu cầu vẽ tranh và Bot tự gửi ảnh trực tiếp vào Zalo.
- **Tự kết nối MCP:** Chỉ cần nhắn *"Kết nối GitHub"*, *"Cài Notion"*, Bot tự động setup cho bạn!
- **Đồng bộ Đám mây GitHub:** Lưu trữ vĩnh viễn trí tuệ của Bot lên GitHub Cloud.
