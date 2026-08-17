import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBusinesses, useRecommendations } from "@/hooks/useBusinesses";
import { Hero } from "@/components/business/Hero";
import { CategoryStrip } from "@/components/business/CategoryStrip";
import { BorderWidgetsStrip } from "@/components/widgets/BorderWidgetsStrip";
import { FeaturedBusinesses } from "@/components/business/FeaturedBusinesses";
import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { PromoBanner } from "@/components/business/PromoBanner";
import { CATEGORY_LABELS, CITY_LABELS, type BorderCity } from "@/types/business";

function CityRestaurants() {
  const { user } = useAuth();
  const city: BorderCity = user?.city ?? "TIJUANA";
  const { data, isLoading, isError } = useBusinesses({
    category: "RESTAURANTE",
    city,
    sort: "POPULARIDAD",
    limit: 4,
  });

  return (
    <section className="container-frontera py-20">
      <header className="flex items-end justify-between gap-4">
        <div>
          <Eyebrow>Para comer</Eyebrow>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Come en {CITY_LABELS[city]}
          </h2>
        </div>
        <Link
          to="/restaurantes"
          className="hidden items-center gap-1.5 text-sm font-semibold text-verde hover:text-verde-deep sm:flex"
        >
          Ver todos
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <BusinessCardSkeleton key={i} />)}

        {!isLoading && isError && (
          <div className="col-span-full">
            <EmptyState
              title="No pudimos cargar los restaurantes"
              description="Intenta de nuevo en unos segundos."
            />
          </div>
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              title={`Aún no hay restaurantes en ${CITY_LABELS[city]}`}
              description="Sé de los primeros en publicar tu negocio en La Frontera."
            />
          </div>
        )}

        {data?.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </section>
  );
}

function ForYou() {
  const rec = useRecommendations();

  if (!rec.enabled) return null;

  return (
    <section className="container-frontera py-20">
      <header>
        <Eyebrow>Para ti</Eyebrow>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Según tus gustos
        </h2>
        <p className="mt-2 text-sm text-ink-soft">
          {rec.categories.map((c) => CATEGORY_LABELS[c]).join(" · ")}
        </p>
      </header>

      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
        {rec.isLoading &&
          Array.from({ length: 4 }).map((_, i) => <BusinessCardSkeleton key={i} />)}

        {!rec.isLoading && rec.isError && (
          <div className="col-span-full">
            <EmptyState
              title="No pudimos armar tus recomendaciones"
              description="Intenta de nuevo en unos segundos."
            />
          </div>
        )}

        {!rec.isLoading && !rec.isError && rec.data.length === 0 && (
          <div className="col-span-full">
            <EmptyState
              title="Todavía no hay negocios de tus gustos"
              description="Pronto habrá más negocios que coincidan con tus intereses."
            />
          </div>
        )}

        {rec.data.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </section>
  );
}

export function LandingPage() {
  return (
    <>
      <Hero />
      <CategoryStrip />
      <div className="py-14">
        <BorderWidgetsStrip />
      </div>
      <FeaturedBusinesses />
      <CityRestaurants />
      <ForYou />
      <PromoBanner />
    </>
  );
}
