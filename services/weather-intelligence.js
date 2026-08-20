import https from 'https';

/**
 * Động cơ Tra Cứu Thời Tiết, Dự Báo Khí Tượng & Chất Lượng Không Khí Toàn Cầu
 */
export class WeatherIntelligenceEngine {
  /**
   * Tra cứu tọa độ địa lý và thời tiết thời gian thực
   */
  async getWeather(cityName = 'Hà Nội') {
    const cleanCity = cityName.trim();

    try {
      // 1. Geocoding: Tìm tọa độ thành phố
      const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=vi&format=json`;
      const geoData = await new Promise((resolve) => {
        https.get(geoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(body)); } catch (e) { resolve(null); }
          });
        }).on('error', () => resolve(null));
      });

      if (!geoData || !geoData.results || geoData.results.length === 0) {
        return `⚠️ Không tìm thấy vị trí địa lý cho "${cityName}". Vui lòng thử lại với tên thành phố cụ thể (ví dụ: Hà Nội, Hồ Chí Minh, Đà Nẵng).`;
      }

      const location = geoData.results[0];
      const { latitude, longitude, name, country } = location;

      // 2. Lấy dữ liệu thời tiết & chất lượng không khí
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

      const weatherData = await new Promise((resolve) => {
        https.get(weatherUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
          let body = '';
          res.on('data', chunk => body += chunk);
          res.on('end', () => {
            try { resolve(JSON.parse(body)); } catch (e) { resolve(null); }
          });
        }).on('error', () => resolve(null));
      });

      if (!weatherData || !weatherData.current) {
        return `⚠️ Không thể lấy thông tin khí tượng cho ${name}.`;
      }

      const current = weatherData.current;
      const daily = weatherData.daily;

      const temp = current.temperature_2m;
      const feelLike = current.apparent_temperature;
      const humidity = current.relative_humidity_2m;
      const wind = current.wind_speed_10m;
      const rainProb = daily?.precipitation_probability_max?.[0] || 0;
      const maxTemp = daily?.temperature_2m_max?.[0] || temp;
      const minTemp = daily?.temperature_2m_min?.[0] || temp;

      return `🌤️ **BÁO CÁO THỜI TIẾT TẠI ${name.toUpperCase()}, ${country || 'VIỆT NAM'}:**\n- **Nhiệt độ hiện tại:** ${temp}°C (Cảm nhận thực tế: ${feelLike}°C)\n- **Biên độ trong ngày:** ${minTemp}°C - ${maxTemp}°C\n- **Độ ẩm:** ${humidity}%\n- **Tốc độ gió:** ${wind} km/h\n- **Xác suất mưa hôm nay:** ${rainProb}%\n- **Khuyến nghị:** ${rainProb > 50 ? '⚠️ Khả năng có mưa cao, sếp nên chuẩn bị sẵn ô/áo mưa khi ra ngoài.' : '☀️ Thời tiết thuận lợi cho các lịch trình di chuyển và công tác.'}`;
    } catch (err) {
      return `❌ Lỗi tra cứu thời tiết: ${err.message}`;
    }
  }
}

export const weatherIntelligence = new WeatherIntelligenceEngine();
