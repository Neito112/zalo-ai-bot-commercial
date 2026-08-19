const STITCH_KEY = process.env.GOOGLE_STITCH_KEY || process.env.STITCH_API_KEY || '';

export async function callStitchApi(action, params = {}) {
  try {
    console.log(`🧩 Executing Google Stitch API (${action})...`);
    
    // Generic HTTP handler for Stitch Services
    const res = await fetch(`https://stitch.googleapis.com/v1/${action}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STITCH_KEY}`,
        'x-goog-api-key': STITCH_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });

    if (!res.ok) {
      const errText = await res.text();
      return `ℹ️ Google Stitch Status (${res.status}): ${errText}`;
    }

    const data = await res.json();
    return JSON.stringify(data, null, 2);
  } catch (err) {
    return `⚠️ Lỗi kết nối Google Stitch API: ${err.message}`;
  }
}
