import type { ReactNode } from "react";

export const inputClassName =
  "w-full rounded-xl border border-ink/10 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink-soft/70 focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20";

export function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex items-center gap-1.5 text-xs font-medium text-ink/70">
        {label}
        {optional && (
          <span className="rounded bg-ink/5 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-ink-soft">
            Opcional
          </span>
        )}
      </span>
      {children}
      {error && <p className="text-xs text-amber-deep">{error}</p>}
    </div>
  );
}
