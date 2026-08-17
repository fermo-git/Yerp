import { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, inputClassName } from "@/components/auth/Field";
import { StepIndicator } from "@/components/auth/StepIndicator";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "@/components/business/ImageUploader";
import { MapPicker, type LatLng } from "@/components/business/MapPicker";
import { useCreateBusiness, useUploadGallery, useUploadMenu } from "@/hooks/useBusinesses";
import { cn } from "@/utils/cn";
import { readBusinessDraft, clearBusinessDraft } from "@/lib/businessDraft";
import {
  BORDER_CITIES,
  BUSINESS_CATEGORIES,
  CATEGORY_LABELS,
  CITY_OPTIONS,
  PRICE_RANGES,
  PRICE_RANGE_OPTIONS,
  type BorderCity,
  type BusinessCategory,
  type BusinessDTO,
  type BusinessHourDTO,
  type PriceRange,
} from "@/types/business";

const PHONE_RE = /^[+]?[\d\s().-]{7,}$/;
const HTML_RE = /[<>]/;
const CONTROL_RE = /[\x00-\x08\x0b\x0c\x0e-\x1f]/;
const MAX_IMAGES = 10;
const MENU_MAX_BYTES = 10 * 1024 * 1024;
const MENU_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "application/pdf"]);

const STEPS = ["Negocio", "Ubicación", "Contacto y horarios", "Fotos y menú"];

const STEP_FIELDS: Array<Array<keyof FormValues>> = [
  ["name", "description", "category", "priceRange"],
  ["city"],
  ["phone", "whatsapp", "email", "website"],
  ["images"],
];

const DAY_LABELS = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

interface HourRow {
  day: number;
  open: boolean;
  opensAt: string;
  closesAt: string;
}

const defaultHours = (): HourRow[] =>
  DAY_LABELS.map((_, day) => ({ day, open: day !== 0, opensAt: "09:00", closesAt: "18:00" }));

const emptyToUndef = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);
const cleanText = (s: string) => s.replace(/\s+/g, " ");

const safeOptional = (max: number) =>
  z
    .preprocess(emptyToUndef, z.string().trim().max(max).optional())
    .refine((s) => !s || !HTML_RE.test(s), "No se permite HTML")
    .refine((s) => !s || !CONTROL_RE.test(s), "Caracteres no válidos");

const requiredEnum = (values: readonly string[], message: string) =>
  z.custom<string>((v) => typeof v === "string" && values.includes(v), { message });

const optionalPhone = (label: string) =>
  z
    .preprocess(emptyToUndef, z.string().trim().max(40).optional())
    .refine((s) => !s || PHONE_RE.test(s), `${label} inválido`)
    .refine((s) => !s || !CONTROL_RE.test(s), "Caracteres no válidos");

const locationSchema = z
  .object({
    lat: z.number().min(-90, "Latitud inválida").max(90, "Latitud inválida"),
    lng: z.number().min(-180, "Longitud inválida").max(180, "Longitud inválida"),
  })
  .nullable()
  .optional();

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "El nombre es obligatorio")
    .max(80, "Máximo 80 caracteres")
    .refine((s) => !HTML_RE.test(s), "No se permite HTML")
    .refine((s) => !CONTROL_RE.test(s), "Caracteres no válidos")
    .transform(cleanText),
  description: z
    .string()
    .trim()
    .min(10, "La descripción es obligatoria (mínimo 10 caracteres)")
    .max(1000, "Máximo 1000 caracteres")
    .refine((s) => !HTML_RE.test(s), "No se permite HTML")
    .refine((s) => !CONTROL_RE.test(s), "Caracteres no válidos")
    .transform(cleanText),
  category: requiredEnum(BUSINESS_CATEGORIES, "Elige una categoría"),
  priceRange: requiredEnum(PRICE_RANGES, "Por favor selecciona tu rango de precio"),
  city: requiredEnum(BORDER_CITIES, "Elige una ciudad"),
  address: safeOptional(200),
  location: locationSchema,
  phone: optionalPhone("Teléfono"),
  whatsapp: optionalPhone("WhatsApp"),
  email: z.preprocess(emptyToUndef, z.string().trim().email("Correo inválido").max(120).optional()),
  website: z
    .preprocess(emptyToUndef, z.string().trim().max(200).optional())
    .refine((s) => !s || /^https?:\/\/\S+$/i.test(s), "Debe iniciar con http:// o https://")
    .refine((s) => !s || !CONTROL_RE.test(s), "Caracteres no válidos"),
  images: z
    .array(z.instanceof(File))
    .min(1, "Sube al menos una imagen")
    .max(MAX_IMAGES, `Máximo ${MAX_IMAGES} imágenes`),
});

