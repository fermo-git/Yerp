import { RouteLine } from "@/components/brand/RouteLine";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
}

export function AdminPageHeader({ eyebrow, title, description }: AdminPageHeaderProps) {
  return (
    <header>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h1>
      {description && <p className="mt-2 max-w-xl text-sm text-ink-soft">{description}</p>}
      <RouteLine className="mt-6" />
    </header>
  );
}
