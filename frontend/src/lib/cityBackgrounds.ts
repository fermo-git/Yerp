const DEFAULT_BG = "/cities/default.jpg";

export function getCityBackgroundUrl(city: string): string {
  return `/cities/${city.toLowerCase()}.jpg`;
}

export const CITY_BG_FALLBACK = DEFAULT_BG;