import { Link } from "react-router-dom";
import type { ReactNode } from "react";

const AUTH_BG =
  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1800&auto=format&fit=crop";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-5 py-16">
      <img src={AUTH_BG} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-paper/85" aria-hidden="true" />

      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Link to="/" className="flex items-center gap-2.5" aria-label="La Frontera — inicio">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-verde text-white">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M2 10h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <rect x="7" y="7" width="6" height="6" rx="1" fill="currentColor" transform="rotate(45 10 10)" />
              </svg>
            </span>
            <span className="font-display text-[15px] font-extrabold uppercase tracking-wide text-ink">
              La Frontera
            </span>
          </Link>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-raised sm:p-10">
          <h1 className="text-center font-display text-[26px] font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-center text-sm text-ink-soft">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>
      </div>
    </div>
  );
}
