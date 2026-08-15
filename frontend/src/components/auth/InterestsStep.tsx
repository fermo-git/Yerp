import { useState } from "react";
import { INTEREST_CATEGORIES } from "@/types/interests";
import type { BusinessCategory } from "@/types/business";
import { InterestCard } from "@/components/auth/InterestCard";
import { Button } from "@/components/ui/Button";

export function InterestsStep({
  onNext,
  onBack,
  submitting,
}: {
  onNext: (categories: BusinessCategory[]) => void;
  onBack: () => void;
  submitting?: boolean;
}) {
  const [selected, setSelected] = useState<BusinessCategory[]>([]);

  const toggle = (category: BusinessCategory) =>
    setSelected((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );

  return (
    <div>
      <p className="text-sm text-ink-soft">
        Selecciona lo que te interesa para personalizar tu experiencia.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {INTEREST_CATEGORIES.map((category) => (
          <InterestCard
            key={category}
            category={category}
            selected={selected.includes(category)}
            onToggle={() => toggle(category)}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="ghost" size="lg" onClick={onBack} className="flex-1">
          Atrás
        </Button>
        <Button
          size="lg"
          onClick={() => onNext(selected)}
          disabled={submitting}
          className="flex-1"
        >
          {submitting
            ? "Creando cuenta..."
            : selected.length
              ? `Continuar (${selected.length})`
              : "Omitir y continuar"}
        </Button>
      </div>
    </div>
  );
}
