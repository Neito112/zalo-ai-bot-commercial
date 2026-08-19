import { spawn } from 'child_process';

const USER_EMAIL = process.env.USER_EMAIL || 'thewolverineking@gmail.com';

const env = {
  ...process.env,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || ''
};

export async function callWorkspaceTool(toolName, args) {
  return new Promise((resolve) => {
    let isResolved = false;
    const safeResolve = (val) => {
      if (!isResolved) {
        isResolved = true;
        try { mcpProcess.kill(); } catch (e) {}
        resolve(val);
      }
    };

    const mcpProcess = spawn('npx', ['-y', '@aaronsb/google-workspace-mcp'], {
      env,
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
            if (json.id === 2) {
              if (json.result) {
                const textContent = json.result.content?.map(c => c.text).join('\n') || JSON.stringify(json.result);
                return safeResolve(textContent);
              } else if (json.error) {
                const errorMsg = json.error.message || JSON.stringify(json.error);
                return safeResolve(`Lỗi Google Workspace: ${errorMsg}`);
              }
            }
          } catch (e) {}
        }
      } catch (e) {}
    });

    mcpProcess.on('error', (err) => safeResolve(`Lỗi khởi chạy Google Workspace MCP: ${err.message}`));

    // Send JSON-RPC initialize
    const initReq = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'zalo-agent', version: '1.0' } }
    }) + '\n';

    mcpProcess.stdin.write(initReq);

    setTimeout(() => {
      try {
        mcpProcess.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

        const callReq = JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: {
              email: USER_EMAIL,
              ...args
            }
          }
        }) + '\n';

        mcpProcess.stdin.write(callReq);
      } catch (e) {}
    }, 400);

    setTimeout(() => {
      if (output.includes('Refresh token revoked') || output.includes('expired')) {
        safeResolve(`Tài khoản Google (${USER_EMAIL}) đã hết hạn phiên xác thực OAuth (Refresh token expired). Cần đăng nhập lại để sử dụng tính năng này.`);
      } else if (output) {
        safeResolve(output);
      } else {
        safeResolve(`Dịch vụ Google Workspace chưa được cấp quyền truy cập hoặc hết hạn xác thực cho tài khoản ${USER_EMAIL}.`);
      }
    }, 3500);
  });
}

// Batch tool execution over a single MCP process
export async function callWorkspaceToolBatch(calls) {
  return new Promise((resolve, reject) => {
    const mcpProcess = spawn('npx', ['-y', '@aaronsb/google-workspace-mcp'], {
      env,
      stdio: ['pipe', 'pipe', 'inherit'],
      shell: true
    });

    const results = [];
    let completed = 0;

    mcpProcess.stdout.on('data', (data) => {
      const text = data.toString();
      const lines = text.split('\n');
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          if (json.id && json.result) {
            const index = json.id - 2;
            const textContent = json.result.content?.map(c => c.text).join('\n') || JSON.stringify(json.result);
            results[index] = textContent;
            completed++;
            if (completed >= calls.length) {
              mcpProcess.kill();
              return resolve(results);
            }
          }
        } catch (e) {}
      }
    });

    mcpProcess.on('error', (err) => reject(err));

    // Send JSON-RPC initialize
    const initReq = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'zalo-agent', version: '1.0' } }
    }) + '\n';

    mcpProcess.stdin.write(initReq);

    setTimeout(() => {
      mcpProcess.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');

      calls.forEach((c, idx) => {
        const callReq = JSON.stringify({
          jsonrpc: '2.0',
          id: idx + 2,
          method: 'tools/call',
          params: {
            name: c.toolName,
            arguments: {
              email: USER_EMAIL,
              ...c.args
            }
          }
        }) + '\n';
        mcpProcess.stdin.write(callReq);
      });
    }, 1500);

    setTimeout(() => {
      mcpProcess.kill();
      resolve(results);
    }, 20000);
  });
}
