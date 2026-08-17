// frontend/src/services/api/context.ts
import { apiClient } from "@/services/api/client";

export interface WeatherData {
  tempC: number;
  condition: string;
  isDay: boolean;
}

export interface ExchangeRateData {
  usdToMxn: number;
  date: string;
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData> {
  return apiClient.get<WeatherData>(`/context/weather?lat=${lat}&lon=${lon}`);
}

export async function getExchangeRate(): Promise<ExchangeRateData> {
  return apiClient.get<ExchangeRateData>(`/context/exchange-rate`);
}