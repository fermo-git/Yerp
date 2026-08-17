export function StepIndicator({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-ink-soft">
        <span>{steps[current]}</span>
        <span>
          Paso {current + 1} de {steps.length}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full rounded-full bg-verde transition-all duration-300"
          style={{ width: `${((current + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  );
}
