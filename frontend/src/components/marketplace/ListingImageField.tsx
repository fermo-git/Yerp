import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export function ListingImageField({
  value,
  onChange,
  currentImageUrl,
}: {
  value: File | null;
  onChange: (file: File | null) => void;
  currentImageUrl?: string | null;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  function pickFile(file: File) {
    setError(null);
    if (!ALLOWED.has(file.type)) {
      setError(`${file.name}: formato no permitido (JPG, PNG o WebP)`);
      return;
    }
    onChange(file);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) pickFile(file);
  }

  return (
    <div className="flex flex-col gap-3">
      {currentImageUrl && !value && (
        <div className="flex items-center gap-3 rounded-xl border border-ink/10 bg-white p-3">
          <img
            src={currentImageUrl}
            alt="Imagen actual"
            className="h-14 w-14 rounded-md border border-ink/10 object-cover"
          />
          <p className="text-xs text-ink-soft">
            Imagen actual. Sube una nueva para reemplazarla.
          </p>
        </div>
      )}

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
        aria-label="Seleccionar o arrastrar una imagen"
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
          Arrastra una imagen aquí o haz clic para seleccionar
        </p>
        <p className="text-xs text-ink-soft">1 imagen · JPG/PNG/WebP</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) pickFile(file);
          e.target.value = "";
        }}
      />

      {preview && (
        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-ink/10 bg-ink/5">
          <img src={preview} alt="Vista previa" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => {
              setError(null);
              onChange(null);
            }}
            aria-label="Quitar imagen"
            className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-ink/10 bg-white text-ink transition-colors hover:text-alto"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

      {error && <span className="text-xs text-alto">{error}</span>}
    </div>
  );
}
