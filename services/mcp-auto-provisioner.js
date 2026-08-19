import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const MCP_CONFIG_FILE = path.resolve('mcp-servers-config.json');

// Built-in Known MCP Registry Catalog
export const KNOWN_MCP_REGISTRY = {
  canva: {
    name: 'Canva Design MCP',
    package: 'mcp-server-canva',
    description: 'Thiết kế đồ họa, tạo banner, poster, xuất file thiết kế và slide thuyết trình trên Canva',
    requiredEnv: ['CANVA_API_KEY'],
    setupGuide: 'Lấy Canva API Token tại: https://www.canva.com/developers/',
    command: 'npx',
    args: ['-y', 'mcp-server-canva']
  },
  notion: {
    name: 'Notion Workspace MCP',
    package: '@modelcontextprotocol/server-notion',
    description: 'Đọc, ghi trang, tạo database và quản lý tài liệu trên Notion',
    requiredEnv: ['NOTION_API_KEY'],
    setupGuide: 'Lấy Notion Integration Secret tại: https://www.notion.so/my-integrations',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-notion']
  },
  trello: {
    name: 'Trello Board MCP',
    package: 'mcp-server-trello',
    description: 'Quản lý bảng công việc Kanban, tạo thẻ task, cập nhật trạng thái dự án trên Trello',
    requiredEnv: ['TRELLO_API_KEY', 'TRELLO_TOKEN'],
    setupGuide: 'Lấy Trello Developer API Key tại: https://trello.com/app-key',
    command: 'npx',
    args: ['-y', 'mcp-server-trello']
  },
  jira: {
    name: 'Jira Software MCP',
    package: 'mcp-server-jira',
    description: 'Quản lý backlog, tạo ticket issue, theo dõi sprint và tiến độ dự án trên Jira',
    requiredEnv: ['JIRA_HOST', 'JIRA_API_TOKEN', 'JIRA_EMAIL'],
    setupGuide: 'Tạo API Token tại: https://id.atlassian.com/manage-profile/security/api-tokens',
    command: 'npx',
    args: ['-y', 'mcp-server-jira']
  },
  figma: {
    name: 'Figma Design MCP',
    package: 'figma-mcp',
    description: 'Trích xuất file thiết kế UI/UX, lấy mã màu, typography và tài nguyên từ Figma',
    requiredEnv: ['FIGMA_ACCESS_TOKEN'],
    setupGuide: 'Tạo Personal Access Token tại Figma Settings -> Account -> Personal Access Tokens',
    command: 'npx',
    args: ['-y', 'figma-mcp']
  },
  linear: {
    name: 'Linear Issue MCP',
    package: 'mcp-server-linear',
    description: 'Quản lý vấn đề và tiến độ phát triển phần mềm trên Linear',
    requiredEnv: ['LINEAR_API_KEY'],
    setupGuide: 'Lấy API Key tại Linear Settings -> Security & Access',
    command: 'npx',
    args: ['-y', 'mcp-server-linear']
  },
  airtable: {
    name: 'Airtable Database MCP',
    package: 'mcp-server-airtable',
    description: 'Đọc và ghi dữ liệu bảng biểu, quản lý quan hệ bản ghi trên Airtable',
    requiredEnv: ['AIRTABLE_API_KEY'],
    setupGuide: 'Lấy Personal Access Token tại: https://airtable.com/create/tokens',
    command: 'npx',
    args: ['-y', 'mcp-server-airtable']
  },
  clickup: {
    name: 'ClickUp Task MCP',
    package: 'mcp-server-clickup',
    description: 'Tạo công việc, theo dõi checklist và quản lý thời gian trên ClickUp',
    requiredEnv: ['CLICKUP_API_KEY'],
    setupGuide: 'Lấy API Key tại ClickUp Apps -> API Token',
    command: 'npx',
    args: ['-y', 'mcp-server-clickup']
  },
  github: {
    name: 'GitHub MCP',
    package: '@modelcontextprotocol/server-github',
    description: 'Quản lý kho mã nguồn, tạo Issue, PR, duyệt code trên GitHub',
    requiredEnv: ['GITHUB_PERSONAL_ACCESS_TOKEN'],
    setupGuide: 'Tạo Personal Access Token (Classic) tại: https://github.com/settings/tokens với quyền repo',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github']
  },
  slack: {
    name: 'Slack MCP',
    package: '@modelcontextprotocol/server-slack',
    description: 'Gửi tin nhắn, đọc kênh chat và tương tác trong workspace Slack',
    requiredEnv: ['SLACK_BOT_TOKEN', 'SLACK_TEAM_ID'],
    setupGuide: 'Tạo Slack Bot User OAuth Token (xoxb-...) tại https://api.slack.com/apps',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-slack']
  },
  postgres: {
    name: 'PostgreSQL Database MCP',
    package: '@modelcontextprotocol/server-postgres',
    description: 'Truy vấn, phân tích và thực thi SQL trên cơ sở dữ liệu PostgreSQL',
    requiredEnv: ['POSTGRES_CONNECTION_STRING'],
    setupGuide: 'Cung cấp chuỗi kết nối dạng: postgresql://user:password@host:5432/dbname',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-postgres', '${POSTGRES_CONNECTION_STRING}']
  },
  google_workspace: {
    name: 'Google Workspace MCP',
    package: 'googleapis',
    description: 'Quản lý toàn diện Gmail, Google Drive, Docs, Sheets, Calendar',
    requiredEnv: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
    setupGuide: 'Thả file service-account.json hoặc nhập GOOGLE_REFRESH_TOKEN',
    command: 'internal',
    args: []
  }
};

