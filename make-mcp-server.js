import readline from 'readline';

const MAKE_URL = process.env.MAKE_MCP_URL || 'https://eu1.make.com/mcp/server/9f33ae9f-1334-40a0-b482-103689cb9ad0';
const MAKE_KEY = process.env.MAKE_MCP_KEY || 'oq93VnhzYPq4khQSFZjqFkG5nPfgRjSA6Acc6MpQm9';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

rl.on('line', async (line) => {
  if (!line.trim()) return;
  try {
    const json = JSON.parse(line);
    
    // Auto-fix missing initialize params if needed by Make.com schema
    if (json.method === 'initialize' && json.params) {
      json.params.protocolVersion = json.params.protocolVersion || '2024-11-05';
      json.params.capabilities = json.params.capabilities || {};
      json.params.clientInfo = json.params.clientInfo || { name: 'antigravity-make-mcp', version: '1.0' };
    }

    // Forward JSON-RPC request to Make.com MCP server
    const res = await fetch(MAKE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAKE_KEY}`,
        'x-api-key': MAKE_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify(json)
    });

    const text = await res.text();
    const dataMatch = text.match(/data:\s*(\{[\s\S]*\})/);

    if (dataMatch) {
      process.stdout.write(dataMatch[1] + '\n');
    } else {
      process.stdout.write(JSON.stringify({
        jsonrpc: '2.0',
        id: json.id || null,
        result: { content: [{ type: 'text', text }] }
      }) + '\n');
    }
  } catch (err) {
    process.stderr.write(`Make MCP error: ${err.message}\n`);
  }
});
