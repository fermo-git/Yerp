import { useState } from "react";
import { cn } from "@/utils/cn";
import { Button } from "@/components/ui/Button";

export type AccountType = "USER" | "BUSINESS_OWNER";

interface AccountOption {
  value: AccountType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const options: AccountOption[] = [
  {
    value: "USER",
    title: "Explorador",
    description: "Descubre lugares, guarda favoritos y deja reseñas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="m15.5 8.5-2 5-5 2 2-5z" />
      </svg>
    ),
  },
  {
    value: "BUSINESS_OWNER",
    title: "Tengo un negocio",
    description: "Publica tu negocio, sube fotos y menú, recibe reseñas.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9h18l-1.5-4H4.5z" />
        <path d="M5 9v11h14V9" />
        <path d="M9 20v-6h6v6" />
      </svg>
    ),
  },
];

export function AccountTypeStep({
  initial,
  onNext,
  onBack,
}: {
  initial?: AccountType;
  onNext: (accountType: AccountType) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<AccountType | undefined>(initial);

  return (
    <div>
      <p className="text-sm text-ink-soft">
        ¿Cómo usarás La Frontera? Puedes cambiar tu tipo de cuenta más adelante.
      </p>

      <div className="mt-5 flex flex-col gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSelected(opt.value)}
            aria-pressed={selected === opt.value}
            className={cn(
              "flex items-start gap-3 rounded-xl border px-4 py-4 text-left transition-colors",
              selected === opt.value
                ? "border-verde bg-verde-tint"
                : "border-ink/10 bg-white hover:border-ink/25"
            )}
          >
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                selected === opt.value ? "bg-verde text-white" : "bg-ink/5 text-verde-deep"
              )}
            >
              {opt.icon}
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-sm font-semibold text-ink">{opt.title}</span>
              <span className="text-xs leading-relaxed text-ink-soft">{opt.description}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button variant="ghost" size="lg" onClick={onBack} className="flex-1">
          Atrás
        </Button>
        <Button size="lg" onClick={() => selected && onNext(selected)} disabled={!selected} className="flex-1">
          Continuar
        </Button>
      </div>
    </div>
  );
}