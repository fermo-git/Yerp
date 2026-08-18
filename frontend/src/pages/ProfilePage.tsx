import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useFavorites } from "@/hooks/useFavorites";
import { Field, inputClassName } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Skeleton } from "@/components/ui/Skeleton";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { BusinessCard } from "@/components/business/BusinessCard";
import { BusinessCardSkeleton } from "@/components/ui/Skeleton";
import { CITY_OPTIONS, CITY_LABELS, type BorderCity } from "@/types/business";
import type { UserRole } from "@/types/user";
import { uploadAvatarImage } from "@/services/api/auth";

const ROLE_LABELS: Record<UserRole, string> = {
  USER: "Explorador",
  BUSINESS_OWNER: "Dueño de negocio",
  ADMIN: "Admin",
};

const selectClassName =
  "w-full rounded-md border border-ink/10 bg-white px-4 py-3.5 text-sm text-ink focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20";

const schema = z.object({
  name: z.string().min(2, "Tu nombre debe tener al menos 2 caracteres").max(80, "Máximo 80 caracteres"),
  phone: z.string().max(20, "Máximo 20 caracteres").optional(),
  city: z.string().min(1, "Elige tu ciudad"),
});

type FormValues = z.infer<typeof schema>;

type UpgradeState = "idle" | "pending" | "success" | "error";

