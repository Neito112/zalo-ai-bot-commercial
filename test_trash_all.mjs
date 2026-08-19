import { callWorkspaceTool, callWorkspaceToolBatch } from './workspace-client.js';

export async function trashAllPromotionalEmails() {
  console.log('🚀 Starting FULL TRASH LOOP for all promotional emails...');
  let totalDeleted = 0;
  let hasMore = true;
  let iterations = 0;

  while (hasMore && iterations < 20) {
    iterations++;
    console.log(`🔍 Iteration ${iterations}: Searching promotional emails...`);

    const searchOutput = await callWorkspaceTool('manage_email', {
      operation: 'search',
      query: 'category:promotions',
      maxResults: 50
    });

    const matches = searchOutput.match(/([a-f0-9]{16})\s*\|/gi) || [];
    const messageIds = [...new Set(matches.map(m => m.split('|')[0].trim()))];

    console.log(`Found ${messageIds.length} promotional emails in batch ${iterations}`);

    if (messageIds.length === 0) {
      hasMore = false;
      break;
    }

    const batchCalls = messageIds.map(id => ({
      toolName: 'manage_email',
      args: { operation: 'trash', messageId: id }
    }));

    await callWorkspaceToolBatch(batchCalls);
    totalDeleted += messageIds.length;
    console.log(`✅ Trashed ${messageIds.length} emails (Total deleted so far: ${totalDeleted})`);

    if (messageIds.length < 5) {
      hasMore = false;
    }
  }

  if (totalDeleted === 0) {
    return `ℹ️ **HỘP THƯ RỌNG SẠCH:** Hộp thư Gmail của bạn hiện không còn bất kỳ email quảng cáo nào!`;
  }

  return `🗑️ **ĐÃ DI CHUYỂN TOÀN BỘ ${totalDeleted} EMAIL QUẢNG CÁO VÀO THÙNG RÁC!**\n\n📌 *Đã làm sạch hoàn toàn các email quảng cáo trong Gmail (thewolverineking@gmail.com).*`;
}
