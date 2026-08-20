import fs from 'fs';
import path from 'path';
import https from 'https';

const AUTH_FILE = path.resolve('github-auth.json');
const OWNER_USERNAME = 'Neito112';
const PRIVATE_REPO = 'Neito112/zalo-ai-bot-omnipotent';

export class GitHubAuthGuard {
  constructor() {
    this.authState = this.loadAuth();
  }

  loadAuth() {
    try {
      if (fs.existsSync(AUTH_FILE)) {
        const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
        if (data.token && data.username) {
          return {
            isAuthenticated: true,
            username: data.username,
            token: data.token,
            lastVerified: data.lastVerified
          };
        }
      }
    } catch (e) {}

    // Check if GITHUB_TOKEN exists in process.env
    if (process.env.GITHUB_TOKEN || process.env.GH_TOKEN) {
      return {
        isAuthenticated: true,
        username: OWNER_USERNAME,
        token: process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
        lastVerified: new Date().toISOString()
      };
    }

    return {
      isAuthenticated: false,
      username: null,
      token: null,
      lastVerified: null
    };
  }

  saveAuth(username, token) {
    this.authState = {
      isAuthenticated: true,
      username,
      token,
      lastVerified: new Date().toISOString()
    };
    try {
      fs.writeFileSync(AUTH_FILE, JSON.stringify(this.authState, null, 2), 'utf-8');
    } catch (e) {}
  }

  clearAuth() {
    this.authState = {
      isAuthenticated: false,
      username: null,
      token: null,
      lastVerified: null
    };
    try {
      if (fs.existsSync(AUTH_FILE)) {
        fs.unlinkSync(AUTH_FILE);
      }
    } catch (e) {}
  }

  /**
   * Verify token with GitHub API and check access to private repo
   */
  async verifyGitHubToken(token) {
    return new Promise((resolve) => {
      try {
        const cleanToken = token.trim();
        const req = https.get('https://api.github.com/user', {
          headers: {
            'Authorization': `Bearer ${cleanToken}`,
            'User-Agent': 'ZaloAiBot-Omnipotent-AuthGuard',
            'Accept': 'application/vnd.github.v3+json'
          },
          timeout: 10000
        }, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', async () => {
            try {
              if (res.statusCode === 200) {
                const user = JSON.parse(data);
                
                // Verify repo access
                const hasRepoAccess = await this.checkRepoAccess(cleanToken, PRIVATE_REPO);
                
                if (user.login?.toLowerCase() === OWNER_USERNAME.toLowerCase() || hasRepoAccess) {
                  this.saveAuth(user.login, cleanToken);
                  return resolve({
                    success: true,
                    username: user.login,
                    avatarUrl: user.avatar_url,
                    message: `✅ Xác thực thành công tài khoản GitHub [${user.login}]!`
                  });
                } else {
                  return resolve({
                    success: false,
                    message: `⚠️ Tài khoản [${user.login}] không có quyền truy cập repo riêng tư [${PRIVATE_REPO}].`
                  });
                }
              } else {
                return resolve({
                  success: false,
                  message: `⚠️ Token GitHub không hợp lệ hoặc đã hết hạn (Mã lỗi: ${res.statusCode}).`
                });
              }
            } catch (e) {
              resolve({ success: false, message: `Lỗi phân tích phản hồi: ${e.message}` });
            }
          });
        });

        req.on('error', (e) => resolve({ success: false, message: `Lỗi kết nối GitHub API: ${e.message}` }));
        req.on('timeout', () => { req.destroy(); resolve({ success: false, message: 'Hết thời gian kết nối GitHub (Timeout)' }); });
      } catch (e) {
        resolve({ success: false, message: e.message });
      }
    });
  }

  async checkRepoAccess(token, repoFullName) {
    return new Promise((resolve) => {
      try {
        const req = https.get(`https://api.github.com/repos/${repoFullName}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': 'ZaloAiBot-Omnipotent-AuthGuard',
            'Accept': 'application/vnd.github.v3+json'
          },
          timeout: 8000
        }, (res) => {
          resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.on('timeout', () => { req.destroy(); resolve(false); });
      } catch (e) {
        resolve(false);
      }
    });
  }

  getStatus() {
    return {
      isLocked: !this.authState.isAuthenticated,
      username: this.authState.username,
      ownerUsername: OWNER_USERNAME,
      repo: PRIVATE_REPO,
      lastVerified: this.authState.lastVerified
    };
  }
}

export const githubAuthGuard = new GitHubAuthGuard();
