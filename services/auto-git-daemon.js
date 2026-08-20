import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = util.promisify(exec);
const RND_DIR = path.resolve('c:/Users/HOMIE/Downloads/zalo-bot-chat');
const COMM_DIR = path.resolve('c:/Users/HOMIE/Downloads/zalo-bot-commercial');

let isSyncing = false;
let syncTimeout = null;

export function triggerSilentGitSync(commitMessage = 'auto: silent background brain & capabilities synchronization') {
  if (syncTimeout) clearTimeout(syncTimeout);

  syncTimeout = setTimeout(async () => {
    if (isSyncing) return;
    isSyncing = true;

    try {
      const timeStr = new Date().toLocaleString('vi-VN');
      const fullMsg = `${commitMessage} (${timeStr})`;

      // 1. Sync R&D Repo
      if (fs.existsSync(RND_DIR)) {
        try {
          await execPromise(`git -C "${RND_DIR}" add .`);
          await execPromise(`git -C "${RND_DIR}" commit -m "${fullMsg}"`);
          await execPromise(`git -C "${RND_DIR}" push origin master`);
          console.log(`✅ [AUTO-GIT-DAEMON] Đã tự động đẩy R&D Repo lên GitHub Cloud.`);
        } catch (e) {
          if (!e.stdout?.includes('nothing to commit')) {
            console.warn('R&D Sync info:', e.message);
          }
        }
      }

      // 2. Copy files to Commercial Repo & Push
      if (fs.existsSync(COMM_DIR)) {
        try {
          // Copy updated services and files
          const filesToSync = [
            'ai-agent.js',
            'bot-service.js',
            'dashboard-server.js',
            'package.json',
            'services/auto-research-loop.js',
            'services/cloud-brain-sync.js',
            'services/code-sandbox-engine.js',
            'services/cognitive-reflection.js',
            'services/document-intelligence.js',
            'services/excel-document-generator.js',
            'services/financial-intelligence.js',
            'services/google-workspace-native.js',
            'services/hybrid-retrieval-engine.js',
            'services/mcp-auto-provisioner.js',
            'services/media-generator.js',
            'services/multitask-orchestrator.js',
            'services/translation-engine.js',
            'services/vision-intelligence.js',
            'services/voice-intelligence.js',
            'services/web-research.js',
            'services/web-archiver-engine.js',
            'services/qr-intelligence.js',
            'services/weather-intelligence.js',
            'services/meeting-intelligence.js',
            'services/contract-review-engine.js',
            'services/email-composer-engine.js',
            'services/kpi-financial-analyzer.js',
            'services/competitor-intelligence.js',
            'services/project-planner-engine.js',
            'services/marketing-strategy-engine.js',
            'services/crisis-response-engine.js',
            'services/hr-interview-engine.js',
            'services/sales-objection-master.js',
            'services/presentation-outline-engine.js',
            'services/press-release-engine.js',
            'services/risk-management-engine.js',
            'services/daily-executive-briefing.js',
            'services/sop-generator-engine.js',
            'services/business-model-canvas-engine.js',
            'services/okr-alignment-engine.js',
            'services/content-repurposing-engine.js',
            'services/valuation-modeling-engine.js',
            'services/pricing-strategy-optimizer.js',
            'services/vendor-procurement-engine.js',
            'services/customer-retention-engine.js',
            'services/org-restructuring-engine.js',
            'services/cash-flow-runway-engine.js',
            'services/mna-due-diligence-engine.js',
            'services/cap-table-engine.js',
            'services/board-resolution-engine.js',
            'services/franchise-playbook-engine.js',
            'services/esop-incentive-engine.js',
            'services/pr-crisis-engine.js',
            'services/tax-optimization-engine.js',
            'services/ip-protection-engine.js',
            'services/cybersecurity-compliance-engine.js',
            'services/esg-sustainability-engine.js',
            'services/ai-automation-engine.js',
            'services/market-entry-engine.js',
            'services/decision-matrix-engine.js',
            'services/dispute-resolution-engine.js',
            'services/funnel-optimization-engine.js',
            'services/fx-treasury-engine.js',
            'services/agile-kaizen-engine.js',
            'services/channel-partner-engine.js',
            'services/pmi-integration-engine.js',
            'services/capital-allocation-engine.js',
            'services/supply-chain-resilience-engine.js',
            'services/customer-success-engine.js',
            'services/investment-memo-engine.js',
            'services/bcp-disaster-recovery-engine.js',
            'services/compensation-benefits-engine.js',
            'services/saas-metrics-engine.js',
            'services/brand-positioning-engine.js',
            'services/regulatory-compliance-engine.js',
            'services/change-management-engine.js',
            'services/advisory-board-engine.js',
            'services/dynamic-pricing-engine.js',
            'services/mna-tax-structuring-engine.js',
            'services/succession-planning-engine.js',
            'services/third-party-cyber-risk-engine.js',
            'services/pitch-deck-engine.js',
            'services/white-label-engine.js',
            'services/ai-governance-engine.js',
            'services/onboarding-ttv-engine.js',
            'services/api-economy-engine.js',
            'services/referral-flywheel-engine.js',
            'services/revops-compensation-engine.js',
            'services/working-capital-engine.js',
            'services/product-portfolio-engine.js',
            'services/cancel-culture-shield-engine.js',
            'services/cloud-finops-engine.js',
            'services/error-remediation-engine.js',
            'services/key-account-jbp-engine.js',
            'services/auto-git-daemon.js'
          ];

          for (const relFile of filesToSync) {
            const src = path.join(RND_DIR, relFile);
            const dest = path.join(COMM_DIR, relFile);
            const destDir = path.dirname(dest);
            if (fs.existsSync(src)) {
              if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
              fs.copyFileSync(src, dest);
            }
          }

          await execPromise(`git -C "${COMM_DIR}" add .`);
          await execPromise(`git -C "${COMM_DIR}" commit -m "${fullMsg}"`);
          await execPromise(`git -C "${COMM_DIR}" push origin master`);
          console.log(`✅ [AUTO-GIT-DAEMON] Đã tự động đẩy Commercial Repo lên GitHub Cloud.`);
        } catch (e) {
          if (!e.stdout?.includes('nothing to commit')) {
            console.warn('Commercial Sync info:', e.message);
          }
        }
      }
    } catch (err) {
      console.error('Lỗi Daemon Sync:', err.message);
    } finally {
      isSyncing = false;
    }
  }, 10000); // Debounce 10s
}

// Start continuous silent background watcher
export function startAutoGitWatcher() {
  console.log('🛡️ [AUTO-GIT-DAEMON] Dịch vụ tự động đồng bộ Git ngầm 100% ĐÃ KÍCH HOẠT.');
  setInterval(() => {
    triggerSilentGitSync('periodic: silent auto-sync brain and work capabilities');
  }, 15 * 60 * 1000); // Every 15 minutes
}
