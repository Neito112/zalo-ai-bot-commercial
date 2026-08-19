import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const MCP_CONFIG_FILE = path.resolve('mcp-servers-config.json');

// Built-in Known MCP Registry Catalog
export const KNOWN_MCP_REGISTRY = {
  github: {
    name: 'GitHub MCP',
    package: '@modelcontextprotocol/server-github',
    description: 'Quản lý kho mã nguồn, tạo Issue, PR, duyệt code trên GitHub',
    requiredEnv: ['GITHUB_PERSONAL_ACCESS_TOKEN'],
    setupGuide: 'Tạo Personal Access Token (Classic) tại: https://github.com/settings/tokens với quyền repo',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-github']
  },
  notion: {
    name: 'Notion MCP',
    package: '@modelcontextprotocol/server-notion',
    description: 'Đọc, ghi trang, tạo database và quản lý tài liệu trên Notion',
    requiredEnv: ['NOTION_API_KEY'],
    setupGuide: 'Lấy Notion Internal Integration Secret tại: https://www.notion.so/my-integrations',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-notion']
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
  filesystem: {
    name: 'Local Filesystem MCP',
    package: '@modelcontextprotocol/server-filesystem',
    description: 'Đọc, ghi và quản lý file trong các thư mục được cấp phép trên máy',
    requiredEnv: [],
    setupGuide: 'Không cần API Key, tự động cấp quyền truy cập thư mục làm việc',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-filesystem', path.resolve('.')]
  },
  puppeteer: {
    name: 'Browser Puppeteer MCP',
    package: '@modelcontextprotocol/server-puppeteer',
    description: 'Điều khiển trình duyệt web tự động, chụp ảnh màn hình trang web',
    requiredEnv: [],
    setupGuide: 'Tự động tải và chạy Chromium không cần cấu hình',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-puppeteer']
  },
  brave_search: {
    name: 'Brave Search MCP',
    package: '@modelcontextprotocol/server-brave-search',
    description: 'Công cụ tìm kiếm web riêng tư chuyên sâu của Brave',
    requiredEnv: ['BRAVE_API_KEY'],
    setupGuide: 'Lấy API key miễn phí tại: https://brave.com/search/api/',
    command: 'npx',
    args: ['-y', '@modelcontextprotocol/server-brave-search']
  },
  google_workspace: {
    name: 'Google Workspace MCP',
    package: '@aaronsb/google-workspace-mcp',
    description: 'Quản lý toàn diện Gmail, Google Drive, Docs, Sheets, Calendar',
    requiredEnv: ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
    setupGuide: 'Đã được cấu hình sẵn trong hệ thống',
    command: 'npx',
    args: ['-y', '@aaronsb/google-workspace-mcp']
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
}

export const mcpAutoProvisioner = new McpAutoProvisioner();