type FormValues = z.infer<typeof schema>;

function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(inputClassName, " appearance-none pr-10", className)} {...props}>
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

const categoryOptions = BUSINESS_CATEGORIES.map((value) => ({
  value,
  label: CATEGORY_LABELS[value],
}));

function readDraftDefaults() {
  const draft = readBusinessDraft();
  return {
    name: draft?.name ?? "",
    description: draft?.description ?? "",
    category: draft?.category ?? (undefined as BusinessCategory | undefined),
  };
}

export function NewBusinessForm({
  onComplete,
  onCancel,
}: {
  onComplete: (business: BusinessDTO) => void;
  onCancel: () => void;
}) {
  const createMut = useCreateBusiness();
  const uploadMut = useUploadGallery();
  const menuMut = useUploadMenu();
  const submitting = createMut.isPending || uploadMut.isPending || menuMut.isPending;

  const [step, setStep] = useState(0);
  const [created, setCreated] = useState<BusinessDTO | null>(null);
  const [rootError, setRootError] = useState<string | null>(null);
  const [galleryError, setGalleryError] = useState<string | null>(null);
  const [menuError, setMenuError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [hoursEnabled, setHoursEnabled] = useState(false);
  const [hours, setHours] = useState<HourRow[]>(defaultHours);
  const [hoursError, setHoursError] = useState<string | null>(null);

  const [menuFile, setMenuFile] = useState<File | null>(null);
  const menuInputRef = useRef<HTMLInputElement>(null);
  const [draftDefaults] = useState(readDraftDefaults);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: draftDefaults.name,
      description: draftDefaults.description,
      category: draftDefaults.category,
      priceRange: undefined,
      city: undefined,
      address: "",
      location: undefined,
      phone: "",
      whatsapp: "",
      email: "",
      website: "",
      images: [],
    },
  });

  const watchedCity = useWatch({ control, name: "city" }) as BorderCity | undefined;
  const watchedAddress = useWatch({ control, name: "address" }) as string | undefined;

  function onMenuFile(f: File | undefined) {
    setMenuError(null);
    if (!f) return;
    if (!MENU_TYPES.has(f.type)) {
      setMenuError("El menú debe ser una imagen (JPG/PNG/WebP) o un PDF.");
      return;
    }
    if (f.size > MENU_MAX_BYTES) {
      setMenuError("El menú debe pesar máximo 10 MB.");
      return;
    }
    setMenuFile(f);
  }

  function updateHour(day: number, patch: Partial<HourRow>) {
    setHours((prev) => prev.map((h) => (h.day === day ? { ...h, ...patch } : h)));
  }

  function validateHours(): BusinessHourDTO[] | null {
    if (!hoursEnabled) return null;
    const open = hours.filter((h) => h.open);
    for (const h of open) {
      if (!(h.closesAt > h.opensAt)) {
        setHoursError(`${DAY_LABELS[h.day]}: el cierre debe ser después de la apertura.`);
        return null;
      }
    }
    setHoursError(null);
    return open.map(({ day, opensAt, closesAt }) => ({ dayOfWeek: day, opensAt, closesAt }));
  }

  async function handleNext() {
    if (step === 2 && hoursEnabled && !validateHours()) return;
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => s + 1);
  }

  async function onSubmit(values: FormValues) {
    setRootError(null);
    setGalleryError(null);
    setMenuError(null);
    setSuccessMsg(null);

    const hoursPayload = validateHours();
    if (hoursEnabled && !hoursPayload) return;

    const { images, ...input } = values;
    try {
      let business = created;
      if (!business) {
        setSuccessMsg("Creando tu negocio...");
        const res = await createMut.mutateAsync({
          name: input.name,
          description: input.description,
          category: input.category as BusinessCategory,
          priceRange: (input.priceRange as PriceRange | undefined) ?? undefined,
          city: input.city as BorderCity,
          address: input.address ?? undefined,
          latitude: input.location?.lat,
          longitude: input.location?.lng,
          phone: input.phone ?? undefined,
          whatsapp: input.whatsapp ?? undefined,
          email: input.email ?? undefined,
          website: input.website ?? undefined,
          hours: hoursPayload ?? undefined,
        });
        business = res.business;
        setCreated(business);
      }
      setSuccessMsg("Subiendo las imágenes...");
      await uploadMut.mutateAsync({ businessId: business.id, files: images });

      if (menuFile) {
        setSuccessMsg("Subiendo el menú...");
        await menuMut.mutateAsync({ businessId: business.id, file: menuFile });
      }

      setSuccessMsg(null);
      clearBusinessDraft();
      onComplete(business);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "No se pudo publicar el negocio";
      setSuccessMsg(null);
      if (created) setGalleryError(msg);
      else setRootError(msg);
    }
  }

  const lastStep = STEPS.length - 1;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <StepIndicator steps={STEPS} current={step} />

      {step === 0 && (
        <>
          <Field label="Nombre del negocio" error={errors.name?.message}>
            <input className={inputClassName} placeholder="Tacos El Fénix" maxLength={80} {...register("name")} />
          </Field>

          <Field label="Descripción" error={errors.description?.message}>
            <textarea
              className={cn(inputClassName, "min-h-[110px] resize-y")}
              placeholder="¿Qué ofreces? ¿Qué te hace diferente?"
              maxLength={1000}
              {...register("description")}
            />
          </Field>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Categoría" error={errors.category?.message}>
              <Select {...register("category")}>
                <option value="">Elige una categoría</option>
                {categoryOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Rango de precios" error={errors.priceRange?.message}>
              <Select {...register("priceRange")}>
                <option value="">Selecciona tu rango de precio</option>
                {PRICE_RANGE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <Field label="Ciudad" error={errors.city?.message}>
            <Select {...register("city")}>
              <option value="">Elige tu ciudad</option>
              {CITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>

          <div>
            <Controller
              control={control}
              name="location"
              render={({ field }) => (
                <MapPicker
                  addressValue={watchedAddress ?? ""}
                  onAddressChange={(addr) => setValue("address", addr, { shouldDirty: true, shouldValidate: false })}
                  location={(field.value as LatLng | null) ?? null}
                  onLocationChange={(v) => field.onChange(v)}
                  addressError={errors.address?.message}
                  city={watchedCity}
                />
              )}
            />
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Teléfono" optional error={errors.phone?.message}>
              <input type="tel" className={inputClassName} placeholder="+52 664 123 4567" maxLength={40} {...register("phone")} />
            </Field>
            <Field label="WhatsApp" optional error={errors.whatsapp?.message}>
              <input type="tel" className={inputClassName} placeholder="+52 664 123 4567" maxLength={40} {...register("whatsapp")} />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Correo" optional error={errors.email?.message}>
              <input type="email" className={inputClassName} placeholder="hola@negocio.com" maxLength={120} {...register("email")} />
            </Field>
            <Field label="Sitio web" optional error={errors.website?.message}>
              <input className={inputClassName} placeholder="https://negocio.com" maxLength={200} {...register("website")} />
            </Field>
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink">
              <input
                type="checkbox"
                checked={hoursEnabled}
                onChange={(e) => {
                  setHoursEnabled(e.target.checked);
                  setHoursError(null);
                }}
                className="h-4 w-4 accent-verde"
              />
              Agregar horarios de atención
              <span className="rounded bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft">
                Opcional
              </span>
            </label>

            {hoursEnabled && (
              <div className="mt-3 flex flex-col gap-2">
                {DISPLAY_ORDER.map((day) => {
                  const row = hours[day];
                  return (
                    <div key={day} className="grid grid-cols-[1fr_auto] items-center gap-2 sm:grid-cols-[90px_auto_1fr_1fr]">
                      <span className="text-xs font-medium text-ink/70">{DAY_LABELS[day]}</span>
                      <label className="flex items-center gap-1.5 text-xs text-ink-soft">
                        <input
                          type="checkbox"
                          checked={row.open}
                          onChange={(e) => updateHour(day, { open: e.target.checked })}
                          className="h-3.5 w-3.5 accent-verde"
                        />
                        Abierto
                      </label>
                      <input
                        type="time"
                        value={row.opensAt}
                        disabled={!row.open}
                        onChange={(e) => updateHour(day, { opensAt: e.target.value })}
                        className={cn(inputClassName, "px-2 py-1.5 text-xs disabled:opacity-40")}
                        aria-label={`Apertura ${DAY_LABELS[day]}`}
                      />
                      <input
                        type="time"
                        value={row.closesAt}
                        disabled={!row.open}
                        onChange={(e) => updateHour(day, { closesAt: e.target.value })}
                        className={cn(inputClassName, "px-2 py-1.5 text-xs disabled:opacity-40")}
                        aria-label={`Cierre ${DAY_LABELS[day]}`}
                      />
                    </div>
                  );
                })}
                {hoursError && <p className="text-xs text-alto">{hoursError}</p>}
              </div>
            )}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <div>
            <span className="text-xs font-medium text-ink/70">Imágenes (16:9)</span>
            <div className="mt-1.5">
              <Controller
                control={control}
                name="images"
                render={({ field, fieldState }) => (
                  <>
                    <ImageUploader value={field.value} onChange={field.onChange} />
                    {fieldState.error && (
                      <p className="mt-1.5 text-xs text-alto">{fieldState.error.message}</p>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="rounded-xl border border-ink/10 bg-white p-4">
            <span className="text-sm font-medium text-ink">Menú</span>
            <span className="ml-2 rounded bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft">
              Opcional
            </span>
            <div className="mt-2 flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => menuInputRef.current?.click()}>
                Subir menú (imagen o PDF)
              </Button>
              {menuFile && (
                <span className="flex items-center gap-2 text-xs text-ink-soft">
                  {menuFile.name}
                  <button type="button" onClick={() => setMenuFile(null)} aria-label="Quitar menú" className="text-alto">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                    </svg>
                  </button>
                </span>
              )}
            </div>
            <input
              ref={menuInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              className="hidden"
              onChange={(e) => onMenuFile(e.target.files?.[0])}
            />
            <p className="mt-2 text-[11px] text-ink-soft">JPG, PNG, WebP o PDF · máx 10 MB.</p>
            {menuError && <p className="mt-1 text-xs text-alto">{menuError}</p>}
          </div>
        </>
      )}

      {rootError && (
        <div className="rounded-xl border border-alto/40 bg-white px-4 py-3 text-sm text-alto">
          {rootError}
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-verde/30 bg-verde-tint px-4 py-3 text-sm text-verde-deep">
          {successMsg}
        </div>
      )}

      {created && galleryError && (
        <div className="rounded-xl border border-alto/40 bg-white px-4 py-3 text-sm text-alto">
          El negocio se creó, pero las imágenes no subieron: {galleryError}. Puedes reintentar abajo.
        </div>
      )}

      <div className="flex items-center gap-3 border-t border-ink/10 pt-1">
        <Button type="button" variant="ghost" size="lg" onClick={onCancel} className="flex-1" disabled={submitting}>
          {created ? "Cerrar" : "Cancelar"}
        </Button>
        {step > 0 && (
          <Button type="button" variant="ghost" size="lg" onClick={() => setStep((s) => s - 1)} disabled={submitting}>
            Atrás
          </Button>
        )}
        {step < lastStep ? (
          <Button type="button" size="lg" className="flex-1" onClick={handleNext} disabled={submitting}>
            Siguiente
          </Button>
        ) : (
          <Button type="submit" size="lg" className="flex-1" disabled={submitting}>
            {submitting
              ? created
                ? "Subiendo..."
                : "Publicando..."
              : created
                ? "Reintentar subida"
                : "Publicar negocio"}
          </Button>
        )}
      </div>

      <p className="text-center text-[11px] text-ink-soft">
        Los campos marcados como «Opcional» son libres. El resto es obligatorio.
      </p>
    </form>
  );
}
