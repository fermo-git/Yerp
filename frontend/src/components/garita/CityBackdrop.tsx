import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getCityBackgroundUrl, CITY_BG_FALLBACK } from "@/lib/cityBackgrounds";

export function CityBackdrop({ city }: { city: string }) {
  const [src, setSrc] = useState(getCityBackgroundUrl(city));

  useEffect(() => {
    setSrc(getCityBackgroundUrl(city));
  }, [city]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          src={src}
          onError={() => setSrc(CITY_BG_FALLBACK)}
          alt=""
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-paper/85" aria-hidden="true" />
    </div>
  );
}