/**
 * Động cơ Chẩn Đoán Lỗi & Hướng Dẫn Người Dùng Khắc Phục Tương Tác
 * (Interactive Error Remediation & User Guidance Engine)
 */

export class ErrorRemediationEngine {
  /**
   * Phân tích lỗi thực thi công cụ và sinh ra tài liệu hướng dẫn khắc phục từng bước
   */
  diagnoseError(toolName, rawError, userPrompt = '') {
    const errorStr = String(rawError || '');
    
    // 1. Lỗi Google Workspace (Gmail, Calendar, Drive, Docs, Sheets)
    if (
      toolName?.startsWith('manage_') ||
      errorStr.includes('Google Workspace') ||
      errorStr.includes('OAuth') ||
      errorStr.includes('Refresh token') ||
      errorStr.includes('chưa được cấp quyền') ||
      errorStr.includes('expired')
    ) {
      return {
        isError: true,
        category: 'GOOGLE_WORKSPACE_AUTH',
        serviceName: 'Google Workspace (Gmail / Calendar / Drive / Docs)',
        rootCause: 'Tài khoản Google Workspace chưa được cấp quyền truy cập OAuth 2.0 hoặc phiên đăng nhập đã hết hạn.',
        steps: [
          'Kiểm tra file `.env` đã có cấu hình `GOOGLE_CLIENT_ID` và `GOOGLE_CLIENT_SECRET` từ Google Cloud Console chưa.',
          'Chạy lệnh xác thực cấp quyền tài khoản Google thông qua giao diện hoặc CLI: `npx @aaronsb/google-workspace-mcp`.',
          'Đăng nhập và bấm "Cho phép" (Allow) để cấp quyền đọc/quản lý hộp thư và tài liệu.'
        ],
        quickAction: 'Sau khi hoàn tất cấp quyền, sếp chỉ cần nhắn lại yêu cầu (ví dụ: "Đọc các email mới nhất"), tôi sẽ thực hiện ngay lập tức.'
      };
    }

    // 2. Lỗi thiếu API Key / Token của các dịch vụ ngoài (Canva, Notion, Trello, Jira, Figma, Slack, GitHub...)
    if (
      errorStr.includes('API key') ||
      errorStr.includes('chưa được cấu hình') ||
      errorStr.includes('API Key') ||
      errorStr.includes('token') ||
      errorStr.includes('UNAUTHORIZED') ||
      errorStr.includes('401') ||
      errorStr.includes('403') ||
      toolName === 'call_dynamic_mcp' ||
      toolName === 'setup_mcp_connection'
    ) {
      const detectedService = this.detectServiceName(toolName, errorStr, userPrompt);
      return {
        isError: true,
        category: 'MISSING_API_CREDENTIALS',
        serviceName: detectedService,
        rootCause: `Hệ thống chưa nhận được API Key / Token hợp lệ để kết nối với dịch vụ ${detectedService}.`,
        steps: [
          `Truy cập trang cài đặt tài khoản của ${detectedService} (Settings / Developer / API Keys).`,
          `Tạo hoặc sao chép mã API Key / Access Token cá nhân của bạn.`,
          `Dán trực tiếp mã khóa đó vào khung chat Zalo này (Hệ thống sẽ tự động bắt lấy, mã hóa và kích hoạt công cụ ngay tức thì).`
        ],
        quickAction: `Sếp chỉ cần gửi tin nhắn dạng: "Key ${detectedService}: [MÃ_API_KEY_CỦA_SẾP]", tôi sẽ tự nạp vào hệ thống.`
      };
    }

    // 3. Lỗi thiếu tham số hoặc định dạng không hợp lệ (URL, File Path, QR Bank, Code...)
    if (
      errorStr.includes('tham số') ||
      errorStr.includes('bắt buộc') ||
      errorStr.includes('không hợp lệ') ||
      errorStr.includes('ENOENT') ||
      errorStr.includes('không tìm thấy') ||
      errorStr.includes('cú pháp') ||
      errorStr.includes('JSON')
    ) {
      return {
        isError: true,
        category: 'INVALID_OR_MISSING_PARAMETERS',
        serviceName: toolName,
        rootCause: `Dữ liệu đầu vào hoặc tham số truyền cho tác vụ [${toolName}] chưa đủ thông tin hoặc sai định dạng.`,
        steps: [
          'Kiểm tra lại đường dẫn tệp tin, đường link URL hoặc số liệu đã cung cấp đầy đủ và chính xác chưa.',
          'Đảm bảo tệp tin đang tồn tại trên máy và có quyền đọc dữ liệu.'
        ],
        quickAction: 'Sếp vui lòng cung cấp lại thông tin chi tiết hoặc gửi kèm tệp tin / đường link cần xử lý.'
      };
    }

    // 4. Lỗi chung / Ngoại lệ hệ thống
    return {
      isError: true,
      category: 'GENERAL_RUNTIME_ERROR',
      serviceName: toolName,
      rootCause: `Tác vụ [${toolName}] gặp trở ngại kỹ thuật trong quá trình xử lý: ${errorStr.slice(0, 150)}`,
      steps: [
        'Kiểm tra kết nối mạng hoặc thử diễn đạt lại yêu cầu rõ ràng hơn.',
        'Nếu cần xử lý dữ liệu phức tạp, hãy chia nhỏ thành từng bước cụ thể.'
      ],
      quickAction: 'Sếp có thể nhắn lại yêu cầu hoặc hướng dẫn chi tiết hơn để tôi hỗ trợ chính xác.'
    };
  }

