// frontend/src/hooks/useContextData.ts
import { useQuery } from "@tanstack/react-query";
import { getWeather, getExchangeRate } from "@/services/api/context";

export function useWeather(lat?: number | null, lon?: number | null) {
  return useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => getWeather(lat!, lon!),
    enabled: lat != null && lon != null,
    staleTime: 10 * 60 * 1000, // coincide con el cache del backend
  });
}

export function useExchangeRate() {
  return useQuery({
    queryKey: ["exchange-rate"],
    queryFn: getExchangeRate,
    staleTime: 12 * 60 * 60 * 1000,
  });
}