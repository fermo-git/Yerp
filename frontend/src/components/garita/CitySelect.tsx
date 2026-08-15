import { MapPin } from "lucide-react";

const CITY_REGIONS: { region: string; cities: string[] }[] = [
  { region: "Baja California", cities: ["TIJUANA", "TECATE", "MEXICALI", "LOS_ALGODONES"] },
  { region: "Sonora", cities: ["SAN_LUIS_RIO_COLORADO", "SONOYTA", "NOGALES", "NACO", "AGUA_PRIETA"] },
  { region: "Chihuahua", cities: ["CIUDAD_JUAREZ", "PALOMAS", "OJINAGA"] },
  { region: "Coahuila", cities: ["CIUDAD_ACUNA", "PIEDRAS_NEGRAS"] },
  { region: "Tamaulipas", cities: ["NUEVO_LAREDO", "MIGUEL_ALEMAN", "CAMARGO", "REYNOSA", "NUEVO_PROGRESO", "MATAMOROS"] },
];

function formatCityLabel(city: string): string {
  return city
    .split("_")
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(" ");
}

interface CitySelectProps {
  value: string;
  onChange: (city: string) => void;
}

export function CitySelect({ value, onChange }: CitySelectProps) {
  return (
    <div className="relative w-full max-w-xs">
      <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-ink/15 bg-white py-2.5 pl-9 pr-8 text-sm font-medium text-ink focus:border-verde focus:outline-none"
      >
        {CITY_REGIONS.map(({ region, cities }) => (
          <optgroup key={region} label={region}>
            {cities.map((city) => (
              <option key={city} value={city}>
                {formatCityLabel(city)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}