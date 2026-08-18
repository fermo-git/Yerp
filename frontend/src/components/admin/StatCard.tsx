import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: number | string;
  detail?: string;
  alert?: boolean;
}

export function StatCard({ label, value, detail, alert }: StatCardProps) {
  return (
    <div className="rounded-xl border border-ink/10 bg-white p-5">
      <p className="font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
        {label}
      </p>
      <p
        className={cn(
          "mt-2 font-mono text-[32px] font-semibold leading-none tabular-nums tracking-tight",
          alert ? "text-amber-deep" : "text-ink"
        )}
      >
        {value}
      </p>
      {detail && <p className="mt-2 text-sm text-ink-soft">{detail}</p>}
    </div>
  );
}
