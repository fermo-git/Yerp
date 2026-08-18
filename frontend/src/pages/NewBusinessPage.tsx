import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useMyBusinesses } from "@/hooks/useBusinesses";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { NewBusinessForm } from "@/components/business/NewBusinessForm";
import type { BusinessDTO } from "@/types/business";

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-ink/15 border-t-verde" />
    </div>
  );
}

function ActionCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="container-frontera py-16">
      <div className="mx-auto max-w-lg rounded-3xl border border-ink/10 bg-white p-8 text-center shadow-soft sm:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-verde-tint text-verde-deep">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M12 2 2 7l10 5 10-5-10-5z" strokeLinejoin="round" />
            <path d="m2 17 10 5 10-5M2 12l10 5 10-5" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-display text-xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-ink-soft">{description}</p>
        {children && <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">{children}</div>}
      </div>
    </div>
  );
}

export function NewBusinessPage() {
  const { user, status } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromRegister =
    (location.state as { fromRegister?: boolean } | null)?.fromRegister === true;
  const [open, setOpen] = useState(fromRegister);
  const [created, setCreated] = useState<BusinessDTO | null>(null);
  const { data: myBusinesses = [], isLoading: myBusinessesLoading } = useMyBusinesses();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Limpia el estado de navegación para que un refresh no reabra el formulario.
  useEffect(() => {
    if (fromRegister) navigate(location.pathname, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "loading") return <Spinner />;

  if (status === "unauthenticated") {
    return (
      <ActionCard
        title="Publica tu negocio"
        description="Para dar de alta un negocio en La Frontera necesitas una cuenta de dueño de negocio."
      >
        <Button size="lg" onClick={() => navigate("/login")}>
          Iniciar sesión
        </Button>
        <Button variant="outline" size="lg" onClick={() => navigate("/registro")}>
          Crear cuenta
        </Button>
      </ActionCard>
    );
  }

  if (user && user.role !== "BUSINESS_OWNER") {
    return (
      <ActionCard
        title="Tu cuenta no puede publicar negocios"
        description="Solo las cuentas de dueño de negocio pueden publicar. Si necesitas cambiar tu tipo de cuenta, contáctanos a través del chat de soporte."
      >
        <Button variant="outline" size="lg" onClick={() => navigate("/")}>
          Volver al inicio
        </Button>
      </ActionCard>
    );
  }

  return (
    <div className="container-frontera py-12">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-verde-deep">Negocios</p>
            <h1 className="mt-1 font-display text-2xl font-bold text-ink sm:text-3xl">Publica tu negocio</h1>
            <p className="mt-2 max-w-xl text-sm text-ink-soft">
              Completa los datos de tu negocio y sube hasta 10 imágenes. Tu negocio aparecerá en
              La Frontera al publicarlo.
            </p>
          </div>
          <Button size="lg" onClick={() => setOpen(true)} className="shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
            Publicar negocio
          </Button>
        </div>

        {created && (
          <div className="mt-8 rounded-3xl border border-verde/25 bg-verde-tint p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-verde text-white">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <h2 className="mt-4 font-display text-xl font-bold text-ink">¡Listo, {created.name}! </h2>
            <p className="mt-1 text-sm text-ink-soft">Tu negocio se publicó correctamente.</p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <Button size="lg" onClick={() => navigate(`/negocios/${created.slug}`)}>
                Ver mi negocio
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setCreated(null);
                  setOpen(true);
                }}
              >
                Publicar otro
              </Button>
            </div>
          </div>
        )}

        <div className="mt-8">
          <h2 className="font-display text-lg font-bold text-ink">Mis negocios</h2>
          <div className="mt-4">
            {myBusinessesLoading ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <BusinessCardSkeleton key={i} />
                ))}
              </div>
            ) : myBusinesses.length > 0 ? (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                {myBusinesses.map((business) => (
                  <BusinessCard key={business.id} business={business} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="Aún no has publicado nada"
                description="Pulsa “Publicar negocio” y llena el formulario para que aparezcas en La Frontera."
              />
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-asphalt/50 px-4 py-6 sm:py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Formulario para publicar negocio"
              className="relative my-auto w-full max-w-2xl rounded-3xl bg-white shadow-raised"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.18 }}
            >
              <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">¡Cuéntanos de tu negocio!</h2>
                  <p className="text-xs text-ink-soft">Algunos campos son opcionales</p>
                </div>
                <button
                  type="button"
                  aria-label="Cerrar"
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-6">
                <NewBusinessForm
                  onCancel={() => setOpen(false)}
                  onComplete={(business) => {
                    setCreated(business);
                    setOpen(false);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}