import type { ReactNode } from "react";

export const inputClassName =
  "w-full rounded-md border border-ink/10 bg-white px-4 py-3.5 text-sm text-ink placeholder:text-ink-soft/70 focus:border-verde focus:outline-none focus:ring-2 focus:ring-verde/20";

export function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-ink/70">{label}</span>
      {children}
      {error && (
        <p role="alert" className="text-xs font-medium text-alto">
          {error}
        </p>
      )}
    </div>
  );
}
