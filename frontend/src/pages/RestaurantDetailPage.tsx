import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useRestaurantBySlug } from "@/hooks/useRestaurants";
import { useCreateReview, useReviews } from "@/hooks/useReviews";
import { RestaurantHero } from "@/components/business/RestaurantHero";
import { HoursTable } from "@/components/business/HoursTable";
import { ContactCard } from "@/components/business/ContactCard";
import { ReviewList } from "@/components/business/ReviewList";
import { ReviewForm } from "@/components/business/ReviewForm";
import { ReviewSummary } from "@/components/business/ReviewSummary";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import type { CreateReviewInput } from "@/types/business";

type ReviewSort = "RECIENTES" | "ANTIGUAS";

const pillClassName =
  "flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm";
const selectClassName =
  "appearance-none bg-transparent text-sm font-medium text-ink focus:outline-none";

function StarGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 fill-amber-deep">
      <path d="M10 1.5l2.6 5.3 5.85.85-4.23 4.12 1 5.83L10 14.9l-5.22 2.7 1-5.83L1.55 7.65l5.85-.85L10 1.5z" />
    </svg>
  );
}

export function RestaurantDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: restaurant, isLoading, isError } = useRestaurantBySlug(slug ?? "");
  const { data: reviews, isLoading: reviewsLoading } = useReviews(restaurant?.id ?? "");
  const createReview = useCreateReview();
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [reviewSort, setReviewSort] = useState<ReviewSort>("RECIENTES");

  const toggleFavorite = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsFavorite((v) => !v);
  };

  const scrollToReviews = () => {
    document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    let sum = 0;
    for (const r of reviews ?? []) {
      if (r.rating >= 1 && r.rating <= 5) {
        counts[r.rating - 1] += 1;
        sum += r.rating;
      }
    }
    const total = (reviews ?? []).length;
    const avg = total > 0 ? sum / total : 0;
    return { total, avg, counts };
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    let list = reviews ?? [];
    if (selectedStar != null) list = list.filter((r) => r.rating === selectedStar);
    return [...list].sort((a, b) => {
      const ta = new Date(a.createdAt).getTime();
      const tb = new Date(b.createdAt).getTime();
      return reviewSort === "ANTIGUAS" ? ta - tb : tb - ta;
    });
  }, [reviews, selectedStar, reviewSort]);

  if (isLoading) {
    return (
      <div className="container-frontera py-10">
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError || !restaurant) {
    return (
      <div className="container-frontera py-20">
        <EmptyState
          title="Restaurante no encontrado"
          description="Este restaurante no existe o fue eliminado."
        />
      </div>
    );
  }

  return (
    <div className="container-frontera py-8">
      <RestaurantHero
        restaurant={restaurant}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
        onWriteReview={scrollToReviews}
      />

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="flex flex-col gap-10 lg:col-span-2">
          <section>
            <Eyebrow>Horario</Eyebrow>
            <h2 className="mt-2 font-display text-xl font-bold text-ink">Horarios</h2>
            <div className="mt-4">
              <HoursTable hours={restaurant.hours} />
            </div>
          </section>

          <section>
            <Eyebrow>Menú</Eyebrow>
            <h2 className="mt-2 font-display text-xl font-bold text-ink">Menú</h2>
            <div className="mt-4">
              {restaurant.website ? (
                <Button
                  variant="outline"
                  onClick={() => window.open(restaurant.website, "_blank", "noopener,noreferrer")}
                >
                  Ver menú
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </Button>
              ) : (
                <p className="text-sm text-ink-soft">El menú no está disponible en línea.</p>
              )}
            </div>
          </section>
        </div>

        <aside>
          <ContactCard restaurant={restaurant} />
        </aside>
      </div>

      <section id="reviews" className="mt-12 scroll-mt-24">
        <Eyebrow>Reseñas</Eyebrow>
        <h2 className="mt-2 font-display text-xl font-bold text-ink">Lo que dicen los clientes</h2>

        {stats.total > 0 && (
          <div className="mt-6">
            <ReviewSummary
              total={stats.total}
              avg={stats.avg}
              counts={stats.counts}
              selectedStar={selectedStar}
              onSelectStar={setSelectedStar}
            />
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <label className={pillClassName}>
            <select
              value={reviewSort}
              onChange={(e) => setReviewSort(e.target.value as ReviewSort)}
              aria-label="Ordenar reseñas"
              className={selectClassName}
            >
              <option value="RECIENTES">Más recientes</option>
              <option value="ANTIGUAS">Más antiguas</option>
            </select>
          </label>

          <label className={pillClassName}>
            <StarGlyph />
            <select
              value={selectedStar ?? ""}
              onChange={(e) =>
                setSelectedStar(e.target.value === "" ? null : Number(e.target.value))
              }
              aria-label="Filtrar por estrellas"
              className={selectClassName}
            >
              <option value="">Todas las estrellas</option>
              <option value="5">5 estrellas</option>
              <option value="4">4 estrellas</option>
              <option value="3">3 estrellas</option>
              <option value="2">2 estrellas</option>
              <option value="1">1 estrella</option>
            </select>
          </label>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {selectedStar != null && filteredReviews.length === 0 ? (
              <EmptyState
                title={`No hay reseñas de ${selectedStar} ${
                  selectedStar === 1 ? "estrella" : "estrellas"
                }`}
                description="Prueba con otra calificación o quita el filtro."
              />
            ) : (
              <ReviewList reviews={filteredReviews} isLoading={reviewsLoading} />
            )}
          </div>
          <div>
            <ReviewForm
              onSubmit={(input: CreateReviewInput) =>
                createReview.mutate({ businessId: restaurant.id, input })
              }
              isSubmitting={createReview.isPending}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
