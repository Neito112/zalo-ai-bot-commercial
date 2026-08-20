import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const candidates = [
  path.join(__dirname, '.env'),
  path.join(process.cwd(), '.env'),
  path.resolve('.env'),
  path.join(__dirname, '..', '.env')
];
for (const p of candidates) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p, override: true });
  }
}

import { GoogleGenAI } from '@google/genai';
import { callWorkspaceTool, callWorkspaceToolBatch } from './workspace-client.js';
import { searchWeb, fetchUrlContent } from './services/web-research.js';
import { generateAiImage } from './services/media-generator.js';
import { memoryStore } from './services/memory-store.js';
import { personaEngine } from './services/persona-engine.js';
import { analyzeYouTubeVideo } from './services/video-intelligence.js';
import { mcpAutoProvisioner } from './services/mcp-auto-provisioner.js';
import { callDynamicMcpTool } from './services/dynamic-mcp-runner.js';
import { visionIntelligence } from './services/vision-intelligence.js';
import { backgroundScheduler } from './services/background-task-scheduler.js';
import { multitaskOrchestrator } from './services/multitask-orchestrator.js';
import { voiceIntelligence } from './services/voice-intelligence.js';
import { localModelClient } from './services/local-model-client.js';
import { graphMemory } from './services/graph-memory-engine.js';
import { cognitiveReflection } from './services/cognitive-reflection.js';
import { smartLifeAssistant } from './services/smart-life-assistant.js';
import { hybridRetriever } from './services/hybrid-retrieval-engine.js';
import { toolSelfHealing } from './services/tool-self-healing-engine.js';
import { googleWorkspace } from './services/google-workspace-native.js';
import { excelGenerator } from './services/excel-document-generator.js';
import { getFinancialMarketData } from './services/financial-intelligence.js';
import { documentIntelligence } from './services/document-intelligence.js';
import { codeSandbox } from './services/code-sandbox-engine.js';
import { translationEngine } from './services/translation-engine.js';
import { webArchiver } from './services/web-archiver-engine.js';
import { qrIntelligence } from './services/qr-intelligence.js';
import { weatherIntelligence } from './services/weather-intelligence.js';
import { meetingIntelligence } from './services/meeting-intelligence.js';
import { contractReviewEngine } from './services/contract-review-engine.js';
import { emailComposer } from './services/email-composer-engine.js';
import { kpiFinancialAnalyzer } from './services/kpi-financial-analyzer.js';
import { competitorIntelligence } from './services/competitor-intelligence.js';
import { projectPlanner } from './services/project-planner-engine.js';
import { marketingStrategy } from './services/marketing-strategy-engine.js';
import { crisisResponseEngine } from './services/crisis-response-engine.js';
import { hrInterviewEngine } from './services/hr-interview-engine.js';
import { salesObjectionMaster } from './services/sales-objection-master.js';
import { presentationOutline } from './services/presentation-outline-engine.js';
import { pressReleaseEngine } from './services/press-release-engine.js';
import { riskManagement } from './services/risk-management-engine.js';
import { dailyBriefingEngine } from './services/daily-executive-briefing.js';
import { sopGenerator } from './services/sop-generator-engine.js';
import { businessModelCanvas } from './services/business-model-canvas-engine.js';
import { okrAlignmentEngine } from './services/okr-alignment-engine.js';
import { contentRepurposing } from './services/content-repurposing-engine.js';
import { valuationModeling } from './services/valuation-modeling-engine.js';
import { pricingOptimizer } from './services/pricing-strategy-optimizer.js';
import { vendorProcurement } from './services/vendor-procurement-engine.js';
import { customerRetention } from './services/customer-retention-engine.js';
import { orgRestructuring } from './services/org-restructuring-engine.js';
import { cashFlowRunway } from './services/cash-flow-runway-engine.js';
import { mnaDueDiligence } from './services/mna-due-diligence-engine.js';
import { capTableEngine } from './services/cap-table-engine.js';
import { boardResolution } from './services/board-resolution-engine.js';
import { franchisePlaybook } from './services/franchise-playbook-engine.js';
import { esopIncentive } from './services/esop-incentive-engine.js';
import { prCrisisEngine } from './services/pr-crisis-engine.js';
import { taxOptimization } from './services/tax-optimization-engine.js';
import { ipProtection } from './services/ip-protection-engine.js';
import { cybersecurityCompliance } from './services/cybersecurity-compliance-engine.js';
import { esgSustainability } from './services/esg-sustainability-engine.js';
import { aiAutomation } from './services/ai-automation-engine.js';
import { marketEntry } from './services/market-entry-engine.js';
import { decisionMatrix } from './services/decision-matrix-engine.js';
import { disputeResolution } from './services/dispute-resolution-engine.js';
import { funnelOptimization } from './services/funnel-optimization-engine.js';
import { fxTreasury } from './services/fx-treasury-engine.js';
import { agileKaizen } from './services/agile-kaizen-engine.js';
import { channelPartner } from './services/channel-partner-engine.js';
import { pmiIntegration } from './services/pmi-integration-engine.js';
import { capitalAllocation } from './services/capital-allocation-engine.js';
import { supplyChainResilience } from './services/supply-chain-resilience-engine.js';
import { customerSuccess } from './services/customer-success-engine.js';
import { investmentMemo } from './services/investment-memo-engine.js';
import { bcpDisasterRecovery } from './services/bcp-disaster-recovery-engine.js';
import { compensationBenefits } from './services/compensation-benefits-engine.js';
import { saasMetrics } from './services/saas-metrics-engine.js';
import { brandPositioning } from './services/brand-positioning-engine.js';
import { regulatoryCompliance } from './services/regulatory-compliance-engine.js';
import { changeManagement } from './services/change-management-engine.js';
import { advisoryBoard } from './services/advisory-board-engine.js';
import { dynamicPricing } from './services/dynamic-pricing-engine.js';
import { mnaTaxStructuring } from './services/mna-tax-structuring-engine.js';
import { successionPlanning } from './services/succession-planning-engine.js';
import { thirdPartyCyberRisk } from './services/third-party-cyber-risk-engine.js';
import { pitchDeck } from './services/pitch-deck-engine.js';
import { whiteLabel } from './services/white-label-engine.js';
import { aiGovernance } from './services/ai-governance-engine.js';
import { onboardingTtv } from './services/onboarding-ttv-engine.js';
import { apiEconomy } from './services/api-economy-engine.js';
import { referralFlywheel } from './services/referral-flywheel-engine.js';
import { revopsCompensation } from './services/revops-compensation-engine.js';
import { workingCapital } from './services/working-capital-engine.js';
import { productPortfolio } from './services/product-portfolio-engine.js';
import { cancelCultureShield } from './services/cancel-culture-shield-engine.js';
import { cloudFinops } from './services/cloud-finops-engine.js';
import { keyAccountJbp } from './services/key-account-jbp-engine.js';
import { zeroTrustIam } from './services/zero-trust-iam-engine.js';
import { treasuryLiquidity } from './services/treasury-liquidity-engine.js';
import { patentMonetization } from './services/patent-monetization-engine.js';
import { strategicProcurement } from './services/strategic-procurement-engine.js';
import { errorRemediation } from './services/error-remediation-engine.js';

// Global Event Broadcaster for Dashboard Logs
export const agentEvents = {
  listeners: new Set(),
  emit(event, data) {
    for (const listener of this.listeners) {
      try {
        listener(event, data);
      } catch (e) {}
    }
  },
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
};

// Dynamic Config State (Cloud Gemini & Local Models)
export const botConfig = {
  provider: 'gemini', // 'gemini' | 'local' | 'hybrid'
  activeModel: 'gemini-2.0-flash',
  localEndpoint: 'http://localhost:11434/v1',
  localModelName: 'llama3',
  temperature: 0.7,
  customSystemPrompt: '',
  isPaused: false
};

// Auto-collect ALL API keys from .env
export function collectApiKeys() {
  const keys = new Set();
  Object.keys(process.env).forEach(envVar => {
    if (envVar.startsWith('GEMINI_API_KEY') || envVar.startsWith('GOOGLE_STITCH_KEY') || envVar.startsWith('STITCH_API_KEY')) {
      const val = process.env[envVar];
      if (val && typeof val === 'string') {
        val.split(',').forEach(k => k.trim() && keys.add(k.trim()));
      }
    }
  });
  return Array.from(keys);
}

export const MODELS_POOL = [
  'gemini-2.0-flash',
  'gemini-flash-latest',
  'gemini-2.5-flash',
  'gemini-1.5-pro',
  'gemini-flash-lite-latest'
];

