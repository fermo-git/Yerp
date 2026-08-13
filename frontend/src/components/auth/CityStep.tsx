import { useState } from "react";
import { cn } from "@/utils/cn";
import { CITY_OPTIONS, type BorderCity } from "@/types/business";
import { Button } from "@/components/ui/Button";

export function CityStep({
  onNext,
  onBack,
}: {
  onNext: (city: BorderCity) => void;
  onBack: () => void;
}) {
  const [city, setCity] = useState<BorderCity | null>(null);

  return (
    <div>
      <p className="text-sm text-ink-soft">
        Elige tu ciudad para mostrarte lo que sucede cerca de ti.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {CITY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setCity(opt.value)}
            aria-pressed={city === opt.value}
            className={cn(
              "flex items-center gap-2.5 rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors",
              city === opt.value
                ? "border-verde bg-verde-tint text-verde-deep"
                : "border-ink/10 bg-white text-ink hover:border-ink/25"
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                city === opt.value ? "bg-verde text-white" : "bg-ink/5 text-verde-deep"
              )}
            >
              {opt.label.charAt(0)}
            </span>
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="ghost" size="lg" onClick={onBack} className="flex-1">
          Atrás
        </Button>
        <Button size="lg" onClick={() => city && onNext(city)} disabled={!city} className="flex-1">
          Continuar
        </Button>
      </div>
    </div>
  );
}