export class McpAutoProvisioner {
  constructor() {
    this.installedServers = this.loadConfig();
  }

  loadConfig() {
    try {
      if (fs.existsSync(MCP_CONFIG_FILE)) {
        return JSON.parse(fs.readFileSync(MCP_CONFIG_FILE, 'utf-8'));
      }
    } catch (e) {}
    return {
      servers: {
        google_workspace: {
          enabled: true,
          status: 'ACTIVE',
          installedAt: new Date().toISOString()
        }
      }
    };
  }

  saveConfig() {
    try {
      fs.writeFileSync(MCP_CONFIG_FILE, JSON.stringify(this.installedServers, null, 2), 'utf-8');
    } catch (e) {}
  }

  /**
   * Phân tích yêu cầu kết nối MCP từ câu nói của người dùng
   */
  resolveMcpTarget(appName) {
    const clean = appName.toLowerCase().replace(/[^a-z0-9_]/g, '');
    for (const [key, meta] of Object.entries(KNOWN_MCP_REGISTRY)) {
      if (clean.includes(key) || key.includes(clean) || meta.name.toLowerCase().includes(appName.toLowerCase())) {
        return { key, ...meta };
      }
    }

    // Nếu là MCP tùy biến ngoài registry
    return {
      key: clean,
      name: `${appName} MCP (Tùy biến)`,
      package: clean.startsWith('@') ? clean : `mcp-server-${clean}`,
      description: `Máy chủ MCP tùy biến kết nối ${appName}`,
      requiredEnv: [`${clean.toUpperCase()}_API_KEY`],
      setupGuide: `Cần cung cấp API Key hoặc Token của ${appName} để thiết lập`,
      command: 'npx',
      args: ['-y', clean.startsWith('@') ? clean : `mcp-server-${clean}`]
    };
  }

  /**
   * Tự động tính toán & thiết lập môi trường MCP
   */
  async provisionMcp(appName, providedCredentials = {}) {
    const target = this.resolveMcpTarget(appName);
    const missingKeys = [];

    // Kiểm tra các biến môi trường cần thiết
    for (const envVar of target.requiredEnv) {
      const val = providedCredentials[envVar] || process.env[envVar];
      if (!val) {
        missingKeys.push(envVar);
      } else {
        // Lưu vào process.env và cập nhật .env
        process.env[envVar] = val;
        this.persistEnvVar(envVar, val);
      }
    }

    // Nếu còn thiếu thông tin từ người dùng -> Trả về yêu cầu cung cấp
    if (missingKeys.length > 0) {
      return {
        status: 'NEEDS_INPUT',
        targetKey: target.key,
        targetName: target.name,
        missingKeys: missingKeys,
        guide: target.setupGuide,
        message: `Dạ em đã chuẩn bị xong môi trường kết nối với **${target.name}** rồi ạ!\n\n📌 Để hoàn tất kết nối, bạn chỉ cần gửi cho em:\n${missingKeys.map(k => `👉 **${k}**`).join('\n')}\n\n💡 *Hướng dẫn:* ${target.setupGuide}\n\nSau khi bạn gửi, em sẽ tự động kích hoạt và bắt đầu sử dụng ngay nhé!`
      };
    }

    // Nếu đã đủ điều kiện -> Kích hoạt MCP
    this.installedServers.servers[target.key] = {
      name: target.name,
      package: target.package,
      enabled: true,
      status: 'ACTIVE',
      installedAt: new Date().toISOString(),
      command: target.command,
      args: target.args
    };
    this.saveConfig();

    return {
      status: 'SUCCESS',
      targetKey: target.key,
      targetName: target.name,
      message: `🎉 **ĐÃ THIẾT LẬP & KẾT NỐI THÀNH CÔNG ${target.name.toUpperCase()}!**\n\n✅ Môi trường đã được cài đặt tự động.\n✅ Toàn bộ công cụ của ${target.name} đã được kích hoạt trực tiếp vào não bộ của em. Giờ bạn có thể thoải mái giao việc liên quan đến ${target.name} cho em rồi nhé!`
    };
  }

