import type { BorderCrossing } from "@/types/crossing";

interface CrossingSelectorProps {
  crossings: BorderCrossing[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function CrossingSelector({ crossings, selectedId, onSelect }: CrossingSelectorProps) {
  if (crossings.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {crossings.map((crossing) => (
        <button
          key={crossing.id}
          onClick={() => onSelect(crossing.id)}
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            selectedId === crossing.id
              ? "border-verde bg-verde text-white"
              : "border-ink/15 bg-white text-ink hover:bg-ink/5"
          }`}
        >
          {crossing.name}
        </button>
      ))}
    </div>
  );
}