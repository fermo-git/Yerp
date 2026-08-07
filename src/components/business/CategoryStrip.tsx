import { useState } from "react";
import { CategoryPill } from "@/components/business/CategoryPill";

const CATEGORIES = [
  {
    key: "RESTAURANTE",
    label: "Restaurantes",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 3v8a2 2 0 0 0 2 2v8M9 3v6M5 3h4M19 3v18M19 3c-2 0-3 2-3 5s1 4 3 4" />
      </svg>
    ),
  },
  {
    key: "CAFETERIA",
    label: "Cafeterías",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8zM17 9h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2M11 3v2M14 3v2" />
      </svg>
    ),
  },
  {
    key: "ATRACCION_TURISTICA",
    label: "Turismo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="m15 9-2 6-6 2 2-6 6-2z" />
      </svg>
    ),
  },
  {
    key: "HOTEL_HOSPEDAJE",
    label: "Hospedaje",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 21V8l9-5 9 5v13M9 21v-6h6v6" />
      </svg>
    ),
  },
  {
    key: "BAR_ANTRO",
    label: "Bares",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M5 4h14l-6 8v7h3M10 12v7H7" />
      </svg>
    ),
  },
  {
    key: "EMPRENDIMIENTO_LOCAL",
    label: "Emprendimientos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 9l1.5-5h15L21 9M3 9v10h18V9M3 9h18M9 13a3 3 0 0 0 6 0" />
      </svg>
    ),
  },
  {
    key: "EVENTO",
    label: "Eventos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    key: "SERVICIOS",
    label: "Servicios",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
      </svg>
    ),
  },
];

export function CategoryStrip() {
  const [active, setActive] = useState("RESTAURANTE");

  return (
    <div className="container-frontera">
      <div className="flex gap-6 overflow-x-auto border-b border-carbon/8">
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat.key}
            label={cat.label}
            icon={cat.icon}
            active={active === cat.key}
            onClick={() => setActive(cat.key)}
          />
        ))}
      </div>
    </div>
  );
}
