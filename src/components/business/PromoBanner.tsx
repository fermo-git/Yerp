import { Button } from "@/components/ui/Button";

export function PromoBanner() {
  return (
    <section className="container-frontera py-10">
      <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-cactus md:grid-cols-2">
        <div className="relative aspect-[4/3] md:aspect-auto">
          <img
            src="https://images.unsplash.com/photo-1533387520709-752d83de3630?q=80&w=1200&auto=format&fit=crop"
            alt="Mercado de artesanías en una ciudad fronteriza"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-4 p-8 sm:p-12">
          <h2 className="font-display text-3xl font-semibold leading-tight text-white sm:text-4xl">
            Impulsa tu negocio en tu ciudad fronteriza
          </h2>
          <p className="text-cactus-light/90 text-white/85">
            Súmate a los cientos de negocios y emprendimientos locales que ya
            están en La Frontera. Publica gratis tu perfil, productos y
            promociones.
          </p>
          <Button variant="secondary" size="lg">
            Publica tu negocio
          </Button>
        </div>
      </div>
    </section>
  );
}
