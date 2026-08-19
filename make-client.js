const MAKE_URL = process.env.MAKE_MCP_URL || 'https://eu1.make.com/mcp/server/9f33ae9f-1334-40a0-b482-103689cb9ad0';
const MAKE_KEY = process.env.MAKE_MCP_KEY || 'oq93VnhzYPq4khQSFZjqFkG5nPfgRjSA6Acc6MpQm9';

export async function callMakeTool(toolName, args = {}) {
  try {
    const res = await fetch(MAKE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MAKE_KEY}`,
        'x-api-key': MAKE_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args
        }
      })
    });

    const text = await res.text();
    const dataMatch = text.match(/data:\s*(\{[\s\S]*\})/);

    if (dataMatch) {
      const parsed = JSON.parse(dataMatch[1]);
      if (parsed.result) {
        return parsed.result.content?.map(c => c.text).join('\n') || JSON.stringify(parsed.result);
      }
      if (parsed.error) {
        return `⚠️ Make MCP Error: ${parsed.error.message}`;
      }
    }
    return text;
  } catch (err) {
    return `⚠️ Make MCP Connection Error: ${err.message}`;
  }
}
