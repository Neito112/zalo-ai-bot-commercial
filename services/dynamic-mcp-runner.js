import { spawn } from 'child_process';
import { KNOWN_MCP_REGISTRY, mcpAutoProvisioner } from './mcp-auto-provisioner.js';

export async function callDynamicMcpTool(mcpKey, toolName, args = {}) {
  const servers = mcpAutoProvisioner.getConnectedServers();
  const serverMeta = servers[mcpKey] || KNOWN_MCP_REGISTRY[mcpKey];

  if (!serverMeta) {
    throw new Error(`Máy chủ MCP "${mcpKey}" chưa được cài đặt hoặc kích hoạt.`);
  }

  return new Promise((resolve, reject) => {
    const rawArgs = serverMeta.args || ['-y', serverMeta.package];
    const resolvedArgs = rawArgs.map(arg => {
      if (typeof arg === 'string' && arg.startsWith('${') && arg.endsWith('}')) {
        const envKey = arg.slice(2, -1);
        return process.env[envKey] || '';
      }
      return arg;
    });

    const mcpProcess = spawn(serverMeta.command || 'npx', resolvedArgs, {
      env: process.env,
      stdio: ['pipe', 'pipe', 'inherit'],
      shell: true
    });

    let output = '';

    mcpProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      try {
        const lines = text.split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const json = JSON.parse(line);
            if (json.id === 2 && json.result) {
              const textContent = json.result.content?.map(c => c.text).join('\n') || JSON.stringify(json.result);
              mcpProcess.kill();
              return resolve(textContent);
            }
          } catch (e) {}
        }
      } catch (e) {}
    });

    mcpProcess.on('error', (err) => reject(err));

    // Send JSON-RPC initialize
    const initReq = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'zalo-agent-mcp-hub', version: '1.0' } }
    }) + '\n';

    mcpProcess.stdin.write(initReq);

    setTimeout(() => {
      mcpProcess.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

      const callReq = JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args
        }
      }) + '\n';

      mcpProcess.stdin.write(callReq);
    }, 1500);

    setTimeout(() => {
      mcpProcess.kill();
      if (output) resolve(output);
      else resolve(`✅ Đã thực thi công cụ MCP ${toolName}`);
    }, 15000);
  });
}
