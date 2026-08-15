import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  useCrossings,
  useCurrentWaitTimes,
  useWaitTimeHistory,
  useCityWaitTimesSummary,
} from "@/hooks/useCrossings";
import { useWeather, useExchangeRate } from "@/hooks/useContextData";
import { computeTrends } from "@/lib/waitTimeTrend";
import { CityBackdrop } from "@/components/garita/CityBackdrop";
import { CitySelect } from "@/components/garita/CitySelect";
import { ContextBar } from "@/components/garita/ContextBar";
import { RecommendationBanner } from "@/components/garita/RecommendationBanner";
import { LaneStatusCard } from "@/components/garita/LaneStatusCard";
import { CrossingMap } from "@/components/garita/CrossingMap";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

const gridVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

export function GaritaPage() {
  const { user, updateMe } = useAuth();
  const navigate = useNavigate();
  const [city, setCity] = useState<string>(user?.city ?? "TIJUANA");
  const [selectedCrossingId, setSelectedCrossingId] = useState<string | null>(null);
  const [savingFavorite, setSavingFavorite] = useState(false);

  const { data: crossings, isLoading: loadingCrossings } = useCrossings(city);
  const { data: waitTimes, isLoading: loadingWaitTimes } = useCurrentWaitTimes(
    selectedCrossingId ?? undefined
  );
  const { data: history } = useWaitTimeHistory(selectedCrossingId ?? undefined, undefined, 3);

  const crossingIds = useMemo(() => crossings?.map((c) => c.id) ?? [], [crossings]);
  const { data: citySummary } = useCityWaitTimesSummary(crossingIds);

  const selectedCrossing = useMemo(
    () => crossings?.find((c) => c.id === selectedCrossingId) ?? null,
    [crossings, selectedCrossingId]
  );

  const { data: weather, isLoading: loadingWeather } = useWeather(
    selectedCrossing?.latitude,
    selectedCrossing?.longitude
  );
  const { data: exchangeRate, isLoading: loadingRate } = useExchangeRate();

  const trends = useMemo(() => (history ? computeTrends(history) : {}), [history]);

  useEffect(() => {
    if (selectedCrossingId || !crossings?.length) return;
    const favoriteInThisCity = crossings.find((c) => c.id === user?.favoriteCrossingId);
    setSelectedCrossingId(favoriteInThisCity?.id ?? crossings[0].id);
  }, [crossings, user?.favoriteCrossingId, selectedCrossingId]);

  const isFavorite = user?.favoriteCrossingId === selectedCrossingId;

  async function handleToggleFavorite() {
    if (!selectedCrossingId) return;
    if (!user) {
      navigate("/login");
      return;
    }
    setSavingFavorite(true);
    try {
      await updateMe({ favoriteCrossingId: isFavorite ? null : selectedCrossingId });
    } finally {
      setSavingFavorite(false);
    }
  }

  function handleCityChange(newCity: string) {
    setCity(newCity);
    setSelectedCrossingId(null);
  }

  return (
    <div className="relative">
      <CityBackdrop city={city} />

      <div className="relative py-8 sm:py-12">
        <div className="container-frontera">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col gap-6 rounded-3xl bg-white/95 p-6 shadow-raised sm:gap-8 sm:p-10"
          >
            <header className="flex flex-col gap-2">
              <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl">
                ¿Dónde va la{" "}
                <span className="relative inline-block whitespace-nowrap">
                   fila?
                  <motion.span
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
                    className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-verde"
                  />
                </span>
              </h1>
              <p className="text-ink/60">
                Tiempos de espera en tiempo real, por carril, en los cruces fronterizos.
              </p>
            </header>

            {/* Control bar: ciudad + garita + favorito */}
            <div className="flex flex-col gap-3">
              <CitySelect value={city} onChange={handleCityChange} />

              {loadingCrossings ? (
                <Skeleton className="h-10 w-full max-w-md" />
              ) : crossings && crossings.length > 0 ? (
                <div className="flex items-center justify-between gap-3">
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {crossings.map((crossing) => {
                      const active = selectedCrossingId === crossing.id;
                      return (
                        <button
                          key={crossing.id}
                          onClick={() => setSelectedCrossingId(crossing.id)}
                          className="relative shrink-0 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium"
                        >
                          {active && (
                            <motion.span
                              layoutId="crossing-pill-highlight"
                              className="absolute inset-0 rounded-full bg-verde"
                              transition={{ type: "spring", stiffness: 220, damping: 26 }}
                            />
                          )}
                          <span className={`relative z-10 ${active ? "text-white" : "text-ink"}`}>
                            {crossing.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {selectedCrossingId && (
                    <Button
                      variant={isFavorite ? "primary" : "outline"}
                      size="sm"
                      onClick={handleToggleFavorite}
                      disabled={savingFavorite}
                      className="shrink-0"
                      title={user ? undefined : "Inicia sesión para guardar tu garita favorita"}
                    >
                      <Star
                        className="h-4 w-4"
                        strokeWidth={1.8}
                        fill={isFavorite ? "currentColor" : "none"}
                      />
                      <span className="hidden sm:inline">
                        {isFavorite ? "Favorita" : "Marcar favorita"}
                      </span>
                    </Button>
                  )}
                </div>
              ) : (
                <EmptyState
                  title="Sin garitas registradas"
                  description="Aún no tenemos cruces cargados para esta ciudad."
                />
              )}
            </div>

            <ContextBar
              weather={weather ?? null}
              exchangeRate={exchangeRate ?? null}
              loading={loadingWeather || loadingRate}
            />

            {crossings && (
              <RecommendationBanner
                crossings={crossings}
                waitTimesByCrossing={citySummary}
                selectedCrossingId={selectedCrossingId}
                onSelect={setSelectedCrossingId}
              />
            )}

            {selectedCrossing && (
              <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="flex flex-col gap-4 lg:col-span-2">
                  <h2 className="font-display text-xl font-semibold text-ink">
                    {selectedCrossing.name}
                  </h2>

                  {loadingWaitTimes ? (
                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                      {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32 w-full" />
                      ))}
                    </div>
                  ) : waitTimes && waitTimes.length > 0 ? (
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedCrossing.id}
                        variants={gridVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 gap-4 xl:grid-cols-4"
                      >
                        {waitTimes.map((wt) => (
                          <LaneStatusCard key={wt.id} waitTime={wt} trend={trends[wt.laneType]} />
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <EmptyState
                      title="Sin datos recientes"
                      description="Todavía no hay suficientes registros para esta garita."
                    />
                  )}
                </div>

                {crossings && (
                  <div className="lg:col-span-1">
                    <CrossingMap
                      crossings={crossings}
                      waitTimesByCrossing={citySummary}
                      selectedCrossingId={selectedCrossingId}
                      onSelect={setSelectedCrossingId}
                    />
                  </div>
                )}
              </section>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}