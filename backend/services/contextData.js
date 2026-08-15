const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;

// Cache simple en memoria — clima cambia poco, no tiene caso pedirlo
// en cada request. TTL de 10 min por ciudad.
const weatherCache = new Map();
const WEATHER_TTL_MS = 10 * 60 * 1000;

export async function getWeatherForCity(lat, lon) {
  const cacheKey = `${lat},${lon}`;
  const cached = weatherCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < WEATHER_TTL_MS) {
    return cached.data;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${OPENWEATHER_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`OpenWeather respondió ${res.status}`);
  const raw = await res.json();

  const data = {
    tempC: raw.main.temp,
    condition: raw.weather[0].main, // "Clear", "Clouds", "Rain", etc.
    isDay: raw.weather[0].icon.endsWith("d"),
  };

  weatherCache.set(cacheKey, { data, timestamp: Date.now() });
  return data;
}

// Cache de 12 hrs para tipo de cambio — no tiene sentido pedirlo más seguido,
// el dato de Frankfurter se actualiza una vez al día.
let exchangeRateCache = null;
const EXCHANGE_TTL_MS = 12 * 60 * 60 * 1000;

export async function getUsdToMxnRate() {
  if (exchangeRateCache && Date.now() - exchangeRateCache.timestamp < EXCHANGE_TTL_MS) {
    return exchangeRateCache.data;
  }

  const res = await fetch("https://api.frankfurter.dev/v2/rate/USD/MXN");
  if (!res.ok) throw new Error(`Frankfurter respondió ${res.status}`);
  const raw = await res.json();

   const data = { usdToMxn: raw.rate, date: raw.date };
  exchangeRateCache = { data, timestamp: Date.now() };
  return data;
}