import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const TABS = [
  { key: "todo", label: "Buscar todo" },
  { key: "negocios", label: "Negocios" },
  { key: "turismo", label: "Turismo" },
  { key: "marketplace", label: "Marketplace" },
] as const;

export function Hero() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("todo");
  const [query, setQuery] = useState("");

  return (
    <section className="container-frontera pt-14 pb-10 sm:pt-20">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center"
      >
        <span className="inline-flex items-center rounded-full bg-cactus-light px-3 py-1 text-xs font-medium text-cactus-dark">
          10 ciudades fronterizas, un solo lugar
        </span>
        <h1 className="font-display text-4xl font-semibold leading-[1.1] text-carbon sm:text-5xl">
          ¿A dónde vas hoy en la frontera?
        </h1>
        <p className="max-w-lg text-balance text-carbon/60">
          Restaurantes, negocios locales, turismo y eventos —todo lo que pasa
          de tu lado de la línea.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mx-auto mt-8 max-w-2xl"
      >
        <div className="flex gap-5 border-b border-carbon/8 px-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`border-b-2 pb-3 text-sm font-medium transition-colors ${
                tab === t.key ? "border-carbon text-carbon" : "border-transparent text-carbon/45 hover:text-carbon/70"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="mt-4 flex items-center gap-2 rounded-full border border-carbon/10 bg-white p-2 shadow-card"
        >
          <svg className="ml-3 shrink-0 text-carbon/40" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Tacos, café de especialidad, Tijuana..."
            className="flex-1 bg-transparent px-1 text-sm text-carbon placeholder:text-carbon/40 focus:outline-none"
          />
          <Button type="submit" size="md">
            Buscar
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
