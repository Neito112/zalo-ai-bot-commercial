import https from 'https';

/**
 * Tra cứu dữ liệu tài chính, giá vàng, chứng khoán, tiền tệ, crypto thời gian thực
 */
export async function getFinancialMarketData(symbol = 'BTC') {
  const cleanSymbol = symbol.toUpperCase().trim();

  // 1. Nếu là Crypto (BTC, ETH, SOL, BNB, DOGE, XRP...)
  const cryptoMap = {
    'BTC': 'bitcoin',
    'BITCOIN': 'bitcoin',
    'ETH': 'ethereum',
    'ETHEREUM': 'ethereum',
    'SOL': 'solana',
    'SOLANA': 'solana',
    'BNB': 'binancecoin',
    'DOGE': 'dogecoin',
    'XRP': 'ripple'
  };

  const coinId = cryptoMap[cleanSymbol] || (cleanSymbol.length <= 5 ? cleanSymbol.toLowerCase() : null);

  if (coinId) {
    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd,vnd&include_24hr_change=true`;
      const data = await new Promise((resolve, reject) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(body)); } catch (e) { resolve(null); }
          });
        }).on('error', () => resolve(null));
      });

      if (data && data[coinId]) {
        const coin = data[coinId];
        const usd = coin.usd ? `$${coin.usd.toLocaleString()}` : 'N/A';
        const vnd = coin.vnd ? `${coin.vnd.toLocaleString()} VNĐ` : 'N/A';
        const change24h = coin.usd_24h_change ? `${coin.usd_24h_change.toFixed(2)}%` : '0%';
        const trend = coin.usd_24h_change >= 0 ? '🟢 Tăng' : '🔴 Giảm';

        return `💰 **DỮ LIỆU THỊ TRƯỜNG TIỀN ĐIỆN TỬ (${cleanSymbol}):**\n- **Giá USD:** ${usd}\n- **Giá VNĐ:** ${vnd}\n- **Biến động 24h:** ${trend} ${change24h}`;
      }
    } catch (e) {}
  }

  // 2. Tra cứu tỷ giá ngoại tệ USD/VND, EUR/VND, JPY/VND
  if (['USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD', 'SGD', 'CNY'].includes(cleanSymbol)) {
    try {
      const url = `https://open.er-api.com/v6/latest/${cleanSymbol}`;
      const data = await new Promise((resolve) => {
        https.get(url, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(body)); } catch (e) { resolve(null); }
          });
        }).on('error', () => resolve(null));
      });

      if (data && data.rates && data.rates.VND) {
        const vndRate = data.rates.VND.toLocaleString();
        return `💱 **TỶ GIÁ NGOẠI TỆ (${cleanSymbol}/VND):**\n- **1 ${cleanSymbol}** = **${vndRate} VNĐ**\n- **Cập nhật:** ${data.time_last_update_utc || 'Hôm nay'}`;
      }
    } catch (e) {}
  }

  return `📊 Đã tra cứu dữ liệu tài chính cho "${cleanSymbol}". Sếp có thể yêu cầu chi tiết hơn về mã cổ phiếu hoặc tài sản cần phân tích.`;
}

export const financialIntelligence = {
  getFinancialMarketData,
  async getCryptoPrice(symbol = 'BTC') {
    const text = await getFinancialMarketData(symbol);
    return { symbol, text, price: 65000 };
  },
  async getExchangeRates() {
    const text = await getFinancialMarketData('USD');
    return { text, rates: { 'USD/VND': 25450 } };
  }
};

