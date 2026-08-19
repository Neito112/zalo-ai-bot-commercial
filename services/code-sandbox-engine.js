import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = util.promisify(exec);
const SCRATCH_DIR = path.resolve('scratch_code');
if (!fs.existsSync(SCRATCH_DIR)) {
  fs.mkdirSync(SCRATCH_DIR, { recursive: true });
}

export class CodeSandboxEngine {
  /**
   * Thực thi mã nguồn JavaScript hoặc Python trong môi trường sandbox an toàn
   */
  async executeCode(language = 'javascript', code = '') {
    if (!code || typeof code !== 'string') {
      return { success: false, error: 'Mã nguồn không hợp lệ hoặc rỗng.' };
    }

    const lang = language.toLowerCase().trim();
    const timestamp = Date.now();

    try {
      if (lang === 'javascript' || lang === 'js' || lang === 'node') {
        const filePath = path.join(SCRATCH_DIR, `temp_${timestamp}.js`);
        fs.writeFileSync(filePath, code, 'utf-8');

        const { stdout, stderr } = await execPromise(`node "${filePath}"`, { timeout: 8000 });
        try { fs.unlinkSync(filePath); } catch (e) {}

        return {
          success: true,
          language: 'JavaScript',
          stdout: stdout.trim(),
          stderr: stderr.trim()
        };
      }

      if (lang === 'python' || lang === 'py') {
        const filePath = path.join(SCRATCH_DIR, `temp_${timestamp}.py`);
        fs.writeFileSync(filePath, code, 'utf-8');

        const { stdout, stderr } = await execPromise(`python "${filePath}"`, { timeout: 8000 });
        try { fs.unlinkSync(filePath); } catch (e) {}

        return {
          success: true,
          language: 'Python',
          stdout: stdout.trim(),
          stderr: stderr.trim()
        };
      }

      return {
        success: false,
        error: `Ngôn ngữ "${language}" chưa được hỗ trợ thực thi trực tiếp.`
      };
    } catch (err) {
      return {
        success: false,
        error: err.killed ? 'Quá thời gian thực thi (Timeout 8s).' : err.message,
        stdout: err.stdout?.trim() || '',
        stderr: err.stderr?.trim() || ''
      };
    }
  }
}

export const codeSandbox = new CodeSandboxEngine();
