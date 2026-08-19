import fs from 'fs';
import path from 'path';

/**
 * Động Cơ Truy Xuất Lai Ghép Hybrid RAG (BM25 + Semantic + Reciprocal Rank Fusion)
 * Giúp Bot tra cứu siêu tốc thông tin chính xác về mã số, sự kiện, email và tài liệu
 */
export class HybridRetrievalEngine {
  constructor() {
    this.documents = []; // [ { id, title, content, type, metadata } ]
    this.bm25Index = new Map(); // term -> { docId: termFrequency }
    this.docLengths = new Map(); // docId -> length
    this.avgDocLength = 0;
    this.k1 = 1.5; // BM25 parameter
    this.b = 0.75; // BM25 parameter
    this.rrfK = 60; // Reciprocal Rank Fusion parameter
  }

  tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s\u00C0-\u1EF9]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1);
  }

  addDocument(doc) {
    if (!doc || !doc.id || !doc.content) return;
    this.documents = this.documents.filter(d => d.id !== doc.id);
    this.documents.push(doc);
    this.rebuildIndex();
  }

  addDocumentsBatch(docs) {
    if (!Array.isArray(docs)) return;
    docs.forEach(d => {
      if (d && d.id && d.content) {
        this.documents = this.documents.filter(existing => existing.id !== d.id);
        this.documents.push(d);
      }
    });
    this.rebuildIndex();
  }

  rebuildIndex() {
    this.bm25Index.clear();
    this.docLengths.clear();

    let totalLength = 0;

    for (const doc of this.documents) {
      const fullText = `${doc.title || ''} ${doc.content || ''}`;
      const tokens = this.tokenize(fullText);
      const len = tokens.length;
      this.docLengths.set(doc.id, len);
      totalLength += len;

      const termFreq = new Map();
      for (const token of tokens) {
        termFreq.set(token, (termFreq.get(token) || 0) + 1);
      }

      for (const [term, freq] of termFreq.entries()) {
        if (!this.bm25Index.has(term)) {
          this.bm25Index.set(term, new Map());
        }
        this.bm25Index.get(term).set(doc.id, freq);
      }
    }

    this.avgDocLength = this.documents.length > 0 ? totalLength / this.documents.length : 0;
  }

  /**
   * Tính điểm BM25 cho truy vấn
   */
  bm25Search(query, topK = 10) {
    const tokens = this.tokenize(query);
    const scores = new Map();
    const N = this.documents.length;
    if (N === 0 || tokens.length === 0) return [];

    for (const token of tokens) {
      const posting = this.bm25Index.get(token);
      if (!posting) continue;

      const df = posting.size;
      const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));

      for (const [docId, tf] of posting.entries()) {
        const docLen = this.docLengths.get(docId) || this.avgDocLength;
        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / (this.avgDocLength || 1)));
        const termScore = idf * (numerator / denominator);

        scores.set(docId, (scores.get(docId) || 0) + termScore);
      }
    }

    return Array.from(scores.entries())
      .map(([docId, score]) => ({ doc: this.documents.find(d => d.id === docId), score }))
      .filter(item => item.doc)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  /**
   * Tính điểm tương đồng ngữ nghĩa (Dense Semantic Similarity)
   */
  denseSemanticSearch(query, topK = 10) {
    const queryTokens = new Set(this.tokenize(query));
    if (queryTokens.size === 0) return [];

    const results = [];
    for (const doc of this.documents) {
      const docTokens = new Set(this.tokenize(`${doc.title || ''} ${doc.content || ''}`));
      let intersection = 0;
      for (const t of queryTokens) {
        if (docTokens.has(t)) intersection++;
      }
      const union = new Set([...queryTokens, ...docTokens]).size;
      const jaccardScore = union > 0 ? intersection / union : 0;

      if (jaccardScore > 0) {
        results.push({ doc, score: jaccardScore });
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, topK);
  }

  /**
   * Kết hợp kết quả bằng Reciprocal Rank Fusion (RRF)
   */
  hybridSearch(query, topK = 5) {
    const bm25Results = this.bm25Search(query, topK * 2);
    const denseResults = this.denseSemanticSearch(query, topK * 2);

    const rrfScores = new Map();

    // RRF từ BM25
    bm25Results.forEach((res, rank) => {
      const rrf = 1.0 / (this.rrfK + (rank + 1));
      rrfScores.set(res.doc.id, (rrfScores.get(res.doc.id) || 0) + rrf);
    });

    // RRF từ Dense Semantic
    denseResults.forEach((res, rank) => {
      const rrf = 1.0 / (this.rrfK + (rank + 1));
      rrfScores.set(res.doc.id, (rrfScores.get(res.doc.id) || 0) + rrf);
    });

    const sortedDocIds = Array.from(rrfScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topK);

    return sortedDocIds.map(([docId, rrfScore]) => ({
      document: this.documents.find(d => d.id === docId),
      rrfScore: parseFloat(rrfScore.toFixed(6))
    })).filter(r => r.document);
  }
}

export const hybridRetriever = new HybridRetrievalEngine();
