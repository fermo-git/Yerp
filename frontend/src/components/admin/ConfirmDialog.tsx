import { Button } from "@/components/ui/Button";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Eliminar",
  isPending,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/40 px-4">
      <div className="absolute inset-0" onClick={isPending ? undefined : onCancel} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-raised"
      >
        <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
        {description && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>}
        <div className="mt-5 flex gap-2">
          <Button variant="outline" size="md" className="flex-1" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
          <Button
            variant="secondary"
            size="md"
            className="flex-1 bg-alto text-white hover:bg-alto"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Eliminando..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
