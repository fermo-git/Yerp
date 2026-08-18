import type { ReactNode } from "react";
import { CategoryPill } from "@/components/business/CategoryPill";

export interface FilterStripItem {
  value: string;
  label: string;
  icon: ReactNode;
}

interface FilterStripProps {
  items: FilterStripItem[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
}

export function FilterStrip({ items, value, onChange, ariaLabel }: FilterStripProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="flex gap-7 overflow-x-auto border-b border-ink/10 py-4"
    >
      {items.map((item) => (
        <CategoryPill
          key={item.value}
          label={item.label}
          icon={item.icon}
          active={value === item.value}
          onClick={() => onChange(item.value)}
        />
      ))}
    </div>
  );
}
