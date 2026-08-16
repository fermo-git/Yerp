import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand/Wordmark";
import { RouteLine } from "@/components/brand/RouteLine";

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
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center px-5 py-16">
      <div className="relative w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Wordmark size="lg" />
        </div>

        <div className="rounded-xl border border-ink/10 bg-white p-7 sm:p-10">
          <h1 className="text-center font-display font-expanded text-[26px] font-bold text-ink">
            {title}
          </h1>
          {subtitle && <p className="mt-1.5 text-center text-sm text-ink-soft">{subtitle}</p>}
          <div className="mt-7">{children}</div>
        </div>

        <RouteLine className="mt-10" />
      </div>
    </div>
  );
}
