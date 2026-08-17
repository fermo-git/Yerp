import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Saguaro } from "@/components/brand/Cactus";
import { RouteLine } from "@/components/brand/RouteLine";
import { SearchBar } from "@/components/search/SearchBar";
import { useAuth } from "@/hooks/useAuth";
import type { BorderCity } from "@/types/business";

export function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [city, setCity] = useState<BorderCity>(user?.city ?? "TIJUANA");

  useEffect(() => {
    if (user?.city) setCity(user.city);
  }, [user?.city]);

  function handleSearch(q: string, c: BorderCity) {
    const params = new URLSearchParams({ ciudad: c });
    if (q.trim()) params.set("q", q.trim());
    navigate(`/explorar?${params.toString()}`);
  }

  return (
    <section className="relative overflow-x-clip">
      <Saguaro className="absolute right-6 top-10 hidden w-28 lg:block xl:right-16" />

      <div className="container-frontera flex flex-col items-center pt-20 pb-24 text-center lg:pt-28 lg:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex w-full flex-col items-center"
        >
          <h1 className="mt-5 max-w-4xl font-display font-expanded text-[2.9rem] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink sm:text-6xl lg:text-7xl">
            ¿A dónde vas en la{" "}
            <span className="relative inline-block whitespace-nowrap">
              frontera
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.35, duration: 0.6, ease: "easeOut" }}
                className="absolute -bottom-1 left-0 h-1 w-full origin-left rounded-full bg-verde"
              />
            </span>
            ?
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-soft">
            Restaurantes, negocios, garitas y gasolina — la guía real de las ciudades
            fronterizas de México.
          </p>

          <div className="mt-9 w-full">
            <SearchBar
              city={city}
              onCityChange={setCity}
              onSubmit={handleSearch}
            />
          </div>
        </motion.div>
      </div>

      <RouteLine className="absolute bottom-0 left-0" />
    </section>
  );
}
