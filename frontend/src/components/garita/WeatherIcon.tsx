// frontend/src/components/garita/WeatherIcon.tsx
import { Sun, Moon, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, CloudMoon } from "lucide-react";

interface WeatherIconProps {
  condition: string; // "Clear" | "Clouds" | "Rain" | "Thunderstorm" | "Snow" | "Mist" | "Fog" | "Haze"
  isDay: boolean;
  className?: string;
}

export function WeatherIcon({ condition, isDay, className }: WeatherIconProps) {
  const props = { className: className ?? "h-6 w-6 text-verde", strokeWidth: 1.7 };

  switch (condition) {
    case "Clear":
      return isDay ? <Sun {...props} /> : <Moon {...props} />;
    case "Clouds":
      return isDay ? <Cloud {...props} /> : <CloudMoon {...props} />;
    case "Rain":
    case "Drizzle":
      return <CloudRain {...props} />;
    case "Thunderstorm":
      return <CloudLightning {...props} />;
    case "Snow":
      return <CloudSnow {...props} />;
    case "Mist":
    case "Fog":
    case "Haze":
      return <CloudFog {...props} />;
    default:
      return <Cloud {...props} />;
  }
}