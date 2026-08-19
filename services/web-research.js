import http from 'http';
import https from 'https';
import { URL } from 'url';

/**
 * Clean HTML to readable plain text
 */
function cleanHtml(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, '')
    .replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, '')
    .replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Search Wikipedia API directly for factual summaries
 */
export async function searchWikipedia(query) {
  return new Promise((resolve) => {
    try {
      const encoded = encodeURIComponent(query);
      const url = `https://vi.wikipedia.org/api/rest_v1/page/summary/${encoded}`;

      https.get(url, {
        headers: { 'User-Agent': 'ZaloAiBot/1.0 (contact@homie.ai)' },
        timeout: 6000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (json.extract) {
              return resolve(`📚 **Wikipedia (${json.title}):**\n${json.extract}\n🔗 ${json.content_urls?.desktop?.page || ''}`);
            }
          } catch (e) {}
          resolve(null);
        });
      }).on('error', () => resolve(null));
    } catch (e) {
      resolve(null);
    }
  });
}

/**
 * Fetch a URL text content safely
 */
export async function fetchUrlContent(targetUrl, maxLength = 5000) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(targetUrl);
      const client = parsed.protocol === 'https:' ? https : http;
      
      const req = client.get(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        timeout: 10000
      }, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchUrlContent(res.headers.location, maxLength));
        }

        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
          if (data.length > 300000) {
            req.destroy();
          }
        });

        res.on('end', () => {
          const cleaned = cleanHtml(data);
          resolve(cleaned.slice(0, maxLength));
        });
      });

      req.on('error', (e) => resolve(`Lỗi truy cập URL: ${e.message}`));
      req.on('timeout', () => {
        req.destroy();
        resolve('Hết thời gian tải trang (Timeout)');
      });
    } catch (e) {
      resolve(`Lỗi URL: ${e.message}`);
    }
  });
}

/**
 * Search the web using DuckDuckGo HTML Engine & Wikipedia fallback
 */
export async function searchWeb(query, maxResults = 5) {
  try {
    const wikiResult = await searchWikipedia(query);

    const encoded = encodeURIComponent(query);
    const searchUrl = `https://html.duckduckgo.com/html/?q=${encoded}`;

    const rawHtml = await new Promise((resolve) => {
      const req = https.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'vi,en;q=0.9'
        },
        timeout: 10000
      }, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => resolve(data));
      });
      req.on('error', () => resolve(''));
      req.on('timeout', () => { req.destroy(); resolve(''); });
    });

    const snippets = [];
    let match;
    const resultBlockRegex = /<div class="result__body">([\s\S]*?)<\/div>/gi;
    
    while ((match = resultBlockRegex.exec(rawHtml)) !== null && snippets.length < maxResults) {
      const block = match[1];
      const titleMatch = /<a class="result__a"[^>]*>([\s\S]*?)<\/a>/i.exec(block);
      const snippetMatch = /<a class="result__snippet"[^>]*>([\s\S]*?)<\/a>/i.exec(block);
      const urlMatch = /<a class="result__url"[^>]*href="([^"]*)"/i.exec(block);

      if (titleMatch || snippetMatch) {
        snippets.push({
          title: titleMatch ? cleanHtml(titleMatch[1]) : 'Kết quả',
          snippet: snippetMatch ? cleanHtml(snippetMatch[1]) : '',
          url: urlMatch ? decodeURIComponent(urlMatch[1].replace(/.*uddg=/, '').split('&')[0]) : ''
        });
      }
    }

    let output = '';
    if (wikiResult) {
      output += wikiResult + '\n\n---\n';
    }

    if (snippets.length > 0) {
      output += snippets.map((s, i) => `[${i + 1}] **${s.title}**\n${s.snippet}\n🔗 Nguồn: ${s.url}`).join('\n\n');
      return output;
    }

    if (wikiResult) return wikiResult;

    return `Không tìm thấy kết quả trực tiếp cho: "${query}". Bạn có thể thử với từ khóa khác.`;
  } catch (err) {
    return `Lỗi tra cứu web: ${err.message}`;
  }
}
