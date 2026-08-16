import { Biznaga } from "@/components/brand/Cactus";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-xl border border-dashed border-ink/15 bg-white px-6 py-16 text-center">
      <Biznaga className="w-24" />
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
        {description && <p className="text-sm text-ink/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}
