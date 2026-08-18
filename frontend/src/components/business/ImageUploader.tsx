import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

const MAX_FILES = 10;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

interface Preview {
  id: string;
  url: string;
}

export function ImageUploader({
  value,
  onChange,
}: {
  value: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previews, setPreviews] = useState<Preview[]>([]);

  useEffect(() => {
    const next = value.map((file, i) => ({
      id: `${file.name}-${file.size}-${i}`,
      url: URL.createObjectURL(file),
    }));
    setPreviews(next);
    return () => {
      next.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [value]);

  const addFiles = useCallback(
    async (incoming: FileList | File[]) => {
      setError(null);
      const candidates = Array.from(incoming);
      const remaining = MAX_FILES - value.length;
      if (remaining <= 0) {
        setError(`Ya tienes ${MAX_FILES} imágenes (el máximo).`);
        return;
      }
      const accepted: File[] = [];
      const errors: string[] = [];
      let overflow = 0;
      for (const file of candidates) {
        if (accepted.length + value.length >= MAX_FILES) {
          overflow += 1;
          continue;
        }
        if (!ALLOWED.has(file.type)) {
          errors.push(`${file.name}: formato no permitido (JPG, PNG o WebP)`);
          continue;
        }
        accepted.push(file);
      }
      if (accepted.length) onChange([...value, ...accepted]);
      const msgs = [...errors];
      if (overflow > 0) msgs.push(`${overflow} imagen(es) ignorada(s): límite de ${MAX_FILES}`);
      if (msgs.length) setError(msgs.join(" · "));
    },
    [value, onChange]
  );

  const remove = (index: number) => {
    setError(null);
    onChange(value.filter((_, i) => i !== index));
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) void addFiles(e.dataTransfer.files);
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        aria-label="Seleccionar o arrastrar imágenes"
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-5 py-8 text-center transition-colors",
          dragOver
            ? "border-verde bg-verde-tint"
            : "border-ink/15 bg-white hover:border-verde/50 hover:bg-verde-tint/40"
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-verde-tint text-verde-deep">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path d="M12 16V4M7 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 17v1a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-sm font-medium text-ink">
          Arrastra imágenes aquí o haz clic para seleccionar
        </p>
        <p className="text-xs text-ink-soft">
          Hasta {MAX_FILES} · JPG/PNG/WebP
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) void addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {previews.map((p, i) => (
            <div
              key={p.id}
              className="group relative aspect-video overflow-hidden rounded-xl border border-ink/10 bg-ink/5"
            >
              <img src={p.url} alt={`Imagen ${i + 1}`} className="h-full w-full object-cover" />
              <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white">
                {i + 1}
              </span>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label={`Quitar imagen ${i + 1}`}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:text-alto"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-ink-soft">
          {value.length}/{MAX_FILES} seleccionadas
        </span>
        {error && <span className="text-alto">{error}</span>}
      </div>
    </div>
  );
}