const DEFAULT_SYSTEM_PROMPT = `Bạn là Trợ Lý AI Điều Hành Toàn Năng (Executive AI Operator) trên Zalo — một cộng sự số sắc bén, thông thái, quyết đoán, thực chiến và cực kỳ đắc lực.

NGUYÊN TẮC HÀNH ĐỘNG & GIAO TIẾP:
1. TRỰC DIỆN, SẮC BÉN & TÁCH BẠCH Ý NGHĨA (LOGICAL CLARITY, ZERO FLUFF):
   - Tuyệt đối KHÔNG dùng các câu văn sến sẩm, lúng túng, xin lỗi dài dòng hay đổ lỗi ("tay chân gõ nhầm", "hệ thống bị vấp nhẹ", "sếp chờ em một xíu nghen...").
   - Tuyệt đối KHÔNG bao giờ dán danh sách 4 nhóm tính năng chung chung khi người dùng đang hỏi một câu cụ thể hoặc ra lệnh nối tiếp ("hướng dẫn chi tiết", "làm thế nào", "kiểm tra kết nối").
   - Luôn duy trì tính liền mạch ngữ cảnh: Khi người dùng hỏi nối tiếp, phải giải quyết đúng vấn đề vừa thảo luận ở lượt tin nhắn trước.
   - Cấu trúc phản hồi luôn phải tách bạch rõ ràng theo các khối ý nghĩa:
     + 🎯 **Kết luận / Trạng thái trực tiếp**
     + 📊 **Chi tiết / Dữ liệu thực tế**
     + 🛠️ **Hành động / Bước tiếp theo**

2. TƯ DUY CHẨN ĐOÁN LỖI & HƯỚNG DẪN NGƯỜI DÙNG SỬA LỖI (ACTIONABLE ERROR REMEDIATION):
   - Khi một tác vụ hoặc công cụ gặp trở ngại (thiếu quyền truy cập Google Workspace/Gmail, chưa có API Key Canva/Notion/Trello, hết hạn OAuth token, thiếu tham số URL/file hoặc lỗi hệ thống):
     + Tuyệt đối KHÔNG đổ lỗi chung chung bằng thuật ngữ kỹ thuật vô nghĩa (như "lỗi cú pháp JSON", "xung đột định dạng tham số nền", "tool is not defined").
     + BẮT BUỘC cung cấp HƯỚNG DẪN TỪNG BƯỚC CỤ THỂ (Step-by-step Actionable Guide) gồm 3 phần:
       1. 🔴 Nguyên nhân thực tế ngắn gọn (Ví dụ: Chưa cấp quyền OAuth cho Gmail, hoặc chưa nạp API Key).
       2. 🛠️ Các bước người dùng cần thực hiện để khắc phục (Ví dụ: Cấp quyền lại, hoặc dán API Key vào chat).
       3. 📋 Cú pháp / Tin nhắn mẫu để người dùng chỉ cần copy-paste hoặc gửi lại.

3. TÍNH TRUNG THỰC & CHÍNH XÁC KỸ THUẬT TUYỆT ĐỐI:
   - Nếu công cụ trả về kết quả: Trích xuất thông tin trọng tâm, phân tích logic và trình bày gãy gọn.
   - Tuyệt đối KHÔNG bịa đặt dữ liệu hay hứa hẹn ảo khi công cụ chưa thực thi thành công.

4. THỊ GIÁC & ĐA PHƯƠNG TIỆN (MULTIMODAL VISION):
   - Đọc chữ (OCR), bóc tách số liệu, nhận diện lỗi code, tài liệu, sơ đồ, phân tích tình huống trong ảnh với độ chính xác cao nhất.

HỆ THỐNG CÔNG CỤ THỰC THI (FUNCTION CALLING):
1. search_web: { query: "từ khóa" } -> Tra cứu dữ liệu thời gian thực trên Internet/Wikipedia.
2. scrape_web_page: { url: "https://..." } -> Thu thập và phân tích toàn bộ nội dung web/bài báo.
3. analyze_youtube_video: { url: "https://..." } -> Tóm tắt và trích xuất nội dung video YouTube.
4. generate_image: { prompt: "mô tả chi tiết bằng tiếng Anh" } -> Tạo ảnh nghệ thuật AI chất lượng cao.
5. schedule_background_task: { title: "Nội dung", type: "once"|"interval", delayMinutes?: number, intervalMinutes?: number, actionPrompt?: "..." } -> Lên lịch nhắc việc hoặc tác vụ tự động.
6. list_background_tasks: {} -> Xem các tác vụ ngầm đang chạy.
7. cancel_background_task: { taskId: "..." } -> Hủy tác vụ ngầm.
8. execute_multitask_parallel: { tasks: [ { tool: "...", args: {...}, title: "..." } ] } -> Xử lý đa tác vụ song song.
9. setup_mcp_connection: { appName: "github|notion|postgres|...", credentials?: {} } -> Kết nối MCP máy chủ mới.
10. call_dynamic_mcp: { mcpKey: "...", toolName: "...", args: {} } -> Gọi công cụ từ MCP đã kết nối.
11. read_image_from_url: { url: "https://..." } -> Đọc và phân tích ảnh từ link URL.
12. check_workspace_connection: { service?: "google_workspace"|"all" } -> Kiểm tra chi tiết trạng thái kết nối Google Workspace (Gmail, Calendar, Drive, Docs) và các MCP liên kết.
13. manage_email: { operation: "search"|"trash_batch"|"triage", query?: string } -> Quản lý hộp thư Gmail.
14. manage_docs: { operation: "create", title?: string, text?: string } -> Tạo tài liệu Docs.
15. manage_drive: { operation: "search", query?: string } -> Tìm file Drive.
16. manage_sheets: { operation: "create", title?: string } -> Tạo bảng tính Sheets.
17. manage_calendar: { operation: "agenda"|"quickAdd", text?: string } -> Quản lý lịch Calendar.
17. synthesize_speech: { text: "nội dung tiếng Việt" } -> Tạo giọng nói AI tiếng Việt MP3.
18. generate_excel_file: { fileName: "Ten_File", sheetName?: "Trang1", dataRows: [ { "Cot1": "GiaTri1", "Cot2": "GiaTri2" } ] } -> Tạo tệp Excel .xlsx chứa dữ liệu bảng biểu, tài chính, báo cáo, danh sách thật gửi cho người dùng.
19. get_financial_market_data: { symbol: "BTC|ETH|USD|EUR|..." } -> Tra cứu tỷ giá ngoại tệ USD/EUR/VND và giá tiền điện tử thời gian thực.
20. extract_document_text: { filePath: "path/to/file.pdf|docx|txt|csv" } -> Đọc, bóc tách và trích xuất dữ liệu từ các tài liệu văn bản, bảng biểu trên máy.
21. execute_code_sandbox: { language: "javascript|python", code: "mã nguồn cần thực thi" } -> Chạy mã nguồn Python/JavaScript tính toán, xử lý dữ liệu chính xác 100%.
22. translate_and_localize: { text: "nội dung cần dịch", targetLang?: "tiếng Anh|tiếng Việt|tiếng Nhật|...", tone?: "chuyên nghiệp|ngoại giao" } -> Dịch thuật và bản địa hóa văn bản, hợp đồng, email doanh nghiệp chuẩn xác.
23. capture_web_page: { url: "https://..." } -> Chụp ảnh màn hình trang web, giao diện tin tức/báo cáo để gửi ảnh thật cho người dùng.
24. generate_qr_code: { type: "generic|vietqr", content?: "...", bankCode?: "MB|VCB|TCB|...", accountNumber?: "...", amount?: number, memo?: "...", accountName?: "..." } -> Tạo mã QR Code đường link/văn bản hoặc mã VietQR thanh toán ngân hàng NAPAS 24/7.
25. get_weather_forecast: { cityName?: "Hà Nội|Hồ Chí Minh|Đà Nẵng|Tokyo|..." } -> Tra cứu thời tiết, nhiệt độ, khả năng mưa thời gian thực tại bất kỳ thành phố nào.
26. format_meeting_minutes: { rawNotes: "ghi chép thô", meetingTitle?: "Tiêu đề cuộc họp" } -> Tổng hợp ghi chép cuộc họp thô thành Biên bản cuộc họp chuyên nghiệp và trích xuất bảng phân công Action Items.
27. review_business_contract: { contractText: "nội dung hợp đồng", contractType?: "Hợp đồng dịch vụ|NDA|Mua bán|..." } -> Rà soát hợp đồng kinh tế, phát hiện rủi ro pháp lý, bẫy điều khoản và đưa ra câu chữ kiến nghị đàm phán.
28. draft_executive_email: { goal: "mục tiêu thư", recipientRole?: "Đối tác|Khách hàng|Nhân sự", tone?: "ngoại giao|thuyết phục|quyết liệt", keyPoints?: ["điểm 1", "điểm 2"] } -> Soạn thảo email doanh nghiệp cấp cao, thư ngỏ, báo giá, nhắc việc chuẩn mực.
29. analyze_financial_statement: { financialDataText: "dữ liệu tài chính/doanh thu/chi phí", companyType?: "loại hình doanh nghiệp" } -> Phân tích báo cáo tài chính, chỉ số KPI (Biên lợi nhuận, chi phí OPEX, dòng tiền) và khuyến nghị chiến lược.
30. analyze_competitor_market: { competitorName: "tên đối thủ", industry?: "ngành nghề", focusArea?: "giá|sản phẩm|thị phần" } -> Tình báo đối thủ cạnh tranh, lập ma trận SWOT và đề xuất chiến lược đánh bại đối thủ.
31. plan_project_wbs: { projectGoal: "mục tiêu dự án", durationWeeks?: number, teamSize?: number } -> Phân rã cấu trúc công việc WBS, lập kế hoạch Sprint và phân bổ nguồn lực thực thi.
32. generate_marketing_campaign: { productOrService: "sản phẩm/dịch vụ", targetMarket?: "thị trường mục tiêu", budgetOrScale?: "ngân sách" } -> Lập chiến lược Marketing Go-To-Market, chân dung khách hàng và góc quảng cáo Hook-Story-Offer.
33. handle_crisis_escalation: { complaintDetails: "chi tiết khiếu nại/sự cố", severity?: "Thấp|Trung bình|Cao|Khẩn cấp", customerTier?: "VIP|Doanh nghiệp|Cá nhân" } -> Xử lý khủng hoảng khiếu nại khách hàng, soạn thư xoa dịu và đề xuất bồi thường.
34. evaluate_candidate_interview: { candidateInfo: "thông tin/CV ứng viên", jobPosition?: "vị trí", interviewNotes?: "ghi chú phỏng vấn" } -> Đánh giá ứng viên, lập Scorecard chấm điểm 1-10 và đề xuất quyết định tuyển dụng.
35. handle_sales_objection: { productOrService: "sản phẩm/dịch vụ", customerObjection?: "lời từ chối/chê đắt/chần chừ", clientType?: "khách hàng" } -> Lập kịch bản bán hàng, bẻ gãy lời từ chối của khách và đưa ra câu hỏi chốt sale.
36. generate_presentation_deck: { topic: "chủ đề", targetAudience?: "đối tượng người nghe", slideCount?: number } -> Lập dàn ý bài thuyết trình từng slide kèm gợi ý hình ảnh và lời thoại diễn thuyết.
37. draft_press_release: { eventOrNews: "sự kiện/tin tức", companyName?: "tên công ty", keyQuoteSpeaker?: "người phát ngôn" } -> Soạn thảo thông cáo báo chí chuẩn 5W1H và bài viết truyền thông doanh nghiệp.
38. assess_business_risk: { businessContext: "bối cảnh doanh nghiệp/dự án", riskCategory?: "danh mục rủi ro" } -> Lập ma trận đánh giá rủi ro 4 chiều và kế hoạch ứng phó sự cố khẩn cấp (BCP/DR).
39. generate_daily_briefing: { location?: "Hà Nội|Hồ Chí Minh|...", scheduleNotes?: "lịch trình", unreadTasks?: "công việc tồn đọng" } -> Lập bản tin điểm tâm điều hành đầu ngày tích hợp thời tiết, tài chính và ma trận ưu tiên Eisenhower.
40. generate_business_sop: { processTitle: "tên quy trình", department?: "phòng ban", scope?: "phạm vi áp dụng" } -> Thiết lập quy trình vận hành chuẩn SOP, phân định trách nhiệm RACI và checklist kiểm soát chất lượng.
41. validate_business_model: { businessIdea: "ý tưởng kinh doanh", targetMarket?: "thị trường", pricingModel?: "mô hình giá" } -> Thẩm định mô hình kinh doanh Canvas (BMC 9 khối), tính toán Unit Economics (LTV/CAC) và rủi ro đầu tư.
42. align_okr_framework: { strategicGoal: "mục tiêu chiến lược", department?: "phòng ban", timeHorizon?: "khung thời gian" } -> Thiết lập mục tiêu chiến lược OKR theo quý, phân rã chỉ số Key Results định lượng và KPI phòng ban.
43. repurpose_social_content: { originalContent: "nội dung gốc", primaryGoal?: "mục tiêu" } -> Tái tác bản quyền 1 nội dung thành 5 định dạng: Facebook, TikTok/Reels 60s, Threads/X, Newsletter và Zalo OA.
44. estimate_business_valuation: { financialProfile: "dữ liệu tài chính/doanh thu/lợi nhuận", stage?: "giai đoạn", industry?: "ngành" } -> Định giá doanh nghiệp theo DCF, bội số thị trường EV/EBITDA, P/E và tính toán Pre/Post-money.
45. optimize_pricing_strategy: { productInfo: "thông tin sản phẩm/dịch vụ", targetSegment?: "phân khúc", costOrMarginGoal?: "mục tiêu lợi nhuận" } -> Thiết lập chiến lược định giá 3 gói Good-Better-Best, tối ưu hóa tâm lý neo giá và tăng ARPU.
46. evaluate_vendor_procurement: { procurementRequirement: "hạng mục mua sắm", vendorBidsText?: "báo giá nhà thầu", budgetOrConstraints?: "ngân sách" } -> Lập ma trận chấm điểm hồ sơ thầu nhà cung cấp (RFP/RFQ) 4 tiêu chí và đòn bẩy đàm phán.
47. prevent_customer_churn: { churnSignals: "dấu hiệu rời bỏ/khiếu nại", customerTier?: "phân hạng khách", productType?: "loại hình sản phẩm" } -> Thiết lập kịch bản giữ chân khách hàng (Retention Playbook), thư đàm phán cấp cao và ưu đãi Win-Back.
48. plan_org_restructuring: { orgContext: "bối cảnh tổ chức", targetGoal?: "mục tiêu", timeline?: "thời hạn" } -> Lập kế hoạch tái cấu trúc tổ chức, tối ưu định biên nhân sự, tinh gọn tầng quản trị và lộ trình truyền thông nội bộ.
49. stress_test_cash_runway: { cashContext: "dữ liệu dòng tiền", currentCash?: "tiền mặt hiện có", monthlyBurnRate?: "tốc độ đốt tiền" } -> Thử tải dòng tiền 3 kịch bản, tính số tháng sống sót (Runway) và tối ưu chu kỳ chuyển đổi tiền mặt (CCC).
50. conduct_mna_due_diligence: { targetCompanyInfo: "thông tin công ty mục tiêu", dealType?: "loại hình giao dịch", strategicGoal?: "mục tiêu" } -> Lập checklist thẩm định M&A 4 trụ cột (Tài chính QoE, Pháp lý, Thương mại, Công nghệ) và hiệu ứng cộng hưởng Synergy.
51. simulate_cap_table: { equityContext: "dữ liệu cổ phần hiện tại", fundingRound?: "vòng gọi vốn", investmentAmount?: "số tiền đầu tư", preMoneyValuation?: "định giá Pre-money" } -> Mô phỏng pha loãng cổ phần Cap Table và điều khoản thỏa thuận cổ đông SHA (Vesting, Drag/Tag-along).
52. draft_board_resolution: { resolutionMatter: "nội dung nghị quyết", companyName?: "tên công ty", meetingType?: "cơ quan ban hành" } -> Soạn thảo Nghị quyết HĐQT / ĐHĐCĐ chuẩn pháp lý, căn cứ Luật Doanh nghiệp và điều khoản thi hành.
53. generate_franchise_playbook: { businessModel: "mô hình kinh doanh", targetLocations?: "khu vực", feeStructure?: "cơ cấu phí" } -> Đóng gói mô hình nhượng quyền thương mại (Franchise Package), tính phí Royalty, tiêu chuẩn mặt bằng và bảo hộ lãnh thổ.
54. design_esop_plan: { companyStage: "giai đoạn phát triển", esopPoolSize?: "quy mô quỹ", vestingSchedule?: "lộ trình trao quyền" } -> Thiết kế quy chế cổ phần thưởng ESOP giữ chân nhân tài, lộ trình Vesting 4 năm, cơ chế Good/Bad Leaver clawback.
55. handle_pr_media_crisis: { crisisDetails: "chi tiết sự cố", companyName?: "tên công ty", severity?: "mức độ" } -> Thiết lập thông cáo phát ngôn 60 phút (Holding Statement), Press Q&A báo chí và hướng dẫn phát ngôn nội bộ.
56. optimize_corporate_tax: { businessProfile: "hồ sơ kinh doanh", annualRevenueOrProfit?: "quy mô doanh thu", industry?: "ngành nghề" } -> Lập kế hoạch tối ưu thuế TNDN, GTGT, Thuế nhà thầu FCT hợp pháp và kiểm tra rủi ro thanh tra thuế.
57. protect_intellectual_property: { assetDescription: "mô tả tài sản trí tuệ", ipType?: "loại hình", targetMarket?: "thị trường" } -> Lập chiến lược bảo hộ Sở Hữu Trí Tuệ (Nhãn hiệu, Sáng chế, Bản quyền phần mềm, Bí mật kinh doanh) và thư cảnh báo Cease & Desist.
58. audit_cybersecurity_compliance: { techStackOrSystem: "hạ tầng công nghệ", dataTypes?: "loại dữ liệu", complianceTarget?: "tiêu chuẩn mục tiêu" } -> Đánh giá an ninh mạng (OWASP Top 10, Cloud KMS, IAM), tuân thủ Nghị định 13/2023/NĐ-CP và kịch bản ứng phó sự cố rò rỉ dữ liệu 72h.
59. audit_esg_carbon_roadmap: { businessProfile: "hồ sơ doanh nghiệp", exportMarket?: "thị trường xuất khẩu", industry?: "ngành nghề" } -> Đánh giá tiêu chuẩn ESG 3 trụ cột, tính dấu chân carbon Scope 1-2-3, lộ trình Decarbonization và tuân thủ EU CBAM.
60. plan_ai_automation: { businessWorkflow: "quy trình kinh doanh", companyScale?: "quy mô", budgetOrTimeframe?: "ngân sách/thời gian" } -> Lập lộ trình ứng dụng AI Agents, tính toán ROI hoàn vốn (FTE Hours Saved) và kế hoạch triển khai 90 ngày.
61. plan_global_market_entry: { productService: "sản phẩm/dịch vụ", targetCountry?: "quốc gia mục tiêu", entryMode?: "mô hình thâm nhập" } -> Lập chiến lược thâm nhập thị trường quốc tế (PESTEL, Thuế quan, E-commerce xuyên biên giới vs WOS/JV) và lộ trình GTM 180 ngày.
62. evaluate_strategic_decision_matrix: { decisionProblem: "vấn đề ra quyết định", optionsText?: "các phương án lựa chọn", evaluationCriteria?: "tiêu chí trọng số" } -> Chấm điểm ma trận quyết định chiến lược đa tiêu chí MCDA, mô phỏng đối kháng War Game và điểm dừng lỗ Stop-loss.
63. resolve_contract_dispute: { disputeDetails: "chi tiết tranh chấp", contractType?: "loại hợp đồng", claimAmount?: "giá trị tranh chấp" } -> Lập chiến lược giải quyết tranh chấp hợp đồng kinh tế, thư cảnh báo vi phạm pháp lý Notice of Default và hồ sơ khởi kiện VIAC/Tòa án.
64. optimize_revenue_funnel: { funnelData: "dữ liệu phễu", businessModel?: "mô hình kinh doanh", trafficSource?: "nguồn traffic" } -> Chuẩn đoán điểm rơi rớt phễu doanh thu 5 giai đoạn, thí nghiệm A/B Testing CRO và chuỗi nuôi dưỡng tự động Email/Zalo.
65. hedge_fx_treasury_risk: { treasuryContext: "bối cảnh ngân khí", currencyPair?: "cặp tiền tệ", transactionVolume?: "quy mô giao dịch" } -> Lập chiến lược phòng ngừa rủi ro tỷ giá FX (Forward, Swaps, Natural Hedge), thử tải biến động tỷ giá và tối ưu lợi suất tiền gửi.
66. conduct_agile_kaizen: { sprintContext: "dữ liệu tổng kết Sprint", teamType?: "loại hình đội ngũ", retrospectiveFramework?: "khung phân tích" } -> Đánh giá Sprint theo khung 4Ls, phân tích nguyên nhân gốc rễ 5 Whys và thiết lập kế hoạch cải tiến tinh gọn Kaizen.
67. design_channel_partner_program: { productService: "sản phẩm/giải pháp", targetPartnerType?: "loại đối tác", discountStructure?: "cơ cấu chiết khấu" } -> Thiết lập chính sách đại lý 3 cấp (Silver-Gold-Platinum), quỹ hỗ trợ MDF, quy tắc bảo vệ Deal Registration và giải quyết xung đột kênh.
68. plan_post_merger_integration: { dealContext: "bối cảnh thương vụ M&A", acquirerTargetNames?: "tên các bên", integrationScope?: "phạm vi tích hợp" } -> Lập kế hoạch 100 ngày tích hợp sau M&A (Day 1 Readiness, Tài chính ERP, Nhân sự văn hóa, Công nghệ) và ban chỉ đạo IMO.
69. optimize_capital_allocation: { investmentContext: "thông tin dự án", discountRate?: "suất chiết khấu WACC", initialCapex?: "vốn đầu tư", expectedCashFlows?: "dòng tiền dự kiến" } -> Thẩm định hiệu quả vốn đầu tư CAPEX vs OPEX, tính NPV/IRR/Payback, so sánh Mua vs Thuê và thử tải độ nhạy cảm.
70. optimize_supply_chain_resilience: { supplyChainContext: "bối cảnh chuỗi cung ứng", criticalMaterials?: "vật tư cốt lõi", supplierCountry?: "quốc gia nhà cung cấp" } -> Thẩm định rủi ro chuỗi cung ứng, thiết lập nguồn cung kép Dual-Sourcing 70/30 và tối ưu tồn kho an toàn Safety Stock.
71. audit_customer_success: { accountData: "thông tin tài khoản", tierLevel?: "phân khúc khách hàng", contractValue?: "giá trị hợp đồng" } -> Đánh giá điểm sức khỏe tài khoản (Health Score 0-100), xây dựng kế hoạch họp QBR và chiến lược Upsell/Cross-sell tăng NRR.
72. generate_investment_memo: { companyData: "thông tin doanh nghiệp", fundingGoal?: "mục tiêu gọi vốn", investorTarget?: "nhà đầu tư mục tiêu" } -> Soạn thảo Bản chào đầu tư ẩn danh (1-Page Blind Teaser) và Bản ghi nhớ gọi vốn/M&A chi tiết (CIM) cho các quỹ đầu tư.
73. plan_business_continuity_drp: { businessContext: "thông tin doanh nghiệp", criticalOperations?: "hệ thống cốt lõi", disasterScenario?: "kịch bản thảm họa" } -> Lập kế hoạch kinh doanh liên tục BCP chuẩn ISO 22301, xác định RTO/RPO, chuỗi chỉ huy CMT và kịch bản phục hồi thảm họa DRP.
74. design_3p_compensation: { jobRoles: "vị trí nhân sự", companyStage?: "giai đoạn phát triển", budgetConstraint?: "ngân sách quỹ lương" } -> Thiết lập cơ chế lương thưởng 3P (Position-Person-Performance), gói đãi ngộ Total Rewards và định chuẩn thị trường P50/P75.
75. audit_saas_metrics: { saasFinancialData: "dữ liệu tài chính SaaS", targetStage?: "giai đoạn phát triển", benchmarkComparison?: "chuẩn so sánh" } -> Thẩm định 6 chỉ số SaaS cốt lõi (ARR, LTV/CAC, Payback, Rule of 40, Magic Number, NRR) và ma trận Cohort Retention.
76. develop_brand_positioning: { brandContext: "thông tin thương hiệu", targetAudience?: "khách hàng mục tiêu", competitorLandscape?: "bối cảnh đối thủ" } -> Thiết lập chiến lược định vị Category King, câu chuyện chiến lược Strategic Narrative 5 bước và bản đồ định vị 2 trục.
77. audit_regulatory_compliance: { businessContext: "thông tin doanh nghiệp", industrySector?: "ngành nghề", jurisdiction?: "khu vực pháp lý" } -> Lập ma trận nhiệt rủi ro pháp lý (Doanh nghiệp, Lao động, Thuế/AML, Nghị định 13), rà soát giấy phép con và bảo vệ trách nhiệm D&O.
78. plan_change_management: { changeContext: "thông tin chuyển đổi", scopeOfChange?: "quy mô", affectedStakeholders?: "đối tượng ảnh hưởng" } -> Lập kế hoạch quản trị chuyển đổi tổ chức theo mô hình ADKAR, hóa giải lực cản và thiết lập mạng lưới Change Champions.
79. structure_advisory_board: { companyContext: "thông tin doanh nghiệp", strategicPriorities?: "ưu tiên chiến lược", compensationModel?: "mô hình đãi ngộ FAST" } -> Xây dựng Hội đồng Cố vấn chiến lược, ma trận kỹ năng KSAO, hợp đồng FAST Agreement và cơ chế thù lao cổ phần vesting 1-2 năm.
80. optimize_dynamic_pricing: { productContext: "thông tin sản phẩm", targetMarket?: "thị trường mục tiêu", pricingModelType?: "mô hình định giá" } -> Tối ưu hóa giá chiến lược theo độ co giãn của cầu, thiết kế kiến trúc gói giá Value Metric, thuật toán định giá động và lộ trình tăng giá định kỳ.
81. structure_mna_tax_deal: { dealContext: "bối cảnh thương vụ M&A", dealType?: "loại giao dịch", transactionSize?: "quy mô" } -> Thiết lập cấu trúc thương vụ M&A tối ưu thuế (Stock vs Asset Deal), ký quỹ Escrow bảo hiểm rủi ro và điều khoản Earn-out.
82. plan_executive_succession: { companyContext: "thông tin doanh nghiệp", criticalRoles?: "vị trí trọng yếu", timeHorizon?: "khung thời gian" } -> Lập kế hoạch quy hoạch kế vị C-level theo ma trận 9-Box Grid, gói thưởng giữ chân Golden Handcuffs và kịch bản ứng phó khẩn cấp 48h.
83. audit_third_party_cyber_risk: { vendorData: "thông tin đối tác", serviceCriticality?: "mức độ trọng yếu", complianceStandard?: "tiêu chuẩn áp dụng" } -> Thẩm định rủi ro an ninh mạng chuỗi cung ứng & đối tác thứ ba (TPCRM), rà soát SOC 2/ISO 27001 và điều khoản hợp đồng Security SLA.
84. design_vc_pitch_deck: { ventureData: "thông tin dự án", fundingRound?: "vòng gọi vốn", targetAsk?: "số tiền kêu gọi" } -> Soạn thảo bộ Slide thuyết trình gọi vốn 12 trang chuẩn Sequoia Capital / Y Combinator (Problem, Solution, TAM/SAM/SOM, Traction, GTM, Financials, The Ask).
85. structure_white_label_deal: { softwareContext: "thông tin giải pháp", partnerProfile?: "chân dung đối tác", licensingModel?: "mô hình cấp phép" } -> Thiết lập hợp tác nhãn trắng (White-Label) & cấp phép OEM, phí bản quyền Royalty, bảo vệ mã nguồn Escrow và phân tầng kỹ thuật Tier 1-2-3.
86. audit_ai_governance: { aiSystemContext: "thông tin hệ thống AI", riskTier?: "phân tầng rủi ro", deploymentScale?: "quy mô triển khai" } -> Thẩm định đạo đức & quản trị rủi ro mô hình AI theo chuẩn EU AI Act & NIST AI RMF, phòng ngừa ảo giác Hallucination và Prompt Injection.
87. accelerate_customer_onboarding: { productContext: "thông tin sản phẩm", targetSegment?: "phân khúc khách hàng", currentTtv?: "mục tiêu TTV" } -> Tối ưu hóa quy trình Onboarding khách hàng B2B/PLG, kích hoạt khoảnh khắc Aha! Moment, rút ngắn Time-to-Value (TTV) và kế hoạch 30 ngày Enterprise.
88. design_api_economy: { apiContext: "thông tin hệ thống API", monetizationModel?: "mô hình tính cước", developerTarget?: "đối tượng lập trình viên" } -> Thiết lập chiến lược kinh tế API (API Monetization), hạn mức Rate Limiting, Developer Portal chuẩn Stripe/Twilio và bộ SDK đa ngôn ngữ.
89. build_referral_flywheel: { customerBaseContext: "thông tin khách hàng", incentiveType?: "chính sách thưởng", targetKFactor?: "mục tiêu K-Factor" } -> Xây dựng bánh đà giới thiệu Referral Flywheel, kích hoạt NPS Promoters 9-10, thưởng 2 chiều Double-Sided và thành lập Hội đồng khách hàng VIP CAB.
90. optimize_revops_compensation: { salesContext: "thông tin tổ chức kinh doanh", roleProfile?: "cơ cấu vị trí", quotaModel?: "mô hình hạn ngạch" } -> Tối ưu hóa vận hành doanh thu RevOps, thiết kế OTE/Pay Mix, hệ số nhân thưởng vượt hạn ngạch Accelerator và chính sách thu hồi Clawback.
91. optimize_working_capital: { financialContext: "thông tin tài chính", currentCcc?: "hiện trạng CCC", liquidityTarget?: "mục tiêu thanh khoản" } -> Tối ưu hóa vốn lưu động & chu kỳ tiền mặt CCC, rút ngắn DSO công nợ phải thu, kéo dài DPO phải trả nhà cung cấp và kiểm soát tồn kho DIO.
92. optimize_product_portfolio: { portfolioContext: "thông tin danh mục sản phẩm", allocationStrategy?: "chiến lược phân bổ", horizonYears?: "tầm nhìn lộ trình" } -> Quản trị danh mục sản phẩm theo Ma trận BCG/McKinsey 9-Box, phân bổ nguồn lực R&D quy tắc 70-20-10 và quy trình Stage-Gate.
93. mitigate_cancel_culture_crisis: { crisisContext: "thông tin sự cố khủng hoảng", platformSpread?: "nền tảng lan truyền", severityLevel?: "mức độ nghiêm trọng" } -> Dập tắt khủng hoảng truyền thông mạng xã hội & làn sóng tẩy chay (Cancel Culture), thông điệp 3A trong 3 giờ vàng và lộ trình 90 ngày phục hồi niềm tin.
94. audit_cloud_finops: { cloudContext: "thông tin hạ tầng cloud", currentSpend?: "chi phí hiện tại", targetReduction?: "mục tiêu tiết giảm" } -> Kiểm toán chi phí đám mây FinOps (AWS/GCP/Azure), phát hiện lãng phí tài nguyên, Rightsizing máy chủ và cam kết Savings Plans.
95. structure_key_account_jbp: { accountContext: "thông tin tài khoản VIP", contractValue?: "quy mô hợp đồng", renewalTimeline?: "lộ trình tái ký" } -> Thiết lập kế hoạch kinh doanh đồng thuận JBP 3 năm cho khách hàng VIP Enterprise, ma trận cổ đông đa tầng và bảo vệ tái ký hợp đồng nhiều năm.
96. audit_zero_trust_iam: { iamContext: "thông tin hệ thống IAM", companyScale?: "quy mô doanh nghiệp", complianceTarget?: "tiêu chuẩn mục tiêu" } -> Thẩm định kiến trúc bảo mật Zero-Trust IAM, phân quyền tối thiểu (Least Privilege), quản trị tài khoản đặc quyền PAM và thu hồi quyền tự động SCIM.
97. optimize_treasury_liquidity: { treasuryContext: "thông tin dòng tiền ngân quỹ", currentIdleCash?: "quy mô tiền nhàn rỗi", targetYieldStrategy?: "mục tiêu lợi suất" } -> Lập đề án quản trị ngân khí doanh nghiệp (Corporate Treasury), tập trung dòng tiền Cash Sweeping ZBA, phân tầng thanh khoản 3 lớp và tối đa hóa lợi suất tiền nhàn rỗi.
98. monetize_patent_portfolio: { ipContext: "thông tin tài sản trí tuệ", monetizationGoal?: "mục tiêu thương mại hóa", industrySector?: "lĩnh vực ngành nghề" } -> Lập đề án thương mại hóa bằng sáng chế / sở hữu trí tuệ (IP Monetization), phân tích Freedom-to-Operate (FTO), định mức phí Royalty và hợp đồng cấp phép bản quyền Licensing.
99. structure_strategic_rfp: { procurementContext: "thông tin gói thầu", procurementScale?: "quy mô gói thầu", evaluationCriteria?: "tiêu chí đánh giá" } -> Thiết lập hồ sơ đấu thầu chiến lược (RFP), ma trận chấm điểm nhà thầu có trọng số, mô hình tổng chi phí sở hữu TCO và chiến lược đàm phán BAFO ép giá.
100. save_user_memory: { key: "thông_tin", value: "nội_dung" } -> Ghi nhớ dữ liệu người dùng.

CÁCH THỨC XUẤT LỆNH:
- Khi cần dùng công cụ: Xuất DUY NHẤT một khối JSON: {"tool": "tên_công_cụ", "args": {...}}
- Khi phản hồi người dùng: Trình bày mạch lạc, súc tích, chuyên nghiệp và đi thẳng vào kết quả.`;