  /**
   * Tạo đoạn văn bản chỉ dẫn đặc biệt để nhúng vào prompt thứ 2 (Second-pass LLM prompt)
   */
  formatRemediationPrompt(toolName, rawError, userPrompt) {
    const diag = this.diagnoseError(toolName, rawError, userPrompt);
    
    return `[HƯỚNG DẪN XỬ LÝ LỖI & ĐIỀU PHỐI TƯ TƯỞNG]:
- Công cụ: ${toolName}
- Tình trạng: Gặp lỗi không thể hoàn thành trực tiếp.
- Nguyên nhân gốc rễ: ${diag.rootCause}
- Các bước người dùng cần làm để khắc phục:
${diag.steps.map((s, i) => `  ${i + 1}. ${s}`).join('\n')}
- Hành động nhanh: ${diag.quickAction}

[NGUYÊN TẮC PHẢN HỒI NGƯỜI DÙNG - BẮT BUỘC TUÂN THỦ]:
1. TUYỆT ĐỐI KHÔNG dùng các câu văn rỗng tuếch ("Hệ thống vừa gặp lỗi JSON", "Tôi đã chủ động khắc phục cấu trúc truyền dữ liệu", "Tôi có nên quét lại không?").
2. Hãy thông báo TRUNG THỰC nguyên nhân sự cố trong 1 câu rõ ràng.
3. HƯỚNG DẪN NGƯỜI DÙNG TỪNG BƯỚC CỤ THỂ để họ biết chính xác cần làm gì (cấp quyền, dán API key, cung cấp lại thông tin).
4. Giữ phong thái chuyên nghiệp, chu đáo, hữu ích và giải quyết tận gốc vấn đề.`;
  }

  /**
   * Nhận diện tên dịch vụ từ bối cảnh
   */
  detectServiceName(toolName, errorStr, userPrompt) {
    const text = (toolName + ' ' + errorStr + ' ' + userPrompt).toLowerCase();
    if (text.includes('canva')) return 'Canva';
    if (text.includes('notion')) return 'Notion';
    if (text.includes('trello')) return 'Trello';
    if (text.includes('jira')) return 'Jira';
    if (text.includes('figma')) return 'Figma';
    if (text.includes('slack')) return 'Slack';
    if (text.includes('github')) return 'GitHub';
    if (text.includes('gmail') || text.includes('email') || text.includes('google')) return 'Google Workspace';
    return toolName || 'Dịch vụ bên ngoài';
  }
}

export const errorRemediation = new ErrorRemediationEngine();
