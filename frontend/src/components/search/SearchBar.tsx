import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { PinIcon } from "@/components/brand/Icons";
import { useBusinessSuggestions } from "@/hooks/useBusinesses";
import { CATEGORY_ICONS } from "@/lib/categoryIcons";
import {
  CATEGORY_LABELS,
  CITY_LABELS,
  CITY_OPTIONS,
  type BorderCity,
} from "@/types/business";
import { cn } from "@/utils/cn";

interface SearchBarProps {
  city: BorderCity;
  onCityChange?: (city: BorderCity) => void;
  initialQuery?: string;
  onSubmit: (q: string, city: BorderCity) => void;
  autoFocus?: boolean;
  variant?: "hero" | "compact";
  showCity?: boolean;
}

export function SearchBar({
  city,
  onCityChange,
  initialQuery = "",
  onSubmit,
  autoFocus,
  variant = "hero",
  showCity = true,
}: SearchBarProps) {
  const navigate = useNavigate();
  const [input, setInput] = useState(initialQuery);
  const [debounced, setDebounced] = useState(initialQuery);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLFormElement>(null);

  const { data: suggestions, isLoading } = useBusinessSuggestions(debounced, city);
  const showPanel = open && debounced.trim().length >= 2;

  useEffect(() => {
    setInput(initialQuery);
    setDebounced(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(input), 350);
    return () => clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function submit(q?: string) {
    setOpen(false);
    onSubmit(q ?? input, city);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!showPanel || !suggestions?.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      const b = suggestions[activeIndex];
      setOpen(false);
      navigate(`/negocios/${b.slug}`);
    }
  }

  return (
    <form
      ref={rootRef}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className={cn(
        "relative mx-auto flex w-full max-w-3xl items-center gap-1 rounded-full border border-ink/10 bg-white p-1.5",
        variant === "hero" && "shadow-raised"
      )}
    >
      {showCity && (
        <label className="flex items-center gap-2 rounded-full py-2 pl-4 pr-1">
          <PinIcon className="h-4 w-4 shrink-0 text-verde" />
          <select
            value={city}
            onChange={(e) => onCityChange?.(e.target.value as BorderCity)}
            className="appearance-none bg-transparent text-sm font-medium text-ink focus:outline-none"
            aria-label="Ciudad"
          >
            {CITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      )}
      {showCity && <span className="hidden h-6 w-px bg-ink/10 sm:block" />}
      {!showCity && (
        <span className="pl-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-ink-soft"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
      )}
      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setActiveIndex(-1);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        type="text"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls="search-suggestions"
        aria-autocomplete="list"
        autoFocus={autoFocus}
        placeholder="¿Qué buscas?"
        className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none"
      />
      <Button type="submit" size="md" className="rounded-full px-5 sm:shrink-0">
        Buscar
      </Button>

      {showPanel && (
        <div
          id="search-suggestions"
          role="listbox"
          className="absolute inset-x-0 top-full z-[80] mt-2 overflow-hidden rounded-xl border border-ink/10 bg-white p-1 text-left shadow-soft"
        >
          {isLoading && (
            <p className="px-3 py-2.5 text-sm text-ink-soft">Buscando…</p>
          )}

          {!isLoading && suggestions?.length === 0 && (
            <p className="px-3 py-2.5 text-sm text-ink-soft">
              Sin resultados para «{debounced.trim()}»
            </p>
          )}

          {!isLoading &&
            suggestions?.map((b, i) => (
              <button
                key={b.id}
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => {
                  setOpen(false);
                  navigate(`/negocios/${b.slug}`);
                }}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                  i === activeIndex ? "bg-verde-tint" : "hover:bg-ink/5"
                )}
              >
                <span className="text-ink-soft">{CATEGORY_ICONS[b.category]}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-ink">{b.name}</span>
                  <span className="block font-mono text-[11px] uppercase tracking-[0.08em] text-ink-soft">
                    {CATEGORY_LABELS[b.category]} · {CITY_LABELS[b.city]}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-amber-deep">
                  <svg viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-amber-deep" aria-hidden="true">
                    <path d="M10 1.5l2.6 5.3 5.85.85-4.23 4.12 1 5.83L10 14.9l-5.22 2.7 1-5.83L1.55 7.65l5.85-.85L10 1.5z" />
                  </svg>
                  {b.avgRating.toFixed(1)}
                </span>
              </button>
            ))}

          {!isLoading && (suggestions?.length ?? 0) > 0 && (
            <button
              type="button"
              onClick={() => submit(debounced)}
              className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-verde transition-colors hover:bg-verde-tint"
            >
              Ver todos los resultados para «{debounced.trim()}»
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </form>
  );
}
