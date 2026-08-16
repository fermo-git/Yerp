import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { CITY_OPTIONS } from "@/types/business";
import { MARKETPLACE_CATEGORY_OPTIONS } from "@/types/marketplace";
import type { CreateListingInput } from "@/types/marketplace";

const inputClassName =
  "w-full rounded-xl border border-ink/10 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink-soft/70 focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20";

const selectClassName =
  "w-full rounded-xl border border-ink/10 bg-white px-4 py-3.5 text-sm text-ink focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20";

const schema = z.object({
  title: z.string().min(3, "El título debe tener al menos 3 caracteres").max(120, "Máximo 120 caracteres"),
  description: z.string().max(2000, "Máximo 2000 caracteres").optional(),
  price: z.string().optional(),
  category: z.string().min(1, "Elige una categoría"),
  city: z.string().min(1, "Elige una ciudad"),
  imageUrl: z.string().optional(),
  contactName: z.string().max(100).optional(),
  contactPhone: z.string().max(20).optional(),
  contactWhatsapp: z.string().max(20).optional(),
  contactEmail: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface CreateListingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: CreateListingInput) => Promise<void>;
  isSubmitting: boolean;
  initialValues?: Partial<CreateListingInput>;
  mode?: "create" | "edit";
}

export function CreateListingModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  initialValues,
  mode = "create",
}: CreateListingModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      category: "",
      city: "",
      imageUrl: "",
      contactName: "",
      contactPhone: "",
      contactWhatsapp: "",
      contactEmail: "",
    },
  });

  useEffect(() => {
    if (!open) return;
    reset({
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      price: initialValues?.price != null ? String(initialValues.price) : "",
      category: initialValues?.category ?? "",
      city: initialValues?.city ?? "",
      imageUrl: initialValues?.imageUrl ?? "",
      contactName: initialValues?.contactName ?? "",
      contactPhone: initialValues?.contactPhone ?? "",
      contactWhatsapp: initialValues?.contactWhatsapp ?? "",
      contactEmail: initialValues?.contactEmail ?? "",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialValues, reset]);

  if (!open) return null;

  async function handleFormSubmit(values: FormValues) {
    const emptyToNull = (v: string | undefined) => (!v || v.trim() === "" ? null : v.trim());
    const priceNum = values.price && values.price.trim() !== "" ? Number(values.price) : null;

    const input: CreateListingInput = {
      title: values.title,
      category: values.category as CreateListingInput["category"],
      city: values.city,
      description: emptyToNull(values.description),
      price: priceNum !== null && !isNaN(priceNum) && priceNum >= 0 ? priceNum : null,
      imageUrl: emptyToNull(values.imageUrl),
      contactName: emptyToNull(values.contactName),
      contactPhone: emptyToNull(values.contactPhone),
      contactWhatsapp: emptyToNull(values.contactWhatsapp),
      contactEmail: emptyToNull(values.contactEmail),
    };
    await onSubmit(input);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/40 px-4 py-10 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-7 shadow-raised sm:p-9">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">
            {mode === "edit" ? "Editar publicación" : "Nueva publicación"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-ink/5 hover:text-ink"
            aria-label="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="mt-6 flex flex-col gap-4"
        >
          <Field label="Título *" error={errors.title?.message}>
            <input
              type="text"
              className={inputClassName}
              placeholder="Ej: iPhone 15 Pro Max 256GB"
              {...register("title")}
            />
          </Field>

          <Field label="Descripción" error={errors.description?.message}>
            <textarea
              className={`${inputClassName} min-h-[80px] resize-y`}
              placeholder="Describe tu artículo..."
              rows={3}
              {...register("description")}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Precio (MXN)" error={errors.price?.message}>
              <input
                type="number"
                step="0.01"
                className={inputClassName}
                placeholder="0.00"
                {...register("price")}
              />
            </Field>

            <Field label="Categoría *" error={errors.category?.message}>
              <select className={selectClassName} {...register("category")}>
                <option value="">Seleccionar...</option>
                {MARKETPLACE_CATEGORY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Ciudad *" error={errors.city?.message}>
            <select className={selectClassName} {...register("city")}>
              <option value="">Seleccionar...</option>
              {CITY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="URL de imagen" error={errors.imageUrl?.message}>
            <input
              type="url"
              className={inputClassName}
              placeholder="https://ejemplo.com/imagen.jpg"
              {...register("imageUrl")}
            />
          </Field>

          <div className="border-t border-ink/8 pt-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Datos de contacto
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Nombre" error={errors.contactName?.message}>
              <input
                type="text"
                className={inputClassName}
                placeholder="Tu nombre"
                {...register("contactName")}
              />
            </Field>

            <Field label="Teléfono" error={errors.contactPhone?.message}>
              <input
                type="tel"
                className={inputClassName}
                placeholder="664 123 4567"
                {...register("contactPhone")}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="WhatsApp" error={errors.contactWhatsapp?.message}>
              <input
                type="tel"
                className={inputClassName}
                placeholder="664 123 4567"
                {...register("contactWhatsapp")}
              />
            </Field>

            <Field label="Correo" error={errors.contactEmail?.message}>
              <input
                type="email"
                className={inputClassName}
                placeholder="tucorreo@ejemplo.com"
                {...register("contactEmail")}
              />
            </Field>
          </div>

          <div className="mt-2 flex gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="lg"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? mode === "edit"
                  ? "Guardando..."
                  : "Publicando..."
                : mode === "edit"
                ? "Guardar cambios"
                : "Publicar"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink/70">{label}</span>
      {children}
      {error && <p className="text-xs text-amber-deep">{error}</p>}
    </div>
  );
}
