interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-carbon/15 bg-white px-6 py-16 text-center">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" aria-hidden="true">
        <circle cx="36" cy="36" r="36" fill="#E6F0EA" />
        <path
          d="M22 46c0-9.5 7-15 14-15s14 5.5 14 15"
          stroke="#1E6F4F"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx="29" cy="27" r="3" fill="#1E6F4F" />
        <circle cx="43" cy="27" r="3" fill="#1E6F4F" />
      </svg>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h3 className="font-display text-lg font-semibold text-carbon">{title}</h3>
        {description && <p className="text-sm text-carbon/60">{description}</p>}
      </div>
      {action}
    </div>
  );
}
