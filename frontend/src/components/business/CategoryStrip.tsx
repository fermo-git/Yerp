import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { CategoryPill } from "@/components/business/CategoryPill";
import { CATEGORY_LABELS, type BusinessCategory } from "@/types/business";
import { CATEGORY_ICONS } from "@/lib/categoryIcons";

const CATEGORIES: BusinessCategory[] = [
  "RESTAURANTE",
  "CAFETERIA",
  "BAR",
  "HOTEL",
  "TIENDA",
  "SALUD",
  "BELLEZA",
  "ENTRETENIMIENTO",
  "SERVICIOS_PROFESIONALES",
  "AUTOMOTRIZ",
  "EDUCACION",
  "OTRO",
];

export function CategoryStrip() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeParam =
    location.pathname === "/explorar" ? searchParams.get("categoria") : null;

  return (
    <div className="container-frontera">
      <div className="flex gap-7 overflow-x-auto border-b border-ink/10 py-4">
        {CATEGORIES.map((cat) => (
          <CategoryPill
            key={cat}
            label={CATEGORY_LABELS[cat]}
            icon={CATEGORY_ICONS[cat]}
            active={activeParam === cat}
            onClick={() => navigate(`/explorar?categoria=${cat}`)}
          />
        ))}
      </div>
    </div>
  );
}