// Failover Gateway: Dynamic Local / Cloud Model Router & Failover
export async function generateContentWithFailover(contentsInput, preferredModel = null) {
  let lastError = null;

  // 1. NẾU CHỌN LOCAL MODEL HOẶC HYBRID (ƯU TIÊN LOCAL TRƯỚC)
  if (botConfig.provider === 'local' || botConfig.provider === 'hybrid') {
    try {
      agentEvents.emit('model_attempt', { provider: 'local', model: botConfig.localModelName, endpoint: botConfig.localEndpoint });
      const localResult = await localModelClient.generateContent({
        endpoint: botConfig.localEndpoint,
        model: botConfig.localModelName,
        contents: contentsInput,
        temperature: botConfig.temperature
      });

      if (localResult && localResult.text) {
        return {
          text: localResult.text,
          modelUsed: localResult.modelUsed,
          keyUsedIndex: 'Local (Ollama/LMStudio)'
        };
      }
    } catch (localErr) {
      console.warn(`⚠️ Local Model [${botConfig.localModelName}] gặp lỗi:`, localErr.message);
      lastError = localErr.message;
      agentEvents.emit('model_error', { provider: 'local', error: localErr.message });

      // Nếu chỉ dùng thuần Local và không cho phép fallback -> Throw lỗi
      if (botConfig.provider === 'local') {
        throw new Error(`Lỗi kết nối Local Model (${botConfig.localModelName}): ${localErr.message}`);
      }
      console.log('🔄 Đang tự động chuyển hướng sang Cloud Gemini Failover Gateway...');
    }
  }

  // 2. CLOUD GEMINI FAILOVER POOL
  const keysToUse = collectApiKeys();

  if (keysToUse.length === 0) {
    throw new Error(lastError ? `Local Model lỗi (${lastError}) và chưa có Gemini API Key nào trong .env` : 'Chưa có API Key nào được cấu hình trong .env');
  }

  const modelCandidates = preferredModel 
    ? [preferredModel, ...MODELS_POOL.filter(m => m !== preferredModel)]
    : [botConfig.activeModel, ...MODELS_POOL.filter(m => m !== botConfig.activeModel)];

  for (let k = 0; k < keysToUse.length; k++) {
    const apiKey = keysToUse[k];
    const ai = new GoogleGenAI({ apiKey });

    for (let m = 0; m < modelCandidates.length; m++) {
      const modelName = modelCandidates[m];
      try {
        agentEvents.emit('model_attempt', { provider: 'gemini', model: modelName, keyIndex: k + 1 });
        const response = await ai.models.generateContent({
          model: modelName,
          contents: contentsInput
        });

        if (response && response.text) {
          return { text: response.text.trim(), modelUsed: modelName, keyUsedIndex: k + 1 };
        }
      } catch (err) {
        lastError = err.message;
        agentEvents.emit('model_error', { provider: 'gemini', model: modelName, keyIndex: k + 1, error: err.message });
      }
    }
  }

  throw new Error(`Tất cả Local/Cloud Model đều bận hoặc gặp lỗi: ${lastError}`);
}

