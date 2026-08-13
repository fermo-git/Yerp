import type { ReactNode } from "react";
import type { BusinessCategory } from "@/types/business";

const icon = (children: ReactNode) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
    {children}
  </svg>
);

export const CATEGORY_ICONS: Record<BusinessCategory, ReactNode> = {
  RESTAURANTE: icon(<path d="M5 3v8a2 2 0 0 0 2 2v8M9 3v6M5 3h4M19 3v18M19 3c-2 0-3 2-3 5s1 4 3 4" />),
  CAFETERIA: icon(<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8zM17 9h1.5a2.5 2.5 0 0 1 0 5H17M8 3v2M11 3v2M14 3v2" />),
  BAR: icon(<path d="M5 4h14l-6 8v7h3M10 12v7H7" />),
  HOTEL: icon(<path d="M3 21V8l9-5 9 5v13M9 21v-6h6v6M3 21h18" />),
  TIENDA: icon(<path d="M6 7V6a6 6 0 0 1 12 0v1M5 7h14l1 14H4L5 7zM9 11v2a3 3 0 0 0 6 0v-2" />),
  SALUD: icon(<><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></>),
  BELLEZA: icon(<path d="M12 3l1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3zM19 16l.9 2.1L22 19l-2.1.9L19 22l-.9-2.1L16 19l2.1-.9L19 16z" />),
  ENTRETENIMIENTO: icon(<path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9zM14 7v10" />),
  SERVICIOS_PROFESIONALES: icon(<path d="M4 8h16v11H4zM9 8V6a3 3 0 0 1 6 0v2M4 13h16" />),
  AUTOMOTRIZ: icon(<path d="M5 16l1.5-5A2 2 0 0 1 8.4 9.5h7.2a2 2 0 0 1 1.9 1.5l1.5 5M5 16v3M19 16v3M5 16h14M7 19h.01M17 19h.01" />),
  EDUCACION: icon(<path d="M2 8l10-4 10 4-10 4L2 8zM6 10.5V15c0 1.5 3 3 6 3s6-1.5 6-3v-4.5M22 8v6" />),
  OTRO: icon(<><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></>),
};
