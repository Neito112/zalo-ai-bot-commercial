import https from 'https';

/**
 * Extract YouTube Video ID from any URL format
 */
export function extractYouTubeId(url) {
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

/**
 * Fetch video metadata & transcript / subtitles for analysis
 */
export async function analyzeYouTubeVideo(videoUrl) {
  const videoId = extractYouTubeId(videoUrl);
  if (!videoId) {
    return `⚠️ Không tìm thấy Video ID YouTube hợp lệ trong URL: ${videoUrl}`;
  }

  try {
    // Fetch video page HTML
    const pageHtml = await new Promise((resolve) => {
      const req = https.get(`https://www.youtube.com/watch?v=${videoId}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'vi,en;q=0.9'
        },
        timeout: 10000
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(data));
      });
      req.on('error', () => resolve(''));
      req.on('timeout', () => { req.destroy(); resolve(''); });
    });

    // Extract Title
    const titleMatch = pageHtml.match(/<title>([\s\S]*?)<\/title>/i);
    let title = titleMatch ? titleMatch[1].replace('- YouTube', '').trim() : 'Video YouTube';

    // Extract Meta Description / Short description
    const descMatch = pageHtml.match(/<meta name="description" content="([\s\S]*?)">/i);
    let description = descMatch ? descMatch[1] : '';

    // Extract Channel Name
    const channelMatch = pageHtml.match(/"ownerChannelName":"([^"]+)"/i) || pageHtml.match(/"author":"([^"]+)"/i);
    let channel = channelMatch ? channelMatch[1] : 'Kênh YouTube';

    // Extract Transcript text chunks from player response if embedded
    let transcriptSnippets = [];
    const captionTracksMatch = pageHtml.match(/"captionTracks":\s*(\[[^\]]+\])/);
    if (captionTracksMatch) {
      try {
        const tracks = JSON.parse(captionTracksMatch[1]);
        if (tracks && tracks.length > 0) {
          const captionUrl = tracks[0].baseUrl;
          if (captionUrl) {
            const rawSubtitles = await new Promise((resolve) => {
              https.get(captionUrl, { timeout: 8000 }, (res) => {
                let subData = '';
                res.on('data', chunk => subData += chunk);
                res.on('end', () => resolve(subData));
              }).on('error', () => resolve(''));
            });

            if (rawSubtitles) {
              const textMatches = rawSubtitles.match(/<text[^>]*>([\s\S]*?)<\/text>/gi) || [];
              transcriptSnippets = textMatches.map(t => t.replace(/<[^>]+>/g, '').replace(/&#39;/g, "'").replace(/&amp;/g, '&').trim()).filter(Boolean);
            }
          }
        }
      } catch (e) {}
    }

    let transcriptSummary = '';
    if (transcriptSnippets.length > 0) {
      transcriptSummary = `\n📜 **NỘI DUNG LỜI THOẠI (TRANSCRIPT) TRÍCH XUẤT:**\n${transcriptSnippets.slice(0, 80).join(' ')}...`;
    }

    return `🎬 **THÔNG TIN VIDEO YOUTUBE:**
- **Tiêu đề:** ${title}
- **Kênh phát hành:** ${channel}
- **ID Video:** ${videoId}
- **Mô tả sơ lược:** ${description || 'Không có mô tả chi tiết'}
${transcriptSummary}

💡 Hãy tổng hợp, tóm tắt các luận điểm cốt lõi và bài học thực tế nhất từ video này cho người dùng.`;

  } catch (err) {
    return `⚠️ Lỗi khi trích xuất dữ liệu video YouTube: ${err.message}`;
  }
}