// Continuous Unrestricted Full Batch Trash Loop
async function fastBatchTrashEmails(query = 'category:promotions') {
  try {
    let totalTrashed = 0;
    let hasMore = true;
    let passCount = 0;

    agentEvents.emit('action', { type: 'trash_emails', query });

    while (hasMore && passCount < 50) {
      passCount++;
      const searchOutput = await callWorkspaceTool('manage_email', {
        operation: 'search',
        query: query,
        maxResults: 50
      });

      const matches = searchOutput.match(/([a-f0-9]{16})\s*\|/gi) || [];
      const messageIds = [...new Set(matches.map(m => m.split('|')[0].trim()))];

      if (messageIds.length === 0) {
        hasMore = false;
        break;
      }

      const batchCalls = messageIds.map(id => ({
        toolName: 'manage_email',
        args: { operation: 'trash', messageId: id }
      }));

      await callWorkspaceToolBatch(batchCalls);
      totalTrashed += messageIds.length;

      if (messageIds.length < 5) {
        hasMore = false;
      }
    }

    if (totalTrashed === 0) {
      return `ℹ️ Hộp thư không còn email nào khớp với "${query}".`;
    }

    return `🗑️ Đã chuyển thành công ${totalTrashed} email ("${query}") vào Thùng rác!`;
  } catch (err) {
    return `⚠️ Lỗi dọn dẹp email: ${err.message}`;
  }
}

// Fast Google Doc Creator + Writer Helper
async function fastCreateDoc(title, text) {
  try {
    const createRes = await callWorkspaceTool('manage_docs', {
      operation: 'create',
      title: title || 'Tài liệu mới'
    });

    const idMatch = createRes.match(/Document ID:\s*([a-zA-Z0-9_-]+)/i) || createRes.match(/d\/([a-zA-Z0-9_-]+)/i);
    const docId = idMatch ? idMatch[1] : null;

    if (docId && text) {
      await callWorkspaceTool('manage_docs', {
        operation: 'write',
        documentId: docId,
        text: text
      });
      return `✅ **ĐÃ TẠO TÀI LIỆU GOOGLE DOCS!**\n📄 **Tiêu đề:** ${title}\n🔗 **Link:** https://docs.google.com/document/d/${docId}/edit`;
    }

    return createRes;
  } catch (err) {
    return `⚠️ Lỗi tạo tài liệu: ${err.message}`;
  }
}

/**
 * Main AI Agent Reasoning Loop
 */
