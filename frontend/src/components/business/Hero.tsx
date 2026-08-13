import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Saguaro } from "@/components/brand/Cactus";
import { RouteLine } from "@/components/brand/RouteLine";
import { PinIcon } from "@/components/brand/Icons";
import { CITY_OPTIONS } from "@/types/business";

export function Hero() {
  const [city, setCity] = useState("TIJUANA");
  const [query, setQuery] = useState("");

  return (
    <section className="relative overflow-hidden">
      <Saguaro className="absolute right-6 top-10 hidden w-28 lg:block xl:right-16" />

      <div className="container-frontera flex flex-col items-center pt-20 pb-20 text-center lg:pt-28 lg:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex w-full flex-col items-center"
        >
       

          <Eyebrow>Descubre la frontera · 10 ciudades</Eyebrow>

          <h1 className="mt-5 max-w-3xl font-display text-[2.9rem] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink sm:text-6xl lg:text-7xl">
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

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-9 flex w-full max-w-2xl items-center gap-1 rounded-full border border-ink/10 bg-white p-2 shadow-raised"
          >
            <label className="flex items-center gap-2 rounded-full py-2.5 pl-4 pr-1">
              <PinIcon className="h-4 w-4 shrink-0 text-verde" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
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
            <span className="hidden h-6 w-px bg-ink/10 sm:block" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="¿Qué buscas?"
              className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 focus:outline-none"
            />
            <Button type="submit" size="lg" className="rounded-full px-6 sm:shrink-0">
              Buscar
            </Button>
          </form>
        </motion.div>
      </div>

      <RouteLine className="absolute bottom-0 left-0" />
    </section>
  );
}
