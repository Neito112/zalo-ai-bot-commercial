import fs from 'fs';
import path from 'path';

const GRAPH_FILE = path.resolve('knowledge-graph.json');

export class GraphMemoryEngine {
  constructor() {
    this.nodes = new Map(); // id -> { id, label, type, properties, createdAt, updatedAt }
    this.edges = [];        // [ { from, to, relation, weight, timestamp } ]
    this.loadGraph();
  }

  loadGraph() {
    try {
      if (fs.existsSync(GRAPH_FILE)) {
        const raw = JSON.parse(fs.readFileSync(GRAPH_FILE, 'utf-8'));
        if (raw.nodes && Array.isArray(raw.nodes)) {
          raw.nodes.forEach(n => this.nodes.set(n.id, n));
        }
        if (raw.edges && Array.isArray(raw.edges)) {
          this.edges = raw.edges;
        }
        console.log(`🧠 [GRAPH MEMORY] Đã nạp ${this.nodes.size} nút thực thể và ${this.edges.length} liên kết quan hệ.`);
      }
    } catch (e) {
      console.warn('⚠️ Không thể đọc knowledge-graph.json, khởi tạo mới:', e.message);
    }
  }

  saveGraph() {
    try {
      const data = {
        updatedAt: new Date().toISOString(),
        nodes: Array.from(this.nodes.values()),
        edges: this.edges
      };
      fs.writeFileSync(GRAPH_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('❌ Lỗi lưu knowledge-graph.json:', e.message);
    }
  }

  /**
   * Thêm hoặc cập nhật một thực thể (Entity Node) vào đồ thị
   */
  upsertNode(id, type, properties = {}) {
    const cleanId = String(id).trim().toLowerCase();
    const existing = this.nodes.get(cleanId);

    if (existing) {
      existing.properties = { ...existing.properties, ...properties };
      existing.updatedAt = new Date().toISOString();
      this.nodes.set(cleanId, existing);
      return existing;
    }

    const node = {
      id: cleanId,
      label: id,
      type, // 'PERSON' | 'PREFERENCE' | 'PROJECT' | 'HABIT' | 'TOPIC' | 'SCHEDULE'
      properties,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.nodes.set(cleanId, node);
    this.saveGraph();
    return node;
  }

  /**
   * Tạo liên kết quan hệ giữa 2 thực thể (Edge)
   */
  addRelation(fromId, relation, toId, weight = 1.0) {
    const from = String(fromId).trim().toLowerCase();
    const to = String(toId).trim().toLowerCase();
    const rel = String(relation).trim().toUpperCase();

    // Đảm bảo cả 2 nút tồn tại
    if (!this.nodes.has(from)) this.upsertNode(fromId, 'CONCEPT');
    if (!this.nodes.has(to)) this.upsertNode(toId, 'CONCEPT');

    // Kiểm tra xem quan hệ đã tồn tại chưa
    const existingIndex = this.edges.findIndex(e => e.from === from && e.to === to && e.relation === rel);
    if (existingIndex >= 0) {
      this.edges[existingIndex].weight += 0.2;
      this.edges[existingIndex].timestamp = new Date().toISOString();
    } else {
      this.edges.push({
        from,
        to,
        relation: rel,
        weight,
        timestamp: new Date().toISOString()
      });
    }

    this.saveGraph();
    console.log(`🔗 [GRAPH RELATION] ${fromId} --[${rel}]--> ${toId}`);
  }

  /**
   * Truy vấn các thông tin và quan hệ liên quan đến một thực thể
   */
  queryEntityContext(entityId) {
    const cleanId = String(entityId).trim().toLowerCase();
    const node = this.nodes.get(cleanId);
    if (!node) return null;

    const outgoing = this.edges.filter(e => e.from === cleanId).map(e => {
      const targetNode = this.nodes.get(e.to);
      return { relation: e.relation, target: targetNode ? targetNode.label : e.to, properties: targetNode?.properties };
    });

    const incoming = this.edges.filter(e => e.to === cleanId).map(e => {
      const sourceNode = this.nodes.get(e.from);
      return { relation: e.relation, source: sourceNode ? sourceNode.label : e.from, properties: sourceNode?.properties };
    });

    return {
      entity: node,
      outgoing,
      incoming
    };
  }

  /**
   * Truy vấn đa chặng (Multi-Hop Reasoning) để tìm các liên kết bắc cầu sâu sắc
   */
  queryMultiHopContext(entityId, maxDepth = 2) {
    const cleanId = String(entityId).trim().toLowerCase();
    const visited = new Set([cleanId]);
    const hopChain = [];

    let currentLevel = [cleanId];
    for (let depth = 1; depth <= maxDepth; depth++) {
      const nextLevel = [];
      for (const curr of currentLevel) {
        const outgoing = this.edges.filter(e => e.from === curr && !visited.has(e.to));
        for (const edge of outgoing) {
          visited.add(edge.to);
          nextLevel.push(edge.to);
          const targetNode = this.nodes.get(edge.to);
          const sourceNode = this.nodes.get(edge.from);
          hopChain.push({
            depth,
            from: sourceNode ? sourceNode.label : edge.from,
            relation: edge.relation,
            to: targetNode ? targetNode.label : edge.to,
            targetType: targetNode?.type
          });
        }
      }
      currentLevel = nextLevel;
    }
    return hopChain;
  }

  /**
   * Tìm kiếm ngữ cảnh tri thức đồ thị đa chặng phù hợp với câu hỏi của người dùng
   */
  retrieveRelevantGraphContext(userPrompt) {
    const lowerPrompt = userPrompt.toLowerCase();
    const matchedNodes = [];

    for (const [id, node] of this.nodes.entries()) {
      if (lowerPrompt.includes(id) || (node.label && lowerPrompt.includes(node.label.toLowerCase()))) {
        matchedNodes.push(node);
      }
    }

    if (matchedNodes.length === 0) return '';

    let context = '\n[BỘ NHỚ ĐỒ THỊ NGỮ NGHĨA ĐA TẦNG (THREE-LAYER SEMANTIC GRAPH MEMORY)]:\n';
    matchedNodes.slice(0, 5).forEach(node => {
      const directCtx = this.queryEntityContext(node.id);
      const multiHop = this.queryMultiHopContext(node.id, 2);

      if (directCtx) {
        context += `🔹 Thực thể: "${node.label}" [${node.type}]\n`;
        directCtx.outgoing.forEach(rel => {
          context += `   ↳ [Quan hệ trực tiếp]: --[${rel.relation}]--> "${rel.target}"\n`;
        });
        multiHop.filter(h => h.depth > 1).slice(0, 3).forEach(hop => {
          context += `   ↳ [Liên kết bắc cầu Tầng 2]: "${hop.from}" --[${hop.relation}]--> "${hop.to}" (${hop.targetType || 'INFO'})\n`;
        });
      }
    });

    return context + '\n';
  }

  /**
   * Tự động trích xuất thực thể và liên kết từ hội thoại
   */
  autoExtractGraphMemory(senderName, userPrompt, aiResponse) {
    try {
      const userNode = this.upsertNode(senderName, 'PERSON', { displayName: senderName });

      // Nhận diện sở thích / thói quen
      if (userPrompt.toLowerCase().includes('thích') || userPrompt.toLowerCase().includes('chuộng')) {
        const match = userPrompt.match(/thích\s+([^,.\n]+)/i);
        if (match && match[1]) {
          const pref = match[1].trim();
          this.upsertNode(pref, 'PREFERENCE');
          this.addRelation(senderName, 'THÍCH', pref);
        }
      }

      // Nhận diện dự án / công việc
      if (userPrompt.toLowerCase().includes('dự án') || userPrompt.toLowerCase().includes('bot')) {
        this.upsertNode('Zalo AI Bot Omnipotent', 'PROJECT', { status: 'R&D Continuous' });
        this.addRelation(senderName, 'QUẢN_LÝ_DỰ_ÁN', 'Zalo AI Bot Omnipotent');
      }

      // Nhận diện phong cách trò chuyện yêu thích
      if (userPrompt.toLowerCase().includes('tự nhiên') || userPrompt.toLowerCase().includes('không dập khuôn')) {
        this.upsertNode('Phong cách tự nhiên 100%', 'COMMUNICATION_STYLE', { rule: 'No template' });
        this.addRelation(senderName, 'YÊU_CẦU_PHONG_CÁCH', 'Phong cách tự nhiên 100%');
      }
    } catch (e) {
      console.error('Lỗi trích xuất đồ thị tri thức:', e.message);
    }
  }
}

export const graphMemory = new GraphMemoryEngine();
