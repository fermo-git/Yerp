import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import type {
  BorderCity,
  BusinessCategory,
  BusinessSort,
} from "@/types/business";
import { BUSINESS_CATEGORIES } from "@/types/business";

const DEFAULT_CITY: BorderCity = "TIJUANA";

export interface ExploreFilters {
  city: BorderCity;
  q: string;
  category?: BusinessCategory;
  sort: BusinessSort;
}

function isCategory(value: string | null): value is BusinessCategory {
  return value != null && (BUSINESS_CATEGORIES as readonly string[]).includes(value);
}

function isSort(value: string | null): value is BusinessSort {
  return value === "POPULARIDAD" || value === "MEJOR_VALORADOS" || value === "NOVEDADES";
}

/**
 * Filtros de la página /explorar desde la URL (`q`, `ciudad`, `categoria`,
 * `orden`). La ciudad hace fallback a la del usuario autenticado.
 */
export function useExploreFilters() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ExploreFilters>(() => {
    const rawCity = searchParams.get("ciudad");
    const city = (rawCity ?? user?.city ?? DEFAULT_CITY) as BorderCity;
    const rawCategory = searchParams.get("categoria");
    const rawSort = searchParams.get("orden");
    return {
      city,
      q: searchParams.get("q") ?? "",
      category: isCategory(rawCategory) ? rawCategory : undefined,
      sort: isSort(rawSort) ? rawSort : "NOVEDADES",
    };
  }, [searchParams, user]);

  const setParam = (key: string, value: string | null) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value == null || value === "") next.delete(key);
      else next.set(key, value);
      return next;
    });
  };

  const hasActiveFilters =
    Boolean(filters.q.trim()) || Boolean(filters.category) || filters.sort !== "NOVEDADES";

  const clearFilters = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete("q");
      next.delete("categoria");
      next.delete("orden");
      return next;
    });
  };

  return { filters, setParam, hasActiveFilters, clearFilters };
}