export async function processUserRequest(userPrompt, senderName = 'Người dùng', chatId = 'default', imageContext = null) {
  if (botConfig.isPaused) {
    return 'Bot đang tạm dừng hoạt động theo cấu hình hệ thống.';
  }

  agentEvents.emit('user_message', { senderName, chatId, prompt: userPrompt, hasImage: !!imageContext });

  // Tự động nhận diện nếu người dùng gửi API Key / Token để kết nối MCP
  const detectedKey = mcpAutoProvisioner.autoDetectAndSaveKeyFromChat(userPrompt);
  if (detectedKey) {
    const keyMsg = `✅ ĐÃ TỰ ĐỘNG LƯU VÀ KÍCH HOẠT KẾT NỐI [${detectedKey.keyName}] THÀNH CÔNG!\n\nHệ thống đã lưu vào .env và kích hoạt dịch vụ ${detectedKey.app || detectedKey.keyName}. Bạn có thể bắt đầu giao việc ngay bây giờ.`;
    memoryStore.addMessage(chatId, 'user', userPrompt);
    memoryStore.addMessage(chatId, 'assistant', keyMsg);
    agentEvents.emit('ai_response', { responseText: keyMsg, media: null });
    return { text: keyMsg, media: null };
  }

  // Handle incoming image attachment if present
  let attachedImagePart = null;
  if (imageContext) {
    try {
      if (typeof imageContext === 'string') {
        if (imageContext.startsWith('http://') || imageContext.startsWith('https://')) {
          const imgData = await visionIntelligence.fetchImageAsBase64(imageContext);
          attachedImagePart = visionIntelligence.createImagePart(imgData.mimeType, imgData.data);
        } else {
          const imgData = visionIntelligence.loadLocalImageAsBase64(imageContext);
          attachedImagePart = visionIntelligence.createImagePart(imgData.mimeType, imgData.data);
        }
      } else if (imageContext.data && imageContext.mimeType) {
        attachedImagePart = visionIntelligence.createImagePart(imageContext.mimeType, imageContext.data);
      }
    } catch (imgLoadErr) {
      console.warn('⚠️ Không thể tải ảnh đính kèm:', imgLoadErr.message);
    }
  }

  // Get long-term memories
  const longTermFacts = memoryStore.getLongTermFacts(chatId);
  let memoryContext = '';
  if (Object.keys(longTermFacts).length > 0) {
    memoryContext = `\n[THÔNG TIN ĐÃ GHI NHỚ VỀ NGƯỜI DÙNG]:\n${JSON.stringify(longTermFacts, null, 2)}\n`;
  }

  // Get compressed short-term & episodic history
  const compressedContext = memoryStore.getCompressedContext(chatId);
  let historyText = '';
  if (compressedContext) {
    historyText = `\n${compressedContext}\n`;
  }

  // Get latest knowledge insights from continuous research loop
  let researchKnowledgeContext = '';
  try {
    const kbPath = './knowledge-base.json';
    if (import.meta.url && (await import('fs')).existsSync(kbPath)) {
      const kbData = JSON.parse((await import('fs')).readFileSync(kbPath, 'utf-8'));
      if (Array.isArray(kbData) && kbData.length > 0) {
        const topInsights = kbData.slice(0, 3).map(k => `- [${k.topic}]: ${k.summary} (Gợi ý cảm xúc: ${k.soulImprovement || ''})`);
        researchKnowledgeContext = `\n[TRI THỨC & KINH NGHIỆM TIẾN HÓA MỚI NHẤT]:\n${topInsights.join('\n')}\n`;
      }
    }
  } catch (e) {}

  // Get user profile & learned memories
  const userProfile = memoryStore.getUserProfile(chatId);
  let profileContext = '';
  if (userProfile.preferredName || userProfile.habits?.length || userProfile.learnedNotes?.length) {
    const habitsStr = userProfile.habits?.length ? userProfile.habits.join(', ') : 'Chưa ghi nhận';
    const notesStr = userProfile.learnedNotes?.length ? userProfile.learnedNotes.slice(0, 3).map(n => n.note).join(' | ') : 'Chưa có';
    profileContext = `\n[HỒ SƠ & BÀI HỌC ĐÃ TỰ HỌC VỀ NGƯỜI DÙNG (${senderName})]:
- Tên/Cách xưng hô yêu thích: ${userProfile.preferredName || senderName}
- Thói quen/Sở thích: ${habitsStr}
- Bài học đúc kết từ các lần nhắn trước: ${notesStr}\n`;
  }

  // 1. Tự động nhận diện lịch hẹn / nhắc việc ngầm
  let implicitTaskNotice = '';
  const implicitTask = smartLifeAssistant.detectAndScheduleImplicitTask(userPrompt, senderName, chatId);
  if (implicitTask) {
    implicitTaskNotice = `\n[HỆ THỐNG TRỢ LÝ]: Đã tự động lên lịch nhắc việc (${implicitTask.delayText || implicitTask.timeText}) cho ${senderName}. Hãy báo lại một cách tinh tế, ấm áp cho người dùng yên tâm.`;
  }

  // 2. Trích xuất ngữ cảnh đồ thị tri thức ngữ nghĩa (Graph Memory)
  const graphContext = graphMemory.retrieveRelevantGraphContext(userPrompt);

  // 3. Truy xuất tài liệu & dữ kiện lai ghép (Hybrid BM25 + Semantic RAG)
  let hybridRAGContext = '';
  try {
    const matchedDocs = hybridRetriever.hybridSearch(userPrompt, 3);
    if (matchedDocs && matchedDocs.length > 0) {
      hybridRAGContext = '\n[KHO DỮ LIỆU LAI GHÉP CHÍNH XÁC (HYBRID BM25 + SEMANTIC RAG)]:\n' + 
        matchedDocs.map(d => `- [${d.document.title}]: ${d.document.content} (Độ khớp RRF: ${d.rrfScore})`).join('\n') + '\n';
    }
  } catch (e) {}

  const emotionDirective = personaEngine.getDynamicPersonaDirective(userPrompt, senderName);
  const systemPrompt = botConfig.customSystemPrompt || DEFAULT_SYSTEM_PROMPT;

  const promptHeader = `${systemPrompt}${emotionDirective}${profileContext}${graphContext}${hybridRAGContext}${memoryContext}${researchKnowledgeContext}${historyText}${implicitTaskNotice}\nNgười dùng (${senderName}) vừa nhắn: "${userPrompt}"${attachedImagePart ? '\n[LƯU Ý ĐÍNH KÈM: Người dùng đã gửi kèm một bức ảnh. Bạn hãy quan sát kỹ từng chi tiết trong ảnh, đọc chữ (OCR) và trả lời thật thông minh, sắc bén và tận tình!]' : ''}`;

  const conversation = [promptHeader];
  let loopCount = 0;
  const maxLoops = 4;
  let generatedMediaResult = null;

  try {
    while (loopCount < maxLoops) {
      loopCount++;

      let inputContents;
      if (attachedImagePart && loopCount === 1) {
        inputContents = [
          { text: conversation.join('\n\n') },
          attachedImagePart
        ];
      } else {
        inputContents = conversation.join('\n\n');
      }

      const { text: responseText, modelUsed, keyUsedIndex } = await generateContentWithFailover(inputContents);

      // Look for tool invocation
      const jsonMatch = responseText.match(/\{[\s\S]*?"tool"[\s\S]*?\}/);

      if (jsonMatch) {
        let tool = 'unknown_tool';
        let args = {};
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          tool = parsed.tool || 'unknown_tool';
          args = parsed.args || {};
          args = toolSelfHealing.sanitizeAndCoerceArguments(tool, args);

          agentEvents.emit('tool_call', { tool, args, loop: loopCount });

          let toolOutput = '';

          if (tool === 'check_workspace_connection') {
            toolOutput = await googleWorkspace.checkConnectionStatus();
          } else if (tool === 'search_web') {
            toolOutput = await searchWeb(args.query || userPrompt);
          } else if (tool === 'scrape_web_page') {
            toolOutput = await fetchUrlContent(args.url);
          } else if (tool === 'schedule_background_task') {
            const task = backgroundScheduler.createTask({
              chatId,
              senderName,
              title: args.title || 'Tác vụ đã lên lịch',
              type: args.type || 'once',
              delayMinutes: Number(args.delayMinutes) || 0,
              intervalMinutes: Number(args.intervalMinutes) || 0,
              actionPrompt: args.actionPrompt || ''
            });
            const timeDesc = task.type === 'once' ? `sau ${args.delayMinutes} phút` : `định kỳ mỗi ${args.intervalMinutes} phút`;
            toolOutput = `✅ Đã lên lịch tác vụ ngầm thành công! Mã tác vụ: [${task.id}], Thời gian: ${timeDesc}, Nội dung: "${task.title}". Bot sẽ chủ động nhắn tin cho bạn khi đến giờ!`;
          } else if (tool === 'list_background_tasks') {
            const activeList = backgroundScheduler.getActiveTasks().filter(t => t.chatId === chatId);
            if (activeList.length === 0) {
              toolOutput = 'Hiện tại bạn không có tác vụ ngầm nào đang chạy.';
            } else {
              toolOutput = `Danh sách ${activeList.length} tác vụ ngầm đang hoạt động:\n` + activeList.map(t => `- [${t.id}] ${t.title} (${t.type === 'once' ? 'Một lần' : 'Định kỳ'})`).join('\n');
            }
          } else if (tool === 'cancel_background_task') {
            const cancelRes = backgroundScheduler.cancelTask(args.taskId);
            toolOutput = cancelRes.message;
          } else if (tool === 'execute_multitask_parallel') {
            const multiRes = await multitaskOrchestrator.executeParallelTasks(args.tasks || [], async (subTool, subArgs) => {
              if (subTool === 'search_web') return await searchWeb(subArgs.query || '');
              if (subTool === 'scrape_web_page') return await fetchUrlContent(subArgs.url);
              if (subTool === 'generate_image') return (await generateAiImage(subArgs.prompt)).imageUrl;
              if (subTool === 'analyze_youtube_video') return await analyzeYouTubeVideo(subArgs.url);
              return await callWorkspaceTool(subTool, subArgs);
            });
            toolOutput = `⚡ Đã hoàn thành đồng thời ${multiRes.taskCount} tác vụ song song:\n` + multiRes.results.map(r => `🔹 [${r.title}]: ${typeof r.result === 'string' ? r.result.slice(0, 300) : JSON.stringify(r.result || r.error)}`).join('\n\n');
          } else if (tool === 'read_image_from_url') {
            const imgData = await visionIntelligence.fetchImageAsBase64(args.url);
            const visionAnalysis = await generateContentWithFailover([
              { text: "Hãy quan sát thật tỉ mỉ bức ảnh này: đọc toàn bộ chữ viết (OCR), phân tích sự vật, con người, tình huống và đúc kết câu trả lời chính xác:" },
              visionIntelligence.createImagePart(imgData.mimeType, imgData.data)
            ]);
            toolOutput = visionAnalysis.text;
          } else if (tool === 'analyze_youtube_video') {
            toolOutput = await analyzeYouTubeVideo(args.url || userPrompt);
          } else if (tool === 'setup_mcp_connection') {
            const provisionRes = await mcpAutoProvisioner.provisionMcp(args.appName, args.credentials || {});
            toolOutput = provisionRes.message;
          } else if (tool === 'call_dynamic_mcp') {
            const { tasks } = args;
            const results = await multitaskOrchestrator.executeParallel(
              tasks,
              (prompt) => processUserRequest(prompt, senderName, chatId)
            );
            toolOutput = `Kết quả xử lý đa tác vụ song song:\n${JSON.stringify(results, null, 2)}`;
          } else if (tool === 'synthesize_speech') {
            const textToSpeak = args.text || responseText.replace(/\{[\s\S]*?\}/g, '').trim();
            const voiceRes = await voiceIntelligence.generateVietnameseSpeech(textToSpeak);
            if (voiceRes.success) {
              generatedMediaResult = { type: 'voice', filePath: voiceRes.filePath };
              toolOutput = `Đã tạo file giọng nói tiếng Việt thành công tại ${voiceRes.filePath}.`;
            } else {
              toolOutput = `Lỗi tạo giọng nói: ${voiceRes.error}`;
            }
          } else if (tool === 'manage_email') {
            toolOutput = await googleWorkspace.listEmails(args.query || '');
          } else if (tool === 'manage_calendar') {
            toolOutput = await googleWorkspace.listCalendarEvents();
          } else if (tool === 'manage_drive') {
            toolOutput = await googleWorkspace.searchDriveFiles(args.query || '');
          } else if (tool === 'manage_docs') {
            toolOutput = await googleWorkspace.createGoogleDoc(args.title || 'Tài liệu mới từ Zalo AI');
          } else if (tool === 'manage_sheets') {
            toolOutput = await googleWorkspace.createGoogleSheet(args.title || 'Bảng tính mới từ Zalo AI');
          } else if (tool === 'generate_excel_file') {
            const excelRes = excelGenerator.generateExcelFile(args.fileName, args.sheetName || 'Báo Cáo', args.dataRows || []);
            if (excelRes.success) {
              generatedMediaResult = { type: 'file', filePath: excelRes.filePath };
              toolOutput = excelRes.message;
            } else {
              toolOutput = excelRes.message;
            }
          } else if (tool === 'get_financial_market_data') {
            toolOutput = await getFinancialMarketData(args.symbol || 'BTC');
          } else if (tool === 'extract_document_text') {
            const docRes = await documentIntelligence.extractTextFromFile(args.filePath);
            toolOutput = docRes.success ? `Đã đọc tệp ${docRes.fileName} (${docRes.sizeKb}KB):\n\n${docRes.text}` : `Lỗi đọc tệp: ${docRes.error}`;
          } else if (tool === 'execute_code_sandbox') {
            const sandRes = await codeSandbox.executeCode(args.language || 'javascript', args.code || '');
            toolOutput = sandRes.success ? `Kết quả thực thi ${sandRes.language}:\n${sandRes.stdout || '(Thực thi thành công, không có output ra màn hình)'}` : `Lỗi thực thi code: ${sandRes.error}\n${sandRes.stderr}`;
          } else if (tool === 'translate_and_localize') {
            const transRes = await translationEngine.translateText(args.text, args.targetLang || 'tiếng Việt', args.tone || 'chuyên nghiệp');
            toolOutput = transRes.success ? `Bản dịch (${transRes.targetLang}):\n\n${transRes.translatedText}` : `Lỗi dịch thuật: ${transRes.error}`;
          } else if (tool === 'capture_web_page') {
            const capRes = await webArchiver.captureWebPage(args.url);
            if (capRes.success) {
              generatedMediaResult = { type: 'image', filePath: capRes.filePath };
              toolOutput = capRes.message;
            } else {
              toolOutput = `Lỗi chụp ảnh web: ${capRes.error}`;
            }
          } else if (tool === 'generate_qr_code') {
            if (args.type === 'vietqr' || args.bankCode || args.accountNumber) {
              const vqr = qrIntelligence.generateVietQr(args.bankCode, args.accountNumber, args.amount, args.memo, args.accountName);
              toolOutput = vqr.message;
            } else {
              const qrRes = await qrIntelligence.generateQrCode(args.content || userPrompt);
              if (qrRes.success) {
                generatedMediaResult = { type: 'image', filePath: qrRes.filePath };
                toolOutput = qrRes.message;
              } else {
                toolOutput = `Lỗi tạo mã QR: ${qrRes.error}`;
              }
            }
          } else if (tool === 'get_weather_forecast') {
            toolOutput = await weatherIntelligence.getWeather(args.cityName || 'Hà Nội');
          } else if (tool === 'format_meeting_minutes') {
            const meetRes = await meetingIntelligence.formatMeetingMinutes(args.rawNotes || userPrompt, args.meetingTitle || 'Biên Bản Cuộc Họp');
            toolOutput = meetRes.success ? meetRes.minutes : `Lỗi tổng hợp biên bản: ${meetRes.error}`;
          } else if (tool === 'review_business_contract') {
            const revRes = await contractReviewEngine.reviewContract(args.contractText || userPrompt, args.contractType || 'Hợp Đồng Kinh Tế');
            toolOutput = revRes.success ? revRes.report : `Lỗi rà soát hợp đồng: ${revRes.error}`;
          } else if (tool === 'draft_executive_email') {
            const mailRes = await emailComposer.composeEmail(args.goal || userPrompt, args.recipientRole || 'Đối tác', args.tone || 'trang trọng và ngoại giao', args.keyPoints || []);
            toolOutput = mailRes.success ? mailRes.email : `Lỗi soạn email: ${mailRes.error}`;
          } else if (tool === 'analyze_financial_statement') {
            const kpiRes = await kpiFinancialAnalyzer.analyzeFinancialData(args.financialDataText || userPrompt, args.companyType || 'Doanh nghiệp thương mại');
            toolOutput = kpiRes.success ? kpiRes.report : `Lỗi phân tích tài chính: ${kpiRes.error}`;
          } else if (tool === 'analyze_competitor_market') {
            const compRes = await competitorIntelligence.analyzeCompetitor(args.competitorName || userPrompt, args.industry || 'Công nghệ / Dịch vụ', args.focusArea || 'Sản phẩm & Giá cả');
            toolOutput = compRes.success ? compRes.report : `Lỗi phân tích đối thủ: ${compRes.error}`;
          } else if (tool === 'plan_project_wbs') {
            const planRes = await projectPlanner.generateProjectPlan(args.projectGoal || userPrompt, args.durationWeeks || 4, args.teamSize || 3);
            toolOutput = planRes.success ? planRes.plan : `Lỗi lập kế hoạch dự án: ${planRes.error}`;
          } else if (tool === 'generate_marketing_campaign') {
            const mktRes = await marketingStrategy.generateCampaign(args.productOrService || userPrompt, args.targetMarket || 'Việt Nam', args.budgetOrScale || 'Vừa & Nhỏ');
            toolOutput = mktRes.success ? mktRes.campaign : `Lỗi lập chiến dịch marketing: ${mktRes.error}`;
          } else if (tool === 'handle_crisis_escalation') {
            const criRes = await crisisResponseEngine.handleCrisis(args.complaintDetails || userPrompt, args.severity || 'Cao', args.customerTier || 'Khách hàng VIP');
            toolOutput = criRes.success ? criRes.plan : `Lỗi xử lý sự cố: ${criRes.error}`;
          } else if (tool === 'evaluate_candidate_interview') {
            const hrRes = await hrInterviewEngine.evaluateCandidate(args.candidateInfo || userPrompt, args.jobPosition || 'Vị trí chuyên môn', args.interviewNotes || '');
            toolOutput = hrRes.success ? hrRes.scorecard : `Lỗi đánh giá ứng viên: ${hrRes.error}`;
          } else if (tool === 'handle_sales_objection') {
            const slsRes = await salesObjectionMaster.generateSalesScript(args.productOrService || userPrompt, args.customerObjection || 'Giá đắt quá so với thị trường', args.clientType || 'Khách hàng B2B');
            toolOutput = slsRes.success ? slsRes.script : `Lỗi tạo kịch bản bán hàng: ${slsRes.error}`;
          } else if (tool === 'generate_presentation_deck') {
            const prsRes = await presentationOutline.generatePresentation(args.topic || userPrompt, args.targetAudience || 'Ban Giám Đốc', args.slideCount || 6);
            toolOutput = prsRes.success ? prsRes.deck : `Lỗi tạo dàn ý slide: ${prsRes.error}`;
          } else if (tool === 'draft_press_release') {
            const prRes = await pressReleaseEngine.generatePressRelease(args.eventOrNews || userPrompt, args.companyName || 'Doanh nghiệp', args.keyQuoteSpeaker || 'Tổng Giám Đốc');
            toolOutput = prRes.success ? prRes.pressRelease : `Lỗi soạn thông cáo báo chí: ${prRes.error}`;
          } else if (tool === 'assess_business_risk') {
            const rskRes = await riskManagement.generateRiskMatrix(args.businessContext || userPrompt, args.riskCategory || 'Toàn diện');
            toolOutput = rskRes.success ? rskRes.report : `Lỗi đánh giá rủi ro: ${rskRes.error}`;
          } else if (tool === 'generate_daily_briefing') {
            const brfRes = await dailyBriefingEngine.generateBriefing(args.location || 'Hà Nội', args.scheduleNotes || '', args.unreadTasks || userPrompt);
            toolOutput = brfRes.success ? brfRes.briefing : `Lỗi tạo bản tin đầu ngày: ${brfRes.error}`;
          } else if (tool === 'generate_business_sop') {
            const sopRes = await sopGenerator.generateSop(args.processTitle || userPrompt, args.department || 'Vận hành', args.scope || 'Toàn công ty');
            toolOutput = sopRes.success ? sopRes.sop : `Lỗi tạo quy trình SOP: ${sopRes.error}`;
          } else if (tool === 'validate_business_model') {
            const bmcRes = await businessModelCanvas.validateBusinessModel(args.businessIdea || userPrompt, args.targetMarket || 'Việt Nam', args.pricingModel || 'Subscription / Bán lẻ');
            toolOutput = bmcRes.success ? bmcRes.analysis : `Lỗi thẩm định mô hình kinh doanh: ${bmcRes.error}`;
          } else if (tool === 'align_okr_framework') {
            const okrRes = await okrAlignmentEngine.generateOkrFramework(args.strategicGoal || userPrompt, args.department || 'Toàn công ty', args.timeHorizon || 'Quý tiếp theo');
            toolOutput = okrRes.success ? okrRes.framework : `Lỗi thiết lập OKR: ${okrRes.error}`;
          } else if (tool === 'repurpose_social_content') {
            const repRes = await contentRepurposing.repurposeContent(args.originalContent || userPrompt, args.primaryGoal || 'Thu hút khách hàng');
            toolOutput = repRes.success ? repRes.content : `Lỗi chuyển đổi nội dung: ${repRes.error}`;
          } else if (tool === 'estimate_business_valuation') {
            const valRes = await valuationModeling.estimateValuation(args.financialProfile || userPrompt, args.stage || 'Tăng trưởng', args.industry || 'Công nghệ');
            toolOutput = valRes.success ? valRes.report : `Lỗi định giá doanh nghiệp: ${valRes.error}`;
          } else if (tool === 'optimize_pricing_strategy') {
            const prcRes = await pricingOptimizer.optimizePricing(args.productInfo || userPrompt, args.targetSegment || 'Khách hàng cá nhân / Doanh nghiệp', args.costOrMarginGoal || 'Tối đa hóa biên lợi nhuận');
            toolOutput = prcRes.success ? prcRes.report : `Lỗi định giá sản phẩm: ${prcRes.error}`;
          } else if (tool === 'evaluate_vendor_procurement') {
            const vdrRes = await vendorProcurement.evaluateVendors(args.procurementRequirement || userPrompt, args.vendorBidsText || '', args.budgetOrConstraints || 'Tối ưu chi phí');
            toolOutput = vdrRes.success ? vdrRes.report : `Lỗi đánh giá nhà thầu: ${vdrRes.error}`;
          } else if (tool === 'prevent_customer_churn') {
            const retRes = await customerRetention.generateRetentionPlaybook(args.churnSignals || userPrompt, args.customerTier || 'Doanh nghiệp / VIP', args.productType || 'SaaS / Dịch vụ');
            toolOutput = retRes.success ? retRes.playbook : `Lỗi lập kịch bản giữ chân khách hàng: ${retRes.error}`;
          } else if (tool === 'plan_org_restructuring') {
            const rstRes = await orgRestructuring.planRestructuring(args.orgContext || userPrompt, args.targetGoal || 'Tinh gọn bộ máy & Giảm chi phí', args.timeline || '90 ngày');
            toolOutput = rstRes.success ? rstRes.plan : `Lỗi lập kế hoạch tái cấu trúc: ${rstRes.error}`;
          } else if (tool === 'stress_test_cash_runway') {
            const cshRes = await cashFlowRunway.stressTestRunway(args.cashContext || userPrompt, args.currentCash || 'Tiền mặt khả dụng', args.monthlyBurnRate || 'Chi phí đốt tiền/tháng');
            toolOutput = cshRes.success ? cshRes.report : `Lỗi thử tải dòng tiền: ${cshRes.error}`;
          } else if (tool === 'conduct_mna_due_diligence') {
            const mnaRes = await mnaDueDiligence.conductDueDiligence(args.targetCompanyInfo || userPrompt, args.dealType || 'Mua lại cổ phần chi phối', args.strategicGoal || 'Mở rộng thị phần');
            toolOutput = mnaRes.success ? mnaRes.report : `Lỗi thẩm định M&A: ${mnaRes.error}`;
          } else if (tool === 'simulate_cap_table') {
            const capRes = await capTableEngine.simulateCapTable(args.equityContext || userPrompt, args.fundingRound || 'Series Seed/A', args.investmentAmount || 'Số tiền gọi vốn', args.preMoneyValuation || 'Định giá Pre-money');
            toolOutput = capRes.success ? capRes.report : `Lỗi mô phỏng Cap Table: ${capRes.error}`;
          } else if (tool === 'draft_board_resolution') {
            const brdRes = await boardResolution.draftResolution(args.resolutionMatter || userPrompt, args.companyName || 'Công Ty Cổ Phần', args.meetingType || 'Hội Đồng Quản Trị');
            toolOutput = brdRes.success ? brdRes.document : `Lỗi soạn nghị quyết HĐQT: ${brdRes.error}`;
          } else if (tool === 'generate_franchise_playbook') {
            const frnRes = await franchisePlaybook.generateFranchisePlaybook(args.businessModel || userPrompt, args.targetLocations || 'Toàn quốc', args.feeStructure || 'Phí ban đầu + Royalty');
            toolOutput = frnRes.success ? frnRes.playbook : `Lỗi đóng gói nhượng quyền: ${frnRes.error}`;
          } else if (tool === 'design_esop_plan') {
            const espRes = await esopIncentive.designEsopPlan(args.companyStage || userPrompt, args.esopPoolSize || '10% vốn điều lệ', args.vestingSchedule || '4 năm');
            toolOutput = espRes.success ? espRes.report : `Lỗi thiết kế ESOP: ${espRes.error}`;
          } else if (tool === 'handle_pr_media_crisis') {
            const prcRes = await prCrisisEngine.handlePrCrisis(args.crisisDetails || userPrompt, args.companyName || 'Doanh nghiệp', args.severity || 'Khẩn cấp');
            toolOutput = prcRes.success ? prcRes.report : `Lỗi xử lý khủng hoảng PR: ${prcRes.error}`;
          } else if (tool === 'optimize_corporate_tax') {
            const taxRes = await taxOptimization.optimizeTaxPlan(args.businessProfile || userPrompt, args.annualRevenueOrProfit || 'Doanh thu trung bình', args.industry || 'Thương mại / Dịch vụ');
            toolOutput = taxRes.success ? taxRes.report : `Lỗi tối ưu thuế doanh nghiệp: ${taxRes.error}`;
          } else if (tool === 'protect_intellectual_property') {
            const ipRes = await ipProtection.protectIntellectualProperty(args.assetDescription || userPrompt, args.ipType || 'Nhãn hiệu / Bản quyền', args.targetMarket || 'Việt Nam & Quốc tế');
            toolOutput = ipRes.success ? ipRes.report : `Lỗi bảo hộ SHTT: ${ipRes.error}`;
          } else if (tool === 'audit_cybersecurity_compliance') {
            const secRes = await cybersecurityCompliance.auditCybersecurity(args.techStackOrSystem || userPrompt, args.dataTypes || 'Dữ liệu khách hàng', args.complianceTarget || 'Nghị định 13/2023/NĐ-CP & ISO 27001');
            toolOutput = secRes.success ? secRes.report : `Lỗi đánh giá an ninh mạng: ${secRes.error}`;
          } else if (tool === 'audit_esg_carbon_roadmap') {
            const esgRes = await esgSustainability.auditEsgAndCarbon(args.businessProfile || userPrompt, args.exportMarket || 'Quốc tế / EU', args.industry || 'Sản xuất / Dịch vụ');
            toolOutput = esgRes.success ? esgRes.report : `Lỗi thẩm định ESG: ${esgRes.error}`;
          } else if (tool === 'plan_ai_automation') {
            const aiaRes = await aiAutomation.planAiAutomation(args.businessWorkflow || userPrompt, args.companyScale || 'Doanh nghiệp SMB', args.budgetOrTimeframe || '3-6 tháng');
            toolOutput = aiaRes.success ? aiaRes.report : `Lỗi lập lộ trình AI: ${aiaRes.error}`;
          } else if (tool === 'plan_global_market_entry') {
            const mktRes = await marketEntry.planMarketEntry(args.productService || userPrompt, args.targetCountry || 'Đông Nam Á / Mỹ', args.entryMode || 'Thương mại điện tử xuyên biên giới');
            toolOutput = mktRes.success ? mktRes.report : `Lỗi lập chiến lược thị trường quốc tế: ${mktRes.error}`;
          } else if (tool === 'evaluate_strategic_decision_matrix') {
            const decRes = await decisionMatrix.evaluateStrategicDecision(args.decisionProblem || userPrompt, args.optionsText || 'Phương án A vs Phương án B', args.evaluationCriteria || 'Chiến lược, Tài chính, Rủi ro, Thời gian');
            toolOutput = decRes.success ? decRes.report : `Lỗi đánh giá quyết định chiến lược: ${decRes.error}`;
          } else if (tool === 'resolve_contract_dispute') {
            const dspRes = await disputeResolution.resolveContractDispute(args.disputeDetails || userPrompt, args.contractType || 'Hợp đồng thương mại', args.claimAmount || 'Giá trị tranh chấp');
            toolOutput = dspRes.success ? dspRes.report : `Lỗi xử lý tranh chấp hợp đồng: ${dspRes.error}`;
          } else if (tool === 'optimize_revenue_funnel') {
            const fnlRes = await funnelOptimization.optimizeFunnel(args.funnelData || userPrompt, args.businessModel || 'B2B/B2C', args.trafficSource || 'Đa kênh');
            toolOutput = fnlRes.success ? fnlRes.report : `Lỗi tối ưu phễu doanh thu: ${fnlRes.error}`;
          } else if (tool === 'hedge_fx_treasury_risk') {
            const fxRes = await fxTreasury.hedgeFxAndTreasury(args.treasuryContext || userPrompt, args.currencyPair || 'USD/VND', args.transactionVolume || 'Dòng tiền xuất nhập khẩu');
            toolOutput = fxRes.success ? fxRes.report : `Lỗi quản trị tỷ giá FX: ${fxRes.error}`;
          } else if (tool === 'conduct_agile_kaizen') {
            const aglRes = await agileKaizen.conductRetrospective(args.sprintContext || userPrompt, args.teamType || 'Đội ngũ dự án', args.retrospectiveFramework || '4Ls & 5 Whys');
            toolOutput = aglRes.success ? aglRes.report : `Lỗi tổng kết Agile Kaizen: ${aglRes.error}`;
          } else if (tool === 'design_channel_partner_program') {
            const prtRes = await channelPartner.designPartnerProgram(args.productService || userPrompt, args.targetPartnerType || 'Đại lý phân phối B2B', args.discountStructure || 'Chiết khấu 3 cấp');
            toolOutput = prtRes.success ? prtRes.report : `Lỗi xây dựng chính sách đại lý: ${prtRes.error}`;
          } else if (tool === 'plan_post_merger_integration') {
            const pmiRes = await pmiIntegration.planPostMergerIntegration(args.dealContext || userPrompt, args.acquirerTargetNames || 'Bên mua vs Bên bán', args.integrationScope || 'Toàn diện');
            toolOutput = pmiRes.success ? pmiRes.report : `Lỗi kế hoạch tích hợp sau M&A: ${pmiRes.error}`;
          } else if (tool === 'optimize_capital_allocation') {
            const caRes = await capitalAllocation.optimizeCapitalAllocation(args.investmentContext || userPrompt, args.discountRate || '10% WACC', args.initialCapex || 'Vốn đầu tư ban đầu', args.expectedCashFlows || 'Dòng tiền 3-5 năm');
            toolOutput = caRes.success ? caRes.report : `Lỗi thẩm định vốn đầu tư: ${caRes.error}`;
          } else if (tool === 'optimize_supply_chain_resilience') {
            const scRes = await supplyChainResilience.auditSupplyChain(args.supplyChainContext || userPrompt, args.criticalMaterials || 'Vật tư cốt lõi', args.supplierCountry || 'Việt Nam & Quốc tế');
            toolOutput = scRes.success ? scRes.report : `Lỗi quản trị chuỗi cung ứng: ${scRes.error}`;
          } else if (tool === 'audit_customer_success') {
            const csRes = await customerSuccess.auditCustomerSuccess(args.accountData || userPrompt, args.tierLevel || 'Khách hàng Enterprise', args.contractValue || 'Giá trị hợp đồng');
            toolOutput = csRes.success ? csRes.report : `Lỗi quản trị thành công khách hàng: ${csRes.error}`;
          } else if (tool === 'generate_investment_memo') {
            const imRes = await investmentMemo.generateInvestmentMemo(args.companyData || userPrompt, args.fundingGoal || 'Gọi vốn đầu tư', args.investorTarget || 'Quỹ VC/PE');
            toolOutput = imRes.success ? imRes.report : `Lỗi soạn thảo bản chào đầu tư: ${imRes.error}`;
          } else if (tool === 'plan_business_continuity_drp') {
            const bcpRes = await bcpDisasterRecovery.planBusinessContinuity(args.businessContext || userPrompt, args.criticalOperations || 'Hạ tầng và hoạt động cốt lõi', args.disasterScenario || 'Thảm họa gián đoạn vận hành');
            toolOutput = bcpRes.success ? bcpRes.report : `Lỗi lập kế hoạch BCP/DRP: ${bcpRes.error}`;
          } else if (tool === 'design_3p_compensation') {
            const cbRes = await compensationBenefits.designCompensationScheme(args.jobRoles || userPrompt, args.companyStage || 'Scale-up', args.budgetConstraint || 'P50-P75 thị trường');
            toolOutput = cbRes.success ? cbRes.report : `Lỗi thiết kế lương thưởng 3P: ${cbRes.error}`;
          } else if (tool === 'audit_saas_metrics') {
            const saasRes = await saasMetrics.auditSaasMetrics(args.saasFinancialData || userPrompt, args.targetStage || 'Scale-up', args.benchmarkComparison || 'B2B SaaS Benchmark');
            toolOutput = saasRes.success ? saasRes.report : `Lỗi thẩm định chỉ số SaaS: ${saasRes.error}`;
          } else if (tool === 'develop_brand_positioning') {
            const brnRes = await brandPositioning.developBrandPositioning(args.brandContext || userPrompt, args.targetAudience || 'Khách hàng mục tiêu', args.competitorLandscape || 'Thị trường cạnh tranh');
            toolOutput = brnRes.success ? brnRes.report : `Lỗi định vị thương hiệu: ${brnRes.error}`;
          } else if (tool === 'audit_regulatory_compliance') {
            const regRes = await regulatoryCompliance.auditRegulatoryCompliance(args.businessContext || userPrompt, args.industrySector || 'Đa ngành nghề', args.jurisdiction || 'Việt Nam & Quốc tế');
            toolOutput = regRes.success ? regRes.report : `Lỗi rà soát rủi ro pháp lý: ${regRes.error}`;
          } else if (tool === 'plan_change_management') {
            const chgRes = await changeManagement.planChangeManagement(args.changeContext || userPrompt, args.scopeOfChange || 'Chuyển đổi số & Vận hành', args.affectedStakeholders || 'Toàn thể nhân sự');
            toolOutput = chgRes.success ? chgRes.report : `Lỗi quản trị chuyển đổi: ${chgRes.error}`;
          } else if (tool === 'structure_advisory_board') {
            const advRes = await advisoryBoard.structureAdvisoryBoard(args.companyContext || userPrompt, args.strategicPriorities || 'Chiến lược toàn diện', args.compensationModel || 'FAST Agreement');
            toolOutput = advRes.success ? advRes.report : `Lỗi xây dựng hội đồng cố vấn: ${advRes.error}`;
          } else if (tool === 'optimize_dynamic_pricing') {
            const dprRes = await dynamicPricing.optimizeDynamicPricing(args.productContext || userPrompt, args.targetMarket || 'Toàn thị trường', args.pricingModelType || 'Mô hình lai kết hợp');
            toolOutput = dprRes.success ? dprRes.report : `Lỗi tối ưu hóa giá: ${dprRes.error}`;
          } else if (tool === 'structure_mna_tax_deal') {
            const mnaRes = await mnaTaxStructuring.structureMnaTaxDeal(args.dealContext || userPrompt, args.dealType || 'Stock Purchase vs Asset Acquisition', args.transactionSize || 'Middle-Market');
            toolOutput = mnaRes.success ? mnaRes.report : `Lỗi cấu trúc thương vụ M&A: ${mnaRes.error}`;
          } else if (tool === 'plan_executive_succession') {
            const succRes = await successionPlanning.planExecutiveSuccession(args.companyContext || userPrompt, args.criticalRoles || 'Ban Điều Hành C-Level', args.timeHorizon || '1 - 3 năm');
            toolOutput = succRes.success ? succRes.report : `Lỗi lập kế hoạch kế vị: ${succRes.error}`;
          } else if (tool === 'audit_third_party_cyber_risk') {
            const tpcRes = await thirdPartyCyberRisk.auditThirdPartyCyberRisk(args.vendorData || userPrompt, args.serviceCriticality || 'Dịch vụ đám mây & Lưu trữ cốt lõi', args.complianceStandard || 'ISO 27001 & NIST CSF');
            toolOutput = tpcRes.success ? tpcRes.report : `Lỗi thẩm định an ninh mạng đối tác: ${tpcRes.error}`;
          } else if (tool === 'design_vc_pitch_deck') {
            const deckRes = await pitchDeck.designPitchDeck(args.ventureData || userPrompt, args.fundingRound || 'Series A', args.targetAsk || 'Gọi vốn mở rộng');
            toolOutput = deckRes.success ? deckRes.report : `Lỗi soạn thảo Pitch Deck: ${deckRes.error}`;
          } else if (tool === 'structure_white_label_deal') {
            const wlRes = await whiteLabel.structureWhiteLabelDeal(args.softwareContext || userPrompt, args.partnerProfile || 'Đối tác phân phối quốc tế', args.licensingModel || 'Cấp phép trọn gói kết hợp Royalty');
            toolOutput = wlRes.success ? wlRes.report : `Lỗi cấu trúc nhãn trắng: ${wlRes.error}`;
          } else if (tool === 'audit_ai_governance') {
            const aivRes = await aiGovernance.auditAiGovernance(args.aiSystemContext || userPrompt, args.riskTier || 'Mô hình AI đa dụng', args.deploymentScale || 'Toàn doanh nghiệp');
            toolOutput = aivRes.success ? aivRes.report : `Lỗi quản trị AI: ${aivRes.error}`;
          } else if (tool === 'accelerate_customer_onboarding') {
            const ttvRes = await onboardingTtv.accelerateCustomerOnboarding(args.productContext || userPrompt, args.targetSegment || 'Khách hàng toàn diện', args.currentTtv || 'Rút ngắn TTV < 48 giờ');
            toolOutput = ttvRes.success ? ttvRes.report : `Lỗi tối ưu Onboarding: ${ttvRes.error}`;
          } else if (tool === 'design_api_economy') {
            const apiRes = await apiEconomy.designApiEconomy(args.apiContext || userPrompt, args.monetizationModel || 'Pay-as-you-go & Tiered Quota', args.developerTarget || 'Cộng đồng Lập trình viên & Doanh nghiệp ISV');
            toolOutput = apiRes.success ? apiRes.report : `Lỗi xây dựng kinh tế API: ${apiRes.error}`;
          } else if (tool === 'build_referral_flywheel') {
            const refRes = await referralFlywheel.buildReferralFlywheel(args.customerBaseContext || userPrompt, args.incentiveType || 'Thưởng 2 chiều', args.targetKFactor || 'K-Factor > 1.2x');
            toolOutput = refRes.success ? refRes.report : `Lỗi xây dựng bánh đà giới thiệu: ${refRes.error}`;
          } else if (tool === 'optimize_revops_compensation') {
            const rvpRes = await revopsCompensation.optimizeRevopsCompensation(args.salesContext || userPrompt, args.roleProfile || 'Đội ngũ AEs, SDRs & CSMs', args.quotaModel || 'Base/Variable 50/50 + Accelerators');
            toolOutput = rvpRes.success ? rvpRes.report : `Lỗi tối ưu RevOps: ${rvpRes.error}`;
          } else if (tool === 'optimize_working_capital') {
            const wcRes = await workingCapital.optimizeWorkingCapital(args.financialContext || userPrompt, args.currentCcc || 'Hiện trạng CCC', args.liquidityTarget || 'Tối ưu hóa thanh khoản');
            toolOutput = wcRes.success ? wcRes.report : `Lỗi tối ưu vốn lưu động: ${wcRes.error}`;
          } else if (tool === 'optimize_product_portfolio') {
            const pfRes = await productPortfolio.optimizeProductPortfolio(args.portfolioContext || userPrompt, args.allocationStrategy || 'Quy tắc 70/20/10', args.horizonYears || 'Lộ trình 3 năm');
            toolOutput = pfRes.success ? pfRes.report : `Lỗi quản trị danh mục sản phẩm: ${pfRes.error}`;
          } else if (tool === 'mitigate_cancel_culture_crisis') {
            const ccRes = await cancelCultureShield.mitigateCancelCultureCrisis(args.crisisContext || userPrompt, args.platformSpread || 'Mạng xã hội & Báo chí', args.severityLevel || 'Khẩn cấp Defcon 1');
            toolOutput = ccRes.success ? ccRes.report : `Lỗi dập tắt khủng hoảng: ${ccRes.error}`;
          } else if (tool === 'audit_cloud_finops') {
            const foRes = await cloudFinops.auditCloudFinops(args.cloudContext || userPrompt, args.currentSpend || 'Chi phí Cloud hiện tại', args.targetReduction || 'Cắt giảm lãng phí 30%');
            toolOutput = foRes.success ? foRes.report : `Lỗi kiểm toán FinOps: ${foRes.error}`;
          } else if (tool === 'structure_key_account_jbp') {
            const jbpRes = await keyAccountJbp.structureKeyAccountJbp(args.accountContext || userPrompt, args.contractValue || 'Khách hàng VIP Enterprise', args.renewalTimeline || 'Kỳ tái ký 180 ngày');
            toolOutput = jbpRes.success ? jbpRes.report : `Lỗi lập kế hoạch JBP: ${jbpRes.error}`;
          } else if (tool === 'audit_zero_trust_iam') {
            const iamRes = await zeroTrustIam.auditZeroTrustIam(args.iamContext || userPrompt, args.companyScale || 'Doanh nghiệp SMB', args.complianceTarget || 'SOC 2 & ISO 27001');
            toolOutput = iamRes.success ? iamRes.report : `Lỗi thẩm định Zero-Trust IAM: ${iamRes.error}`;
          } else if (tool === 'optimize_treasury_liquidity') {
            const trRes = await treasuryLiquidity.optimizeTreasuryLiquidity(args.treasuryContext || userPrompt, args.currentIdleCash || '10 - 100 Tỷ VNĐ', args.targetYieldStrategy || 'Bảo toàn vốn gốc');
            toolOutput = trRes.success ? trRes.report : `Lỗi tối ưu ngân khí: ${trRes.error}`;
          } else if (tool === 'monetize_patent_portfolio') {
            const ipRes = await patentMonetization.monetizePatentPortfolio(args.ipContext || userPrompt, args.monetizationGoal || 'Cấp phép bản quyền (Licensing)', args.industrySector || 'Công nghệ & Bán lẻ');
            toolOutput = ipRes.success ? ipRes.report : `Lỗi thương mại hóa sáng chế: ${ipRes.error}`;
          } else if (tool === 'structure_strategic_rfp') {
            const rfpRes = await strategicProcurement.structureStrategicRfp(args.procurementContext || userPrompt, args.procurementScale || 'Hợp đồng 500K$ - 5M$', args.evaluationCriteria || 'Kỹ thuật 40%, TCO 35%, SLA 25%');
            toolOutput = rfpRes.success ? rfpRes.report : `Lỗi lập hồ sơ đấu thầu: ${rfpRes.error}`;
          } else if (tool === 'call_dynamic_mcp') {
            const { serverName, toolName, mcpArgs } = args;
            toolOutput = await callDynamicMcpTool(serverName, toolName, mcpArgs);
          } else {
            // Forward to Workspace Tool fallback
            toolOutput = await callWorkspaceTool(tool, args);
          }

          agentEvents.emit('tool_result', { tool, resultPreview: toolOutput.slice(0, 120) });

          const isErrorOutput = toolOutput.startsWith('Lỗi') || 
                                toolOutput.includes('chưa được cấp quyền') || 
                                toolOutput.includes('hết hạn') || 
                                toolOutput.includes('revoked') || 
                                toolOutput.includes('expired') || 
                                toolOutput.includes('UNAUTHORIZED') ||
                                toolOutput.includes('401') ||
                                toolOutput.includes('403');

          conversation.push(`{"tool": "${tool}", "status": "${isErrorOutput ? 'failed' : 'executed'}"}`);
          
          if (isErrorOutput) {
            const remediationGuide = errorRemediation.formatRemediationPrompt(tool, toolOutput, userPrompt);
            conversation.push(`[KẾT QUẢ THỰC THI CÔNG CỤ ${tool}]:\n${toolOutput}\n\n${remediationGuide}`);
          } else {
            conversation.push(`[KẾT QUẢ THỰC THI CÔNG CỤ ${tool}]:\n${toolOutput}\n\n[CHỈ ĐẠO TRỰC DIỆN]: Trích xuất dữ liệu trọng tâm, trình bày rõ ràng, súc tích, giải quyết ngay nhu cầu của người dùng.`);
          }
        } catch (e) {
          agentEvents.emit('tool_error', { error: e.message });
          const remediationGuide = errorRemediation.formatRemediationPrompt(tool, e.message, userPrompt);
          conversation.push(`[LỖI THỰC THI CÔNG CỤ ${tool}]: ${e.message}.\n\n${remediationGuide}`);
        }
      } else {
        // Đã có câu trả lời tự nhiên từ AI
        let cleanResponse = responseText.replace(/\{[\s\S]*?"tool"[\s\S]*?\}/g, '').trim();
        cleanResponse = cognitiveReflection.sanitizeResponse(cleanResponse, senderName);

        if (cleanResponse) {
          memoryStore.addMessage(chatId, 'user', userPrompt);
          memoryStore.addMessage(chatId, 'assistant', cleanResponse);

          agentEvents.emit('ai_response', { responseText: cleanResponse, media: generatedMediaResult });
          triggerPostMessageLearning(chatId, senderName, userPrompt, cleanResponse).catch(() => {});

          return {
            text: cleanResponse,
            media: generatedMediaResult
          };
        }
      }
    }

    // Nếu sau các vòng lặp vẫn chưa có văn bản cuối, AI tự tổng hợp lại một lần cuối
    const finalCall = await generateContentWithFailover([
      { text: conversation.join('\n\n') + `\n\n[YÊU CẦU]: Hãy tự suy nghĩ và viết một phản hồi tự nhiên, chuẩn mực, đi thẳng vào giải pháp và hướng dẫn người dùng giải quyết vấn đề gửi tới ${senderName}. Tuyệt đối không dùng câu dập khuôn hay xin lỗi rỗng tuếch!` }
    ]);
    let finalHumanText = finalCall.text.replace(/\{[\s\S]*?"tool"[\s\S]*?\}/g, '').trim();
    finalHumanText = cognitiveReflection.sanitizeResponse(finalHumanText, senderName);

    memoryStore.addMessage(chatId, 'user', userPrompt);
    memoryStore.addMessage(chatId, 'assistant', finalHumanText);
    triggerPostMessageLearning(chatId, senderName, userPrompt, finalHumanText).catch(() => {});

    return {
      text: finalHumanText,
      media: generatedMediaResult
    };
  } catch (err) {
    agentEvents.emit('error', { error: err.message });
    const diag = errorRemediation.diagnoseError('Hệ thống', err.message, userPrompt);
    return {
      text: `⚠️ **Thông Báo Sự Cố:** ${diag.rootCause}\n\n🛠️ **Cách Khắc Phục:**\n${diag.steps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n👉 ${diag.quickAction}`,
      media: null
    };
  }
}

