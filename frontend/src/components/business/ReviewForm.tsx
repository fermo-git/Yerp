import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/utils/cn";
import type { CreateReviewInput } from "@/types/business";

const schema = z.object({
  rating: z.number().int().min(1, "Elige una calificación").max(5),
  comment: z.string().max(500, "Máximo 500 caracteres"),
});

type FormValues = z.infer<typeof schema>;

interface ReviewFormProps {
  onSubmit: (input: CreateReviewInput) => void;
  isSubmitting: boolean;
  submitError?: string | null;
}

export function ReviewForm({ onSubmit, isSubmitting, submitError }: ReviewFormProps) {
  const { user } = useAuth();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, comment: "" },
  });

  if (!user) {
    return (
      <div className="rounded-xl border border-ink/10 bg-white p-5 text-sm text-ink-soft">
        <Link to="/login" className="font-medium text-verde hover:text-verde-deep">
          Inicia sesión
        </Link>{" "}
        para escribir una reseña.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onSubmit({ rating: values.rating, comment: values.comment.trim() || undefined });
        reset();
      })}
      className="rounded-xl border border-ink/10 bg-white p-5"
    >
      <h3 className="font-display text-base font-bold text-ink">Escribe tu reseña</h3>

      <Controller
        name="rating"
        control={control}
        render={({ field }) => (
          <div className="mt-3 flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => field.onChange(n)}
                aria-label={`${n} estrellas`}
                className="p-0.5"
              >
                <svg
                  viewBox="0 0 20 20"
                  className={cn(
                    "h-6 w-6 transition-colors",
                    n <= field.value ? "fill-amber-deep" : "fill-ink/10 hover:fill-ink/20"
                  )}
                >
                  <path d="M10 1.5l2.6 5.3 5.85.85-4.23 4.12 1 5.83L10 14.9l-5.22 2.7 1-5.83L1.55 7.65l5.85-.85L10 1.5z" />
                </svg>
              </button>
            ))}
          </div>
        )}
      />
      {errors.rating && <p className="mt-1 text-xs text-alto">{errors.rating.message}</p>}

      <textarea
        {...register("comment")}
        placeholder="Cuéntanos tu experiencia…"
        rows={3}
        className="mt-3 w-full rounded-md border border-ink/10 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink-soft/70 focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20"
      />
      {errors.comment && <p className="mt-1 text-xs text-alto">{errors.comment.message}</p>}

      {submitError && <p className="mt-2 text-xs text-alto">{submitError}</p>}

      <div className="mt-3 flex justify-end">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Publicando…" : "Publicar reseña"}
        </Button>
      </div>
    </form>
  );
}