export function ProfilePage() {
  const { user, status, updateMe, upgradeToOwner } = useAuth();
  const navigate = useNavigate();
  const { data: favorites, isLoading: favoritesLoading } = useFavorites();

  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState<UpgradeState>("idle");
  const [upgradeError, setUpgradeError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      city: user?.city ?? "",
    },
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      navigate("/login");
    }
  }, [status, navigate]);

  if (status === "loading" || !user) {
    return (
      <section className="container-frontera py-10 sm:py-14">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="mt-3 h-9 w-56" />
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <Skeleton className="h-96 w-full rounded-xl" />
          <Skeleton className="h-72 w-full rounded-xl" />
        </div>
      </section>
    );
  }

  async function handleSave(values: FormValues) {
    setSaved(false);
    setSaveError(null);
    const emptyToNull = (v: string | undefined) => (!v || v.trim() === "" ? null : v.trim());
    try {
      await updateMe({
        name: values.name,
        phone: emptyToNull(values.phone),
        city: values.city as BorderCity,
      });
      setSaved(true);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "No se pudieron guardar tus cambios. Intenta de nuevo."
      );
    }
  }

  async function handleAvatarFile(file: File) {
    const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);
    if (!ALLOWED.has(file.type)) {
      setAvatarError("Formato no permitido (JPG, PNG o WebP)");
      return;
    }
    setAvatarError(null);
    setAvatarUploading(true);
    try {
      const url = await uploadAvatarImage(file);
      await updateMe({ avatarUrl: url });
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : "No se pudo subir la foto. Intenta de nuevo."
      );
    } finally {
      setAvatarUploading(false);
    }
  }

  async function handleUpgrade() {
    setUpgrade("pending");
    setUpgradeError(null);
    try {
      await upgradeToOwner();
      setUpgrade("success");
    } catch (err) {
      setUpgradeError(
        err instanceof Error ? err.message : "No se pudo actualizar tu cuenta. Intenta de nuevo."
      );
      setUpgrade("error");
    }
  }

  return (
    <>
      <section className="container-frontera py-10 sm:py-14">
        <Eyebrow>Tu cuenta</Eyebrow>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Perfil
        </h1>
        <p className="mt-2 max-w-lg text-sm text-ink-soft">
          Administra tu información personal y el rol de tu cuenta.
        </p>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-xl border border-ink/10 bg-white p-6 sm:p-8">
            <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
              Información personal
            </h2>

            <form onSubmit={handleSubmit(handleSave)} className="mt-5 flex flex-col gap-4">
              <Field label="Nombre" error={errors.name?.message}>
                <input type="text" className={inputClassName} {...register("name")} />
              </Field>

              <Field label="Teléfono" error={errors.phone?.message} optional>
                <input
                  type="tel"
                  className={inputClassName}
                  placeholder="664 123 4567"
                  {...register("phone")}
                />
              </Field>

              <Field label="Ciudad" error={errors.city?.message}>
                <select className={selectClassName} {...register("city")}>
                  {CITY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-ink/70">Foto de perfil</span>
                <div className="flex items-center gap-4">
                  <span
                    className={`flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-verde-tint text-xl font-bold text-verde-deep ${
                      avatarUploading ? "animate-pulse" : ""
                    }`}
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </span>
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={avatarUploading}
                    >
                      {avatarUploading ? "Subiendo..." : "Subir foto nueva"}
                    </Button>
                    <p className="text-[11px] text-ink-soft">
                      JPG, PNG o WebP. Se guarda al instante.
                    </p>
                  </div>
                </div>
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void handleAvatarFile(file);
                    e.target.value = "";
                  }}
                />
                {avatarError && (
                  <p role="alert" className="text-xs font-medium text-alto">
                    {avatarError}
                  </p>
                )}
              </div>

              {saved && (
                <div className="rounded-xl border border-verde/30 bg-verde-tint px-4 py-3 text-sm text-verde-deep">
                  Tus cambios se guardaron.
                </div>
              )}
              {saveError && (
                <div role="alert" className="rounded-xl border border-alto/40 bg-white px-4 py-3 text-sm text-alto">
                  {saveError}
                </div>
              )}

              <div className="mt-1">
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? "Guardando..." : "Guardar cambios"}
                </Button>
              </div>
            </form>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-ink/10 bg-white p-6">
              <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
                Tu cuenta
              </h2>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                <div>
                  <dt className="text-xs text-ink-soft">Rol actual</dt>
                  <dd className="mt-0.5">
                    <Badge tone={user.role === "BUSINESS_OWNER" ? "verde" : "neutral"}>
                      {ROLE_LABELS[user.role]}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-soft">Correo</dt>
                  <dd className="mt-0.5 font-medium text-ink">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-soft">Ciudad</dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {CITY_LABELS[user.city as BorderCity] ?? user.city}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-soft">Miembro desde</dt>
                  <dd className="mt-0.5 font-medium text-ink">
                    {new Date(user.createdAt).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-soft">Intereses</dt>
                  <dd className="mt-1.5 flex flex-wrap gap-1.5">
                    {user.interests.length > 0 ? (
                      user.interests.map((i) => (
                        <span
                          key={i}
                          className="rounded-full border border-ink/10 bg-white px-2.5 py-0.5 text-xs font-medium text-ink"
                        >
                          {i}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-ink-soft">Sin intereses</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white p-6">
              <h2 className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
                Dueño de negocio
              </h2>
              {user.role === "BUSINESS_OWNER" ? (
                <>
                  <p className="mt-3 text-sm leading-relaxed text-ink">
                    Ya tienes cuenta de dueño: puedes publicar tu negocio con fotos, horarios y menú.
                  </p>
                  <Button
                    size="lg"
                    className="mt-4 w-full"
                    onClick={() => navigate("/negocios/nuevo")}
                  >
                    Publicar mi negocio
                  </Button>
                </>
              ) : user.role === "ADMIN" ? (
                <p className="mt-3 text-sm leading-relaxed text-ink">
                  Las cuentas de administrador no cambian de rol.
                </p>
              ) : (
                <>
                  <p className="mt-3 text-sm leading-relaxed text-ink">
                    Convierte tu cuenta en dueño de negocio y publica tu restaurante, tienda o
                    servicio en La Frontera.
                  </p>
                  <Button
                    variant="secondary"
                    size="lg"
                    className="mt-4 w-full"
                    onClick={handleUpgrade}
                  >
                    Convertirme en dueño de negocio
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Eyebrow>Guardados</Eyebrow>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-ink">
            Tus favoritos
          </h2>

          <div className="mt-5">
            {favoritesLoading && (
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <BusinessCardSkeleton key={i} />
                ))}
              </div>
            )}

            {!favoritesLoading && (favorites?.length ?? 0) === 0 && (
              <EmptyState
                title="Aún no tienes favoritos"
                description="Toca el corazón en cualquier restaurante o negocio para guardarlo aquí."
                action={
                  <Button variant="outline" onClick={() => navigate("/explorar")}>
                    Explorar negocios
                  </Button>
                }
              />
            )}

            {!favoritesLoading && (favorites?.length ?? 0) > 0 && (
              <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
                {favorites?.map((b) => (
                  <BusinessCard key={b.id} business={b} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {upgrade !== "idle" && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 px-4">
          <div
            className="absolute inset-0"
            onClick={upgrade === "pending" ? undefined : () => setUpgrade("idle")}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-live="polite"
            className="relative w-full max-w-md rounded-xl bg-white p-7 text-center shadow-raised"
          >
            {upgrade === "pending" && (
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-verde-tint">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-verde" />
                </div>
                <div>
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
                    Un momento
                  </p>
                  <h2 className="mt-1.5 font-display text-lg font-bold text-ink">
                    Actualizando tu cuenta...
                  </h2>
                </div>
              </div>
            )}

            {upgrade === "success" && (
              <div className="flex flex-col items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-verde-tint text-verde-deep">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">
                    ¡Ya eres dueño de negocio!
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                    Ahora puedes publicar tu negocio con fotos, horarios y menú.
                  </p>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Button
                    size="lg"
                    onClick={() => {
                      setUpgrade("idle");
                      navigate("/negocios/nuevo");
                    }}
                  >
                    Publicar mi negocio
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setUpgrade("idle")}>
                    Seguir en mi perfil
                  </Button>
                </div>
              </div>
            )}

            {upgrade === "error" && (
              <div className="flex flex-col items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-alto/30 bg-white text-alto">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink">
                    No se pudo actualizar tu cuenta
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-alto">{upgradeError}</p>
                </div>
                <div className="flex w-full flex-col gap-2">
                  <Button size="lg" onClick={handleUpgrade}>
                    Reintentar
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setUpgrade("idle")}>
                    Cerrar
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