/**
 * Tự động phân tích và học hỏi ngay sau mỗi lần nhắn tin
 */
async function triggerPostMessageLearning(chatId, senderName, userPrompt, aiResponse) {
  try {
    // 1. Tự động cập nhật Đồ thị tri thức ngữ nghĩa (Graph Memory)
    graphMemory.autoExtractGraphMemory(senderName, userPrompt, aiResponse);

    // 2. Đánh giá chất lượng và ghi nhận tiến hóa tư duy
    const evalQuality = cognitiveReflection.evaluateQuality(aiResponse);
    cognitiveReflection.logEvolution({
      senderName,
      userPrompt,
      qualityScore: evalQuality.score,
      reason: evalQuality.reason
    });

    const prompt = `Bạn là Module Tự Phản Chiếu & Tinh Chỉnh Cảm Xúc của Trợ Lý AI.
Hội thoại vừa diễn ra:
Người dùng (${senderName}): "${userPrompt}"
Trợ lý phản hồi: "${aiResponse}"

Nhiệm vụ:
1. Người dùng có nhắc đến tên, cách xưng hô yêu thích, sở thích, tính cách hoặc phong cách làm việc nào không?
2. Rút ra 1 bài học ngắn gọn (1 câu) để lần sau trò chuyện với người này tự nhiên, thấu hiểu và tránh máy móc dập khuôn hơn.

Trả về DUY NHẤT một khối JSON:
{
  "preferredName": "tên_nếu_có_hoặc_null",
  "habit": "thói_quen_sở_thích_nếu_có_hoặc_null",
  "learnedNote": "bài_học_đúc_kết_để_nói_chuyện_có_hồn_hơn"
}`;

    const { text } = await generateContentWithFailover(prompt);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      memoryStore.updateUserProfile(chatId, {
        preferredName: parsed.preferredName !== 'null' ? parsed.preferredName : null,
        habits: parsed.habit && parsed.habit !== 'null' ? [parsed.habit] : [],
        learnedNote: parsed.learnedNote
      });
      agentEvents.emit('post_message_learned', { chatId, learned: parsed });
    }
  } catch (e) {
    // Non-blocking background learning error
  }
}
