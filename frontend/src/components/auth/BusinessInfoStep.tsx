import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, inputClassName } from "@/components/auth/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { CATEGORY_LABELS, BUSINESS_CATEGORIES, type BusinessCategory } from "@/types/business";
import { saveBusinessDraft, clearBusinessDraft, type BusinessDraft } from "@/lib/businessDraft";

const emptyToUndef = (v: unknown) => (typeof v === "string" && v.trim() === "" ? undefined : v);

const schema = z
  .object({
    name: z.preprocess(
      emptyToUndef,
      z.string().trim().min(2, "Mínimo 2 caracteres").max(80, "Máximo 80 caracteres").optional()
    ),
    category: z.preprocess(emptyToUndef, z.string().optional()),
    description: z.preprocess(
      emptyToUndef,
      z.string().trim().min(10, "Mínimo 10 caracteres").max(1000, "Máximo 1000 caracteres").optional()
    ),
  })
  .superRefine((v, ctx) => {
    const anyFilled = Boolean(v.name || v.category || v.description);
    if (anyFilled && !v.name) {
      ctx.addIssue({ code: "custom", path: ["name"], message: "Escribe el nombre de tu negocio" });
    }
    if (v.name && !v.category) {
      ctx.addIssue({
        code: "custom",
        path: ["category"],
        message: "Elige la categoría de tu negocio",
      });
    }
  });

type FormValues = z.infer<typeof schema>;

export interface BusinessInfoData {
  name: string;
  category?: BusinessCategory;
  description?: string;
}

function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select className={cn(inputClassName, "appearance-none pr-10", className)} {...props}>
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

export function BusinessInfoStep({
  initial,
  onNext,
  onBack,
}: {
  initial?: BusinessInfoData;
  onNext: (data: BusinessInfoData | null) => void;
  onBack: () => void;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: initial?.name ?? "",
      category: initial?.category ?? "",
      description: initial?.description ?? "",
    },
  });

  function onSubmit(values: FormValues) {
    const data: BusinessInfoData = {
      name: values.name ?? "",
      category: values.category as BusinessCategory | undefined,
      description: values.description,
    };
    saveBusinessDraft(data as BusinessDraft);
    onNext(data);
  }

  return (
    <div>
      <p className="text-sm text-ink-soft">
        Este paso es opcional: te adelantamos la publicación de tu negocio. Puedes omitirlo y
        completarlo después.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
        <Field label="Nombre del negocio" error={errors.name?.message}>
          <input
            className={inputClassName}
            placeholder="Tacos El Fénix"
            maxLength={80}
            {...register("name")}
          />
        </Field>

        <Field label="Categoría" error={errors.category?.message}>
          <Select {...register("category")}>
            <option value="">Elige una categoría</option>
            {BUSINESS_CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {CATEGORY_LABELS[value]}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Descripción (opcional)" error={errors.description?.message}>
          <textarea
            className={cn(inputClassName, "min-h-[96px] resize-y")}
            placeholder="¿Qué ofreces? ¿Qué te hace diferente?"
            maxLength={1000}
            {...register("description")}
          />
        </Field>

        <div className="mt-2 flex flex-col-reverse items-center gap-3 sm:flex-row">
          <Button variant="ghost" size="lg" type="button" onClick={onBack} className="flex-1">
            Atrás
          </Button>
          <Button
            variant="ghost"
            size="lg"
            type="button"
            onClick={() => {
              clearBusinessDraft();
              onNext(null);
            }}
            className="flex-1"
          >
            Omitir por ahora
          </Button>
          <Button type="submit" size="lg" className="flex-1">
            Continuar
          </Button>
        </div>
      </form>
    </div>
  );
}