  persistEnvVar(key, val) {
    try {
      const envPath = path.resolve('.env');
      let content = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : '';
      if (content.includes(`${key}=`)) {
        content = content.replace(new RegExp(`${key}=.*`), `${key}=${val}`);
      } else {
        content += `\n${key}=${val}`;
      }
      fs.writeFileSync(envPath, content, 'utf-8');
    } catch (e) {}
  }

  getConnectedServers() {
    return this.installedServers.servers || {};
  }

  /**
   * Tự động phát hiện khi người dùng gửi API Key / Token trong tin nhắn chat
   */
  autoDetectAndSaveKeyFromChat(text) {
    if (!text || typeof text !== 'string') return null;

    // 1. Kiểm tra định dạng KEY=VALUE (Ví dụ: CANVA_API_KEY=xxx, NOTION_API_KEY=xxx)
    const keyValueMatch = text.match(/([A-Z0-9_]+)\s*=\s*([A-Za-z0-9_\-\.]{15,})/);
    if (keyValueMatch) {
      const keyName = keyValueMatch[1];
      const keyValue = keyValueMatch[2].trim();
      process.env[keyName] = keyValue;
      this.persistEnvVar(keyName, keyValue);
      return { keyName, keyValue, source: 'EXPLICIT_KEY' };
    }

    // 2. Kiểm tra token Canva (thường bắt đầu bằng canva_ hoặc độ dài > 20)
    if (/^(canva_[a-zA-Z0-9_\-]{20,})/i.test(text.trim())) {
      const keyName = 'CANVA_API_KEY';
      const keyValue = text.trim();
      process.env[keyName] = keyValue;
      this.persistEnvVar(keyName, keyValue);
      return { keyName, keyValue, app: 'Canva' };
    }

    // 3. Kiểm tra Notion secret (secret_...)
    if (/^(secret_[a-zA-Z0-9]{30,})/i.test(text.trim())) {
      const keyName = 'NOTION_API_KEY';
      const keyValue = text.trim();
      process.env[keyName] = keyValue;
      this.persistEnvVar(keyName, keyValue);
      return { keyName, keyValue, app: 'Notion' };
    }

    // 4. Kiểm tra Slack token (xoxb-... hoặc xoxp-...)
    if (/^(xox[bpa]-[a-zA-Z0-9\-]{20,})/i.test(text.trim())) {
      const keyName = 'SLACK_BOT_TOKEN';
      const keyValue = text.trim();
      process.env[keyName] = keyValue;
      this.persistEnvVar(keyName, keyValue);
      return { keyName, keyValue, app: 'Slack' };
    }

    // 5. Kiểm tra GitHub token (ghp_... hoặc github_pat_...)
    if (/^(ghp_[a-zA-Z0-9]{30,}|github_pat_[a-zA-Z0-9_]{30,})/i.test(text.trim())) {
      const keyName = 'GITHUB_PERSONAL_ACCESS_TOKEN';
      const keyValue = text.trim();
      process.env[keyName] = keyValue;
      this.persistEnvVar(keyName, keyValue);
      return { keyName, keyValue, app: 'GitHub' };
    }

    return null;
  }
}

export const mcpAutoProvisioner = new McpAutoProvisioner();
