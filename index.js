import { createRequire } from 'module';
import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const require = createRequire(import.meta.url);
const { Bot } = require('zalo-bot-js');

const TOKEN = process.env.ZALO_BOT_TOKEN || '';
const WEBHOOK_URL = process.env.ZALO_WEBHOOK_URL || '';
const SECRET_KEY = process.env.ZALO_SECRET_KEY || '';

let botInstance = new Bot(TOKEN);

const server = new Server(
  {
    name: 'zalo-bot-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'zalo_get_me',
        description: 'Get profile details of the Zalo Bot (Bot Quản đốc)',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'zalo_send_message',
        description: 'Send a text message to a Zalo user or group chat ID',
        inputSchema: {
          type: 'object',
          properties: {
            chat_id: {
              type: 'string',
              description: 'Target Zalo user ID or chat thread ID',
            },
            text: {
              type: 'string',
              description: 'Message content to send',
            },
          },
          required: ['chat_id', 'text'],
        },
      },
      {
        name: 'zalo_send_photo',
        description: 'Send an image via photo URL or local file path to a Zalo user or chat ID',
        inputSchema: {
          type: 'object',
          properties: {
            chat_id: {
              type: 'string',
              description: 'Target Zalo user ID or chat thread ID',
            },
            photo: {
              type: 'string',
              description: 'Image URL or local file path',
            },
            caption: {
              type: 'string',
              description: 'Optional caption text for the photo',
            },
          },
          required: ['chat_id', 'photo'],
        },
      },
      {
        name: 'zalo_send_chat_action',
        description: 'Send chat status action (e.g. typing, upload_photo) to a chat thread',
        inputSchema: {
          type: 'object',
          properties: {
            chat_id: {
              type: 'string',
              description: 'Target Zalo user ID or chat thread ID',
            },
            action: {
              type: 'string',
              description: 'Chat action type: typing, upload_photo, etc.',
              default: 'typing',
            },
          },
          required: ['chat_id'],
        },
      },
      {
        name: 'zalo_set_webhook',
        description: 'Set or update the Webhook URL for the Zalo Bot',
        inputSchema: {
          type: 'object',
          properties: {
            url: {
              type: 'string',
              description: 'Webhook URL (e.g. https://.../webhook)',
            },
            secret_token: {
              type: 'string',
              description: 'Optional secret token for webhook verification',
            },
          },
          required: ['url'],
        },
      },
      {
        name: 'zalo_get_webhook_info',
        description: 'Get current Webhook status and configuration of the Zalo Bot',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'zalo_get_me') {
      const me = await botInstance.getMe();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(me, null, 2),
          },
        ],
      };
    }

    if (name === 'zalo_send_message') {
      const { chat_id, text } = args;
      const res = await botInstance.sendMessage(chat_id, text);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(res, null, 2),
          },
        ],
      };
    }

    if (name === 'zalo_send_photo') {
      const { chat_id, photo, caption } = args;
      const options = caption ? { caption } : {};
      const res = await botInstance.sendPhoto(chat_id, photo, options);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(res, null, 2),
          },
        ],
      };
    }

    if (name === 'zalo_send_chat_action') {
      const { chat_id, action = 'typing' } = args;
      const res = await botInstance.sendChatAction(chat_id, action);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(res, null, 2),
          },
        ],
      };
    }

    if (name === 'zalo_set_webhook') {
      const { url, secret_token = SECRET_KEY } = args;
      const options = secret_token ? { secret_token } : {};
      const res = await botInstance.setWebHook(url, options);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(res, null, 2),
          },
        ],
      };
    }

    if (name === 'zalo_get_webhook_info') {
      const res = await botInstance.getWebhookInfo();
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(res, null, 2),
          },
        ],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (error) {
    return {
      isError: true,
      content: [
        {
          type: 'text',
          text: `Zalo Bot MCP Error: ${error.message || String(error)}`,
        },
      ],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Zalo Bot MCP Server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error starting Zalo Bot MCP Server:', err);
  process.exit(1);
});
