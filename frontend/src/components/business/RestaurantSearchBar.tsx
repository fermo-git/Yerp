import { useEffect, useState } from "react";

interface RestaurantSearchBarProps {
  value: string;
  onChange: (q: string) => void;
}

export function RestaurantSearchBar({ value, onChange }: RestaurantSearchBarProps) {
  const [input, setInput] = useState(value);

  useEffect(() => {
    setInput(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => onChange(input), 350);
    return () => clearTimeout(timer);
  }, [input, onChange]);

  return (
    <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-white p-2 shadow-soft">
      <span className="pl-3">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 text-ink-soft"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
      </span>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        type="text"
        placeholder="Busca un restaurante..."
        className="min-w-0 flex-1 bg-transparent px-2 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none"
      />
    </div>
  );
}
