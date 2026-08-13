import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Biznaga } from "@/components/brand/Cactus";

export function PromoBanner() {
  return (
    <section className="container-frontera py-16">
      <div className="grid overflow-hidden rounded-2xl bg-white shadow-soft lg:grid-cols-2">
        <div className="relative min-h-[240px]">
          <img
            src="https://images.unsplash.com/photo-1555529771-122e5d9f2341?q=80&w=1400&auto=format&fit=crop"
            alt="Mercado artesanal en una ciudad fronteriza"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
        <div className="relative flex flex-col justify-center gap-4 p-8 sm:p-12 lg:border-l lg:border-ink/10">
          <Biznaga className="absolute right-6 top-6 w-14 opacity-80" />
          <Eyebrow>Negocios · publica gratis</Eyebrow>
          <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl">
            Pon tu negocio en el mapa.
          </h2>
          <p className="max-w-md text-ink-soft">
            Cientos de negocios locales ya están en La Frontera. Crea tu perfil y llega
            a tu ciudad.
          </p>
          <div className="mt-2">
            <Button variant="primary" size="lg">
              Publica tu negocio
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
