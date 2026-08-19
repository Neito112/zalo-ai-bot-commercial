import 'dotenv/config';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const prompt = 'tạo 1 template quy trình thiết kế nội thất vào drive, sau đó gửi tôi link đến thư mục đó';

async function test() {
  const sys = `Bạn là Trợ lý AI điều khiển hệ thống Google Workspace.
Bạn có các công cụ sau:
1. manage_drive: { operation: "create"|"search"|"list", name: string, type: "folder"|"document"|"spreadsheet" }
2. manage_docs: { operation: "create"|"append"|"read", title: string, content: string }
3. manage_email: { operation: "search"|"send"|"trash_all_promotions"|"triage", query: string }
4. manage_calendar: { operation: "agenda"|"quickAdd", text: string }

Nhiệm vụ: Phân tích đúng ý định người dùng (Ví dụ: "thư mục" là Folder trên Drive, KHÔNG PHẢI là Email/Thư!).
- Nếu người dùng cần gọi công cụ, BẮT BUỘC trả về duy nhất 1 chuỗi JSON theo định dạng:
{"tool": "tên_tool", "args": { ... }}

- Nếu người dùng hỏi câu thông thường, trả lời trực tiếp bằng tiếng Việt.`;

  const res = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: `${sys}\n\nNgười dùng nhắn: "${prompt}"`
  });

  console.log('🤖 Gemini Response:\n', res.text);
}

test